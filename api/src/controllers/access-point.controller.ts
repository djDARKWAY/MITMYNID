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
  Request,
  requestBody,
  response,
  HttpErrors,
  Response,
  RestBindings,
} from "@loopback/rest";
import { AccessPoint } from "../models";
import { AccessPointRepository } from "../repositories";
import { WarehouseRepository } from "../repositories";
import { XMLValidator } from "fast-xml-parser";
import { inject } from "@loopback/core";
import { LogService } from "../services/log.service";
import { SecurityBindings, UserProfile } from '@loopback/security';
import * as useragent from 'useragent';
import { authenticate, TokenService, UserService } from "@loopback/authentication";
import { basicAuthorization } from "../middlewares/auth.middleware";
import { authorize } from "@loopback/authorization";

export class AccessPointController {
  constructor(
    @repository(AccessPointRepository)
    public accessPointRepository: AccessPointRepository,
    @repository(WarehouseRepository) public warehouseRepository: WarehouseRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @inject('services.LogService') private logService: LogService,
  ) {}

  // POST endpoint:
  @post("/access-points")
  @authenticate("jwt")
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
            exclude: ["id", "created_date", "last_modified", "last_modified_user_id"],
          }),
        },
      },
    })
    accessPoint: Omit<AccessPoint, "id" | "created_date" | "last_modified" | "last_modified_user_id">,
    @inject(SecurityBindings.USER) currentUser: UserProfile
  ): Promise<AccessPoint> {
    this.validateAccessPoints(accessPoint);

    return this.accessPointRepository.create({
      ...accessPoint,
      created_date: new Date().toISOString(),
      last_modified: new Date().toISOString(),
      last_modified_user_id: currentUser.id,
    });
  }

  // GET endpoints:
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
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.filter(AccessPoint) filter?: Filter<AccessPoint>
  ): Promise<AccessPoint[]> {
    if (filter?.where && (filter.where as any).warehouse_name) {
      const warehouseName = (filter.where as any).warehouse_name;

      const warehouses = await this.warehouseRepository.find({
        where: {
          name: { ilike: `%${warehouseName}%` },
        },
      });

      const warehouseIds = warehouses.map((warehouse) => warehouse.id);

      filter.where = {
        ...filter.where,
        warehouse_id: { inq: warehouseIds },
      };
    }

    if (filter?.where && (filter.where as any).ip_address) {
      const ipAddress = (filter.where as any).ip_address;
      (filter.where as any).ip_address = { ilike: `${ipAddress}%` };
    }

    const countResult = await this.accessPointRepository.count(filter?.where || {});
    response.setHeader("x-total-count", countResult.count);
    response.setHeader("Access-Control-Expose-Headers", "x-total-count");

    return this.accessPointRepository.find({
      ...filter,
      include: [{ relation: "warehouse" }],
      fields: {
        id: true,
        location_description: true,
        ip_address: true,
        ap_software: true,
        software_version: true,
        is_active: true,
        warehouse_id: true,
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

  @get("/access-points/validate/{id}")
  @response(200, {
    description: "Validação do estado do Access Point",
    content: { "application/json": { schema: { type: "object" } } },
  })
  async validateAccessPoint(
    @param.path.number("id") id: number
  ): Promise<{ id: number; is_active: boolean; message: string }> {
    const accessPoint = await this.accessPointRepository.findById(id);

    const isActive = accessPoint.is_active;
    const message = isActive
      ? "O Access Point está ativo."
      : "O Access Point está inativo.";

    return { id, is_active: isActive, message };
  }

  @get("/access-points/ap-software")
  @response(200, {
    description: "Lista de softwares únicos de Access Points",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
  })
  async getApSoftware(): Promise<string[]> {
    const accessPoints = await this.accessPointRepository.find();
    const apSoftware = [
      ...new Set(
        accessPoints
          .map((ap) => ap.ap_software)
          .filter((software): software is string => software !== undefined)
      ),
    ];
    return apSoftware;
  }

  // PATCH endpoint:
  @patch("/access-points/{id}")
  @authenticate("jwt")
  @response(204, {
    description: "AccessPoint PATCH success",
  })
  async updateById(
    @param.path.number("id") id: number,
    @requestBody() accessPoint: Partial<AccessPoint>,
    @inject(SecurityBindings.USER) currentUser: UserProfile
  ): Promise<void> {
    const existingAccessPoint = await this.accessPointRepository.findById(id);
    if (!existingAccessPoint) {
      throw new HttpErrors.NotFound("AP não encontrado!");
    }

    const { pmode, last_modified_user_id, ...accessPointData } = accessPoint;

    try {
      await this.accessPointRepository.updateById(id, {
        ...accessPointData,
        last_modified: new Date().toISOString(),
        last_modified_user_id: currentUser?.id,
      });
      
      const updatedAccessPoint = await this.accessPointRepository.findById(id);

      const userAgentHeader = this.request.headers["user-agent"] || "unknown";
      const agent = useragent.parse(userAgentHeader);
      const deviceInfo = {
        device: agent.device.toString(),
        os: agent.os.toString(),
      };

      await this.logService.logAccessPointChange(
        currentUser.person_name || "unknown",
        updatedAccessPoint.id || "unknown",
        this.request.ip || "unknown",
        currentUser.id || "unknown",
        deviceInfo
      );
    } catch (error) {
      console.error('Error updating access point:', error);
      throw error;
    }
  }

  // DELETE endpoint:
  @del("/access-points/{id}")
  @authenticate("jwt")
  @response(204, {
    description: "AccessPoint DELETE success",
  })
  async deleteById(
    @param.path.number("id") id: number,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    const existingAccessPoint = await this.accessPointRepository.findById(id);
    if (!existingAccessPoint) {
      throw new HttpErrors.NotFound("AP não encontrado!");
    }

    await this.accessPointRepository.deleteById(id);

    const userAgentHeader = this.request.headers["user-agent"] || "unknown";
    const agent = useragent.parse(userAgentHeader);
    const deviceInfo = {
      device: agent.device.toString(),
      os: agent.os.toString(),
    };

    await this.logService.logAccessPointDelete(
      currentUser.person_name || "unknown",
      id,
      this.request.ip || "unknown",
      currentUser.id || "unknown",
      deviceInfo
    );
  }

  @del("/access-points")
  @authenticate("jwt")
  @response(204, {
    description: "AccessPoints DELETE success",
  })
  async deleteMany(
    @param.query.string("filter") filterStr: string,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    let filter;
    try {
      filter = JSON.parse(filterStr);
    } catch {
      throw new HttpErrors.BadRequest("Invalid filter format.");
    }

    const ids = filter?.where?.id?.inq;
    if (!ids?.length) {
      throw new HttpErrors.BadRequest("No IDs provided for deletion.");
    }

    const accessPointsToDelete = await this.accessPointRepository.find({
      where: { id: { inq: ids } },
    });
    await this.accessPointRepository.deleteAll({ id: { inq: ids } });

    const userAgentHeader = this.request.headers["user-agent"] || "unknown";
    const agent = useragent.parse(userAgentHeader);
    const deviceInfo = {
      device: agent.device.toString(),
      os: agent.os.toString(),
    };

    for (const ap of accessPointsToDelete) {
      await this.logService.logAccessPointDelete(
        currentUser.person_name || "unknown",
        ap.id || "unknown",
        this.request.ip || "unknown",
        currentUser.id || "unknown",
        deviceInfo
      );
    }
  }

  validateAccessPoints(
    accessPoint: Omit<
      AccessPoint,
      "id" | "created_date" | "last_modified" | "last_modified_user"
    >
  ): void {
    const validate = (condition: boolean, field: string, message: string) => {
      if (condition)
        throw new HttpErrors.BadRequest(`Erro no campo "${field}": ${message}`);
    };

    // Mandatory fields
    const rules: { [key: string]: { condition: boolean; message: string }[] } =
      {
        location_description: [
          { condition: !accessPoint.location_description, message: "A descrição da localização é obrigatória!" },
          { condition: accessPoint.location_description.length > 255, message: "A descrição da localização é muito longa!" },
        ],
        ip_address: [
          { condition: !accessPoint.ip_address, message: "O endereço IP é obrigatório!" },
          { condition: !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(accessPoint.ip_address) && !/^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})$/.test(accessPoint.ip_address), message: "O endereço IP deve ser um IPv4 ou IPv6 válido!"},
        ],
        is_active: [
          { condition: accessPoint.is_active === undefined, message: "O estado do AP é obrigatório!" },
          { condition: typeof accessPoint.is_active !== "boolean", message: "O estado do AP deve ser um valor booleano!" },
        ],
      };

    Object.entries(rules).forEach(([field, validations]) => {
      validations.forEach(({ condition, message }) => validate(condition, field, message) );
    });

    // Optional fields
    if (accessPoint.pmode) {
      try {
        const validationResult = XMLValidator.validate(
          accessPoint.pmode as unknown as string
        );
        if (validationResult !== true) {
          throw new Error(validationResult.err.msg);
        }
      } catch (error) {
        throw new HttpErrors.BadRequest(
          `O PMode deve ser um documento XML válido. ${error instanceof Error ? error.message : ""}`
        );
      }
    }
  }
}
