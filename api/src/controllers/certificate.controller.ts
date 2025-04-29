import {
  Filter,
  FilterExcludingWhere,
  repository,
} from "@loopback/repository";
import {
  post,
  param,
  get,
  getModelSchemaRef,
  put,
  del,
  patch,
  requestBody,
  response,
  HttpErrors,
  Response,
  RestBindings,
  Request
} from "@loopback/rest";
import { Certificate } from "../models";
import { CertificateRepository } from "../repositories";
import { authenticate, TokenService, UserService } from '@loopback/authentication';
import { basicAuthorization } from '../middlewares/auth.middleware';
import { authorize } from '@loopback/authorization';
import * as dotenv from 'dotenv';
import * as fs from "fs";
import * as path from "path";
import { SecurityBindings, UserProfile } from '@loopback/security';
import { inject } from "@loopback/core";
import { LogService } from "../services/log.service";
import * as useragent from 'useragent';
import * as forge from 'node-forge';

const { BlobServiceClient } = require('@azure/storage-blob');
dotenv.config({ path: "src/controllers/specs/azure/.env" });

export class CertificateController {
  constructor(
    @repository(CertificateRepository)
    public certificateRepository: CertificateRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @inject('services.LogService') private logService: LogService,
  ) {}

  // POST endpoint:
  @post("/certificates")
  @response(200, {
    description: "Certificate model instance",
    content: { "application/json": { schema: getModelSchemaRef(Certificate) } },
  })
  @authenticate("jwt")
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Certificate, {
            title: "NewCertificate",
            exclude: ["id"],
            optional: ["last_modified", "last_modified_user_id"],
          }),
        },
      },
    })
    certificate: Omit<Certificate, "id">,
    @inject(SecurityBindings.USER) currentUser: UserProfile
  ): Promise<Certificate> {
    this.validateCertificates(certificate);
    
    if (certificate.srv_cert) {
      try {
        const parsedCert = forge.pki.certificateFromPem(certificate.srv_cert);
        certificate.issue_date = parsedCert.validity.notBefore.toISOString();
        certificate.expiration_date = parsedCert.validity.notAfter.toISOString();
        const issuerCN = parsedCert.issuer.getField("CN");
        certificate.issuer_name = issuerCN ? issuerCN.value : "";
      } catch (error) {
        throw new HttpErrors.BadRequest("Falha ao analisar o certificado público para extrair as datas.");
      }
    } else if (certificate.issue_date) {
      const issueDate = new Date(certificate.issue_date);
      if (isNaN(issueDate.getTime())) {
        throw new HttpErrors.BadRequest('A data de emissão deve ser válida!');
      }
      certificate.issue_date = issueDate.toISOString();
      
      if (certificate.expiration_date) {
        const expirationDate = new Date(certificate.expiration_date);
        if (isNaN(expirationDate.getTime())) {
          throw new HttpErrors.BadRequest('A data de expiração deve ser válida!');
        }
        certificate.expiration_date = expirationDate.toISOString();
      }
    }
    
    const now = new Date();
    certificate.last_modified = now.toISOString();
    certificate.last_modified_user_id = currentUser.id;
    
    return this.certificateRepository.create(certificate);
  }

  // GET endpoints:
  @get("/certificates")
  @response(200, {
    description: "Array of Certificate model instances",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: getModelSchemaRef(Certificate, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.filter(Certificate) filter?: Filter<Certificate>
  ): Promise<Certificate[]> {
    if (filter?.where && (filter.where as any).name) {
      (filter.where as any).name = { ilike: `%${(filter.where as any).name}%` };
    }
    const countResult = await this.certificateRepository.count(filter?.where || {});
    response.setHeader("x-total-count", countResult.count);
    response.setHeader("Access-Control-Expose-Headers", "x-total-count");
    
    return this.certificateRepository.find({
      ...filter,
      fields: {
        id: true,
        name: true,
        file_path: true,
        issue_date: true,
        issuer_name: true,
        expiration_date: true,
        is_active: true,
      },
    });
  }

  @get("/certificates/{id}")
  @response(200, {
    description: "Certificate model instance",
    content: {
      "application/json": {
        schema: getModelSchemaRef(Certificate, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number("id") id: number,
    @param.filter(Certificate, { exclude: "where" })
    filter?: FilterExcludingWhere<Certificate>
  ): Promise<Certificate> {
    return this.certificateRepository.findById(id, filter);
  }
  
  @get('/certificates/validate/{id}')
  @response(200, {
    description: 'Validação do Certificado',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async validateCertificate(
    @param.path.number('id') id: number,
  ): Promise<{id: number; is_valid: boolean; message: string, expires_at?: Date}> {
    const certificate = await this.certificateRepository.findById(id);

    const isValid = !certificate.is_active;
    const message = isValid ? 'O certificado é válido.' : 'O certificado está expirado.';

    return { id, is_valid: isValid, message, expires_at: new Date(certificate.expiration_date) };
  }

  @get("/certificates/issuers")
  @response(200, {
    description: "Lista de emissores únicos de certificados",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
  })
  async getIssuers(): Promise<string[]> {
    const certificates = await this.certificateRepository.find();
    const issuers = [...new Set(certificates.map(cert => cert.issuer_name).filter((issuer): issuer is string => issuer !== undefined))];
    return issuers;
  }

  // PUT endpoint:
  @put("/certificates/{id}")
  @response(204, {
    description: "Certificate PUT success",
  })
  async uploadFile(
    @param.path.number('id') id: number,
    @requestBody() certificateFile: { localPath: string }
  ): Promise<Certificate> {
    try {
      const { localPath } = certificateFile;

      if (!process.env.AZURE_STORAGE_CONTAINER_NAME || !process.env.AZURE_STORAGE_SAS_TOKEN) {
        throw new Error("Faltam variáveis de ambiente do Azure");
      }

      const blobServiceClient = new BlobServiceClient(
        `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/?${process.env.AZURE_STORAGE_SAS_TOKEN}`
      );
      const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
      const blobName = path.basename(localPath);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const fileStream = fs.createReadStream(localPath);
      await blockBlobClient.uploadStream(fileStream);

      await this.certificateRepository.updateById(id, {
        file_path: new URL(blockBlobClient.url).pathname,
        last_modified: new Date().toISOString(),
      });

      const updatedCertificate = await this.certificateRepository.findById(id);

      return updatedCertificate;
    } catch (error) {
      throw new HttpErrors.BadRequest(`Erro ao carregar o ficheiro: ${error.message}`);
    }
  }

  // PATCH endpoint:
  @patch("/certificates/{id}")
  @authenticate("jwt")
  @response(204, {
    description: "Certificate PATCH success",
  })
  async updateById(
    @param.path.number("id") id: number,
    @requestBody() certificate: Partial<Certificate>,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    const existingCertificate = await this.certificateRepository.findById(id);
    if (!existingCertificate) {
      throw new HttpErrors.NotFound('Certificado não encontrado!');
    }

    const { expiration_date, last_modified_user_id, ...certificateData } = certificate;

    if (certificate.srv_cert) {
      try {
        const parsedCert = forge.pki.certificateFromPem(certificate.srv_cert);
        certificateData.issue_date = parsedCert.validity.notBefore.toISOString();
        const issuerCN = parsedCert.issuer.getField("CN");
        certificateData.issuer_name = issuerCN ? issuerCN.value : "";
      } catch (error) {
        throw new HttpErrors.BadRequest("Falha ao analisar o certificado público para extrair os dados.");
      }
    } else if (certificate.issue_date) {
      const issueDate = new Date(certificate.issue_date);
      if (isNaN(issueDate.getTime())) {
        throw new HttpErrors.BadRequest('A data de emissão deve ser válida!');
      }
      certificateData.issue_date = issueDate.toISOString();
    }

    await this.certificateRepository.updateById(id, {
      ...certificateData,
      last_modified: new Date().toISOString(),
      last_modified_user_id: currentUser?.id,
    });

    const updatedCertificate = await this.certificateRepository.findById(id);

    const userAgentHeader = this.request.headers['user-agent'] || 'unknown';
    const agent = useragent.parse(userAgentHeader);
    const deviceInfo = {
      device: agent.device.toString(),
      os: agent.os.toString(),
    };

    await this.logService.logCertificateChange(
      currentUser.person_name || 'unknown',
      updatedCertificate.id || 'unknown',
      this.request.ip || 'unknown',
      currentUser.id || 'unknown',
      deviceInfo
    );
  }

  // DELETE endpoint:
  @del("/certificates/{id}")
  @authenticate("jwt")
  @response(204, {
    description: "Certificate DELETE success",
  })
  async deleteById(
    @param.path.number("id") id: number,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    const existingCertificate = await this.certificateRepository.findById(id);
    if (!existingCertificate) {
      throw new HttpErrors.NotFound('Certificado não encontrado!');
    }

    await this.certificateRepository.deleteById(id);

    const userAgentHeader = this.request.headers['user-agent'] || 'unknown';
    const agent = useragent.parse(userAgentHeader);
    const deviceInfo = {
      device: agent.device.toString(),
      os: agent.os.toString(),
    };

    await this.logService.logCertificateDelete(
      currentUser.person_name || 'unknown',
      id,
      this.request.ip || 'unknown',
      currentUser.id || 'unknown',
      deviceInfo
    );
  }

  @del("/certificates")
  @authenticate("jwt")
  @response(204, {
    description: "Certificates DELETE success",
  })
  async deleteMany(
    @param.query.string("filter") filterStr: string,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    let filter;
    try {
      filter = JSON.parse(filterStr);
    } catch {
      throw new HttpErrors.BadRequest('Invalid filter format.');
    }

    const ids = filter?.where?.id?.inq;
    if (!ids?.length) {
      throw new HttpErrors.BadRequest('No IDs provided for deletion.');
    }

    const certificatesToDelete = await this.certificateRepository.find({ where: { id: { inq: ids } } });
    await this.certificateRepository.deleteAll({ id: { inq: ids } });

    const userAgentHeader = this.request.headers['user-agent'] || 'unknown';
    const agent = useragent.parse(userAgentHeader);
    const deviceInfo = {
      device: agent.device.toString(),
      os: agent.os.toString(),
    };

    for (const cert of certificatesToDelete) {
      await this.logService.logCertificateDelete(
        currentUser.person_name || 'unknown',
        cert.id || 'unknown',
        this.request.ip || 'unknown',
        currentUser.id || 'unknown',
        deviceInfo
      );
    }
  }

  validateCertificates(
    certificate: Omit<Certificate, "id" | "last_modified" | "last_modified_user_id">
  ): void {
    const validate = (condition: boolean, field: string, message: string) => { if (condition) throw new HttpErrors.BadRequest(`Erro no campo "${field}": ${message}`); };

    // Mandatory fields
    const rules: { [key: string]: { condition: boolean; message: string }[] } = {
      name: [
        { condition: !certificate.name, message: "O nome do certificado é obrigatório!" },
        { condition: certificate.name?.length > 255, message: "O nome do certificado deve ter no máximo 255 caracteres!" }
      ],
      dates: [
        { condition: !certificate.issue_date || isNaN(Date.parse(certificate.issue_date)), message: "A data de emissão é obrigatória e deve ser válida!" },
        { condition: !certificate.expiration_date || isNaN(Date.parse(certificate.expiration_date)), message: "A data de expiração é obrigatória e deve ser válida." },
        { condition: certificate.expiration_date < certificate.issue_date, message: "A data de expiração deve ser posterior à data de emissão." }
      ]
    };

    Object.entries(rules).forEach(([field, validations]) => { 
      validations.forEach(({ condition, message }) => validate(condition, field, message)); 
    });

    // Optional fields
    if (certificate.issuer_url) { validate(!/^https?:\/\/.+\..+/.test(certificate.issuer_url), "issuer_url", "O URL da entidade emissora deve ser uma URL válida."); }
  }
}
