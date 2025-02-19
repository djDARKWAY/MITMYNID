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
    accessPoint: Omit<AccessPoint, "idAccessPoint">
  ): Promise<AccessPoint> {
    return this.accessPointRepository.create(accessPoint);
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
}
