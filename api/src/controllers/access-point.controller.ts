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
  HttpErrors
} from "@loopback/rest";
import { AccessPoint } from "../models";
import { AccessPointRepository } from "../repositories";

export class AccessPointController {
  constructor(
    @repository(AccessPointRepository)
    public accessPointRepository: AccessPointRepository
  ) {}

  // POST endpoint:
  @post("/access-points")
  @response(200, {
    description: "AccessPoint model instance",
    content: { "application/json": { schema: getModelSchemaRef(AccessPoint) } },
  })
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(AccessPoint, {
            title: "NewAccessPoint",
            exclude: ["idAccessPoint"],
          }),
        },
      },
    })
    accessPoint: Omit<AccessPoint, "idAccessPoint" | "createdDate" | "lastModified" | "lastModifiedUser">
  ): Promise<AccessPoint> {
    this.validateAccessPoint(accessPoint);

    return this.accessPointRepository.create({
      ...accessPoint,
      lastModified: new Date().toISOString(),
    });
  }

  // GET endpoint:
  @get("/access-points")
  @response(200, {
    description: "Array of AccessPoint model instances",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: getModelSchemaRef(AccessPoint, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(AccessPoint) filter?: Filter<AccessPoint>
  ): Promise<AccessPoint[]> {
    return this.accessPointRepository.find({
      fields: {
        idAccessPoint: true,
        locationDescription: true,
        ipAddress: true,
        apSoftware: true,
        isActive: true,
        certificateId: true,
        companyId: true,
        lastModifiedUserId: true,
      },
    });
  }

  @get("/access-points/{id}")
  @response(200, {
    description: "AccessPoint model instance",
    content: {
      "application/json": {
        schema: getModelSchemaRef(AccessPoint, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number("id") id: number,
    @param.filter(AccessPoint, { exclude: "where" })
    filter?: FilterExcludingWhere<AccessPoint>
  ): Promise<AccessPoint> {
    return this.accessPointRepository.findById(id, filter);
  }

  // PUT endpoint:
  @put("/access-points/{id}")
  @response(204, {
    description: "AccessPoint PUT success",
  })
  async replaceById(
    @param.path.number("id") id: number,
    @requestBody() accessPoint: AccessPoint
  ): Promise<void> {
    await this.accessPointRepository.replaceById(id, accessPoint);
  }

  // DELETE endpoint:
  @del("/access-points/{id}")
  @response(204, {
    description: "AccessPoint DELETE success",
  })
  async deleteById(@param.path.number("id") id: number): Promise<void> {
    await this.accessPointRepository.deleteById(id);
  }

  validateAccessPoint(accessPoint: Omit<AccessPoint, "idAccessPoint" | "createdDate" | "lastModified" | "lastModifiedUser">): void {
    const check = (condition: boolean, message: string) => {
      if (condition) {
        throw new HttpErrors.BadRequest(message);
      }
    };

    // Validate locationDescription
    check(!accessPoint.locationDescription || typeof accessPoint.locationDescription !== "string", "A descrição da localização é obrigatória.");
    check(accessPoint.locationDescription.length > 255, "A descrição da localização não pode ter mais de 255 caracteres.");

    // Validate ipAddress
    check(!accessPoint.ipAddress || typeof accessPoint.ipAddress !== "string", "O endereço IP é obrigatório.");
    check(!/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(accessPoint.ipAddress) && !/^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})$/.test(accessPoint.ipAddress), "O endereço IP não é válido.");

    // Validate isActive
    check(accessPoint.isActive !== undefined && typeof accessPoint.isActive !== "boolean", "O estado do ponto de acesso (ativo/inativo) é obrigatório.");
  }
}
