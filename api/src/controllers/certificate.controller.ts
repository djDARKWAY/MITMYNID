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

  validateCertificate(certificate: Omit<Certificate, "idCertificate" | "lastModified" | "lastModifiedUserId">): void {
    const check = (condition: boolean, message: string) => {
      if (condition) {
        throw new HttpErrors.BadRequest(message);
      }
    };

    // Validate certificate name
    check(!certificate.name || typeof certificate.name !== "string", "O nome do certificado é obrigatório.");
    check(certificate.name.length > 255, "O nome do certificado não pode ter mais de 255 caracteres.");

    // Validate certificate filePath
    check(!certificate.filePath || typeof certificate.filePath !== "string", "O caminho do ficheiro é obrigatório.");
    check(!certificate.filePath.startsWith("/"), "O caminho do ficheiro deve começar por '/'.");
    check(!/\.(pem|crt|cer|key|der|pfx|p12|p7b|p7c)$/.test(certificate.filePath), "O ficheiro deve ser um ficheiro de certificado válido.");

    // Validate certificate issueDate
    check(!certificate.issueDate || isNaN(Date.parse(certificate.issueDate)), "A data de emissão é obrigatória e deve ser uma data válida.");

    // Validate certificate expirationDate
    check(!certificate.expirationDate || isNaN(Date.parse(certificate.expirationDate)), "A data de expiração é obrigatória e deve ser uma data válida.");
  }
}
