import {
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from "@loopback/repository";
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from "@loopback/rest";
import { Certificate } from "../models";
import { CertificateRepository } from "../repositories";

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
            exclude: ["idCertificate"],
          }),
        },
      },
    })
    certificate: Omit<Certificate, "idCertificate" | "lastModified" | "lastModifiedUserId">
  ): Promise<Certificate> {
    this.validateCertificate(certificate);

    return this.certificateRepository.create({
      ...certificate,
      lastModified: new Date().toISOString(),
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
        idCertificate: true,
        name: true,
        filePath: true,
        issueDate: true,
        issuerName: true,
        expirationDate: true,
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

  // PATCH endpoint:
  @put("/certificates/{id}")
  @response(204, {
    description: "Certificate PUT success",
  })
  async replaceById(
    @param.path.number("id") id: number,
    @requestBody() certificate: Certificate
  ): Promise<void> {
    await this.certificateRepository.replaceById(id, certificate);
  }

  // DELETE endpoint:
  @del("/certificates/{id}")
  @response(204, {
    description: "Certificate DELETE success",
  })
  async deleteById(@param.path.number("id") id: number): Promise<void> {
    await this.certificateRepository.deleteById(id);
  }

  validateCertificate(
    certificate: Omit<Certificate, "idCertificate" | "lastModified" | "lastModifiedUserId">
  ): void {
    const validate = (condition: boolean, message: string) => { if (condition) throw new HttpErrors.BadRequest(message); };
  
    // Mandatory fields
    const rules: { [key: string]: { condition: boolean; message: string }[] } = {
      name: [
        { condition: !certificate.name, message: "O nome do certificado é obrigatório!" },
        { condition: certificate.name?.length > 255, message: "O nome do certificado deve ter no máximo 255 caracteres!" }
      ],
      filePath: [
        { condition: !certificate.filePath, message: "O caminho do ficheiro é obrigatório!" },
        { condition: !certificate.filePath.startsWith("/"), message: "O caminho do ficheiro deve começar por '/'!" },
        { condition: !/\.(pem|crt|cer|key|der|pfx|p12|p7b|p7c)$/.test(certificate.filePath), message: "O ficheiro deve ser um ficheiro de certificado válido!" }
      ],
      dates: [
        { condition: !certificate.issueDate || isNaN(Date.parse(certificate.issueDate)), message: "A data de emissão é obrigatória e deve ser válida!" },
        { condition: !certificate.expirationDate || isNaN(Date.parse(certificate.expirationDate)), message: "A data de expiração é obrigatória e deve ser válida." },
        { condition: certificate.expirationDate <= certificate.issueDate, message: "A data de expiração deve ser posterior à data de emissão." }
      ]
    };
    Object.values(rules).flat().forEach(({ condition, message }) => validate(condition, message));
  
    // Optional fields
    if (certificate.issuerUrl) validate(!/^https?:\/\/.+\..+/.test(certificate.issuerUrl), "O URL da entidade emissora deve ser uma URL válida.");
  }  
}
