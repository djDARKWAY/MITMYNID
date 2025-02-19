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
} from "@loopback/rest";
import { Certificate } from "../models";
import { CertificateRepository } from "../repositories";

export class CertificateController {
  constructor(
    @repository(CertificateRepository)
    public certificateRepository: CertificateRepository
  ) {}

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
    certificate: Omit<Certificate, "idCertificate">
  ): Promise<Certificate> {
    return this.certificateRepository.create(certificate);
  }

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

  @patch("/certificates/{id}")
  @response(204, {
    description: "Certificate PATCH success",
  })
  async updateById(
    @param.path.number("id") id: number,
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Certificate, { partial: true }),
        },
      },
    })
    certificate: Certificate
  ): Promise<void> {
    await this.certificateRepository.updateById(id, certificate);
  }

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

  @del("/certificates/{id}")
  @response(204, {
    description: "Certificate DELETE success",
  })
  async deleteById(@param.path.number("id") id: number): Promise<void> {
    await this.certificateRepository.deleteById(id);
  }
}
