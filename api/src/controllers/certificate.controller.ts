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
} from "@loopback/rest";
import { Certificate } from "../models";
import { CertificateRepository } from "../repositories";
import * as dotenv from 'dotenv';
import * as fs from "fs";
import * as path from "path";

const { BlobServiceClient } = require('@azure/storage-blob');
dotenv.config({ path: "src/controllers/specs/azure/.env" });

export class CertificateController {
  constructor(
    @repository(CertificateRepository)
    public certificateRepository: CertificateRepository
  ) {}

  // POST endpoint:
  @post("/certificates")
  @response(200, {
    description: "Certificate model instance",
    content: { "application/json": { schema: getModelSchemaRef(Certificate) } },
  })
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Certificate, {
            title: "NewCertificate",
            exclude: ["id_certificate"],
            optional: ["last_modified", "last_modified_user_id"],
          }),
        },
      },
    })
    certificate: Omit<Certificate, "id_certificate" | "last_modified" | "last_modified_user_id">
  ): Promise<Certificate> {
    this.validateCertificates(certificate);

    return this.certificateRepository.create({
      ...certificate,
      last_modified: new Date().toISOString(),
    });
  }

  // GET endpoint:
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
    @param.filter(Certificate) filter?: Filter<Certificate>
  ): Promise<Certificate[]> {
    return this.certificateRepository.find({
      fields: {
        id_certificate: true,
        name: true,
        file_path: true,
        issue_date: true,
        issuer_name: true,
        expiration_date: true,
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

    const isValid = !certificate.is_expired;
    const message = isValid ? 'O certificado é válido.' : 'O certificado está expirado.';

    return { id, is_valid: isValid, message, expires_at: new Date(certificate.expiration_date) };
  }

  // PUT endpoint:
  @put("/certificates/{id}")
  @response(204, {
    description: "Certificate PUT success",
  })
  async replaceById(
    @param.path.number("id") id: number,
    @requestBody() certificate: Certificate
  ): Promise<void> {
    const existingCertificate = await this.certificateRepository.findById(id);
    if (!existingCertificate) {
      throw new HttpErrors.NotFound('Certificado não encontrado!');
    }
    await this.certificateRepository.replaceById(id, certificate);
  }

  // PATCH endpoint:
  @patch("/certificates/{id}")
  @response(200, {
    description: "Atualiza o certificado com o arquivo carregado",
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
      throw new HttpErrors.BadRequest(`Erro ao carregar o arquivo: ${error.message}`);
    }
  }

  // DELETE endpoint:
  @del("/certificates/{id}")
  @response(204, {
    description: "Certificate DELETE success",
  })
  async deleteById(@param.path.number("id") id: number): Promise<void> {
    const existingCertificate = await this.certificateRepository.findById(id);
    if (!existingCertificate) {
      throw new HttpErrors.NotFound('Certificado não encontrado!');
    }
    await this.certificateRepository.deleteById(id);
  }

  validateCertificates(
    certificate: Omit<Certificate, "id_certificate" | "last_modified" | "last_modified_user_id">
  ): void {
    const validate = (condition: boolean, field: string, message: string) => { if (condition) throw new HttpErrors.BadRequest(`Erro no campo "${field}": ${message}`); };

    // Mandatory fields
    const rules: { [key: string]: { condition: boolean; message: string }[] } = {
      name: [
        { condition: !certificate.name, message: "O nome do certificado é obrigatório!" },
        { condition: certificate.name?.length > 255, message: "O nome do certificado deve ter no máximo 255 caracteres!" }
      ],
      file_path: [
        { condition: !certificate.file_path, message: "O caminho do ficheiro é obrigatório!" },
        { condition: !certificate.file_path.startsWith("/"), message: "O caminho do ficheiro deve começar por '/'!" },
        { condition: !/\.(pem|crt|key)$/.test(certificate.file_path), message: "O ficheiro deve ser um ficheiro de certificado válido!" }
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
