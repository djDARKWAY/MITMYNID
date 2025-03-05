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
import { AccessPoint } from "../models";
import { AccessPointRepository } from "../repositories";
import { CompanyRepository } from "../repositories";
import {
  authenticate,
  TokenService,
  UserService,
} from "@loopback/authentication";
import { basicAuthorization } from "../middlewares/auth.middleware";
import { authorize } from "@loopback/authorization";

export class AccessPointController {
  constructor(
    @repository(AccessPointRepository)
    public accessPointRepository: AccessPointRepository,
    @repository(CompanyRepository) public companyRepository: CompanyRepository
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
            exclude: ["id"],
          }),
        },
      },
    })
    accessPoint: Omit<
      AccessPoint,
      "id" | "created_date" | "last_modified" | "last_modified_user"
    >
  ): Promise<AccessPoint> {
    this.validateAccessPoints(accessPoint);

    return this.accessPointRepository.create({
      ...accessPoint,
      created_date: new Date().toISOString(),
      last_modified: new Date().toISOString(),
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
    @param.filter(AccessPoint) filter?: Filter<AccessPoint>
  ): Promise<AccessPoint[]> {
    if (filter?.where && (filter.where as any).company_name) {
      const companyName = (filter.where as any).company_name;

      const companies = await this.companyRepository.find({
        where: {
          name: { ilike: `%${companyName}%` },
        },
      });

      const companyIds = companies.map((company) => company.id);

      filter.where = {
        ...filter.where,
        company_id: { inq: companyIds },
      };
    }

    if (filter?.where && (filter.where as any).ip_address) {
      const ipAddress = (filter.where as any).ip_address;
      (filter.where as any).ip_address = { ilike: `${ipAddress}%` };
    }

    return this.accessPointRepository.find({
      ...filter,
      fields: {
        id: true,
        location_description: true,
        ip_address: true,
        ap_software: true,
        software_version: true,
        is_active: true,
        company_id: true,
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

  // PUT endpoint:
  @put("/access-points/{id}")
  @response(204, {
    description: "AccessPoint PUT success",
  })
  async replaceById(
    @param.path.number("id") id: number,
    @requestBody() accessPoint: AccessPoint
  ): Promise<void> {
    const existingAccessPoint = await this.accessPointRepository.findById(id);
    if (!existingAccessPoint) {
      throw new HttpErrors.NotFound("AP não encontrado!");
    }
    await this.accessPointRepository.replaceById(id, accessPoint);
  }

  // DELETE endpoint:
  @del("/access-points/{id}")
  @response(204, {
    description: "AccessPoint DELETE success",
  })
  async deleteById(@param.path.number("id") id: number): Promise<void> {
    const existingAccessPoint = await this.accessPointRepository.findById(id);
    if (!existingAccessPoint) {
      throw new HttpErrors.NotFound("AP não encontrado!");
    }
    await this.accessPointRepository.deleteById(id);
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
          {
            condition: !accessPoint.location_description,
            message: "A descrição da localização é obrigatória!",
          },
          {
            condition: accessPoint.location_description.length > 255,
            message: "A descrição da localização é muito longa!",
          },
        ],
        ip_address: [
          {
            condition: !accessPoint.ip_address,
            message: "O endereço IP é obrigatório!",
          },
          {
            condition:
              !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                accessPoint.ip_address
              ) &&
              !/^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})$/.test(
                accessPoint.ip_address
              ),
            message: "O endereço IP deve ser um IPv4 ou IPv6 válido!",
          },
        ],
        is_active: [
          {
            condition: accessPoint.is_active === undefined,
            message: "O estado do AP é obrigatório!",
          },
          {
            condition: typeof accessPoint.is_active !== "boolean",
            message: "O estado do AP deve ser um valor booleano!",
          },
        ],
      };

    Object.entries(rules).forEach(([field, validations]) => {
      validations.forEach(({ condition, message }) =>
        validate(condition, field, message)
      );
    });

    // Optional fields
    if (accessPoint.configurations) {
      try {
        JSON.stringify(accessPoint.configurations);
      } catch {
        throw new HttpErrors.BadRequest(
          "A configuração deve ser um objeto JSON válido."
        );
      }
    }
    if (accessPoint.permissions) {
      try {
        JSON.stringify(accessPoint.permissions);
      } catch {
        throw new HttpErrors.BadRequest(
          "As permissões devem ser um objeto JSON válido."
        );
      }
    }
  }
}
