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
  del,
  Request,
  requestBody,
  response,
  HttpErrors,
  Response,
  RestBindings
} from "@loopback/rest";
import { inject } from "@loopback/core";
import { Warehouse } from "../models";
import { WarehouseRepository } from "../repositories";
import { LogService } from "../services/log.service";
import { SecurityBindings, UserProfile } from '@loopback/security';
import * as useragent from 'useragent';
import { authenticate, TokenService, UserService } from '@loopback/authentication';
import { basicAuthorization } from '../middlewares/auth.middleware';
import { authorize } from '@loopback/authorization';

export class WarehouseController {
  constructor(
    @repository(WarehouseRepository)
    public warehouseRepository: WarehouseRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @inject('services.LogService') private logService: LogService,
  ) {}

  // POST endpoint:
  @post("/warehouses")
  @authenticate("jwt")
  @response(200, {
    description: "Warehouse model instance",
    content: { "application/json": { schema: getModelSchemaRef(Warehouse) } },
  })
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Warehouse, {
            title: "NewWarehouse",
            exclude: ["id", "created_date", "last_modified", "last_modified_user_id"],
          }),
        },
      },
    })
    warehouse: Omit<Warehouse, "id" | "created_date" | "last_modified" | "last_modified_user_id">,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<Warehouse> {
    this.validateWarehouse(warehouse);

    return this.warehouseRepository.create({
      ...warehouse,
      created_date: new Date().toISOString(),
      last_modified: new Date().toISOString(),
      last_modified_user_id: currentUser.id,
    });
  }

  // GET endpoints:
  @get("/warehouses")
  @response(200, {
    description: "Array of Warehouse model instances",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: getModelSchemaRef(Warehouse, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.filter(Warehouse) filter?: Filter<Warehouse>
  ): Promise<Warehouse[]> {
    if (filter?.where && (filter.where as any).name) {
      const name = (filter.where as any).name;
      (filter.where as any).name = { ilike: `%${name}%` };
    }
    if (filter?.where && (filter.where as any).district) {
      const district = (filter.where as any).district;
      (filter.where as any).district = { ilike: `%${district}%` };
    }
    if (filter?.where && (filter.where as any).city) {
      const city = (filter.where as any).city;
      (filter.where as any).city = { ilike: `%${city}%` };
    }
    if (filter?.where && (filter.where as any).zip_code) {
      const zip_code = (filter.where as any).zip_code;
      (filter.where as any).zip_code = { ilike: `%${zip_code}%` };
    }
    if (filter?.where && (filter.where as any).country) {
      const country = (filter.where as any).country;
      (filter.where as any).country_id = { like: `${country}` };
      delete (filter.where as any).country;
    }
    
    const countResult = await this.warehouseRepository.count((filter && filter.where) ? filter.where : {});
    response.setHeader("x-total-count", countResult.count);
    response.setHeader("Access-Control-Expose-Headers", "x-total-count");

    return this.warehouseRepository.find({
      ...filter,
      include: [{ relation: "country" }],
      fields: {
        id: true,
        name: true,
        city: true,
        district: true,
        country_id: true,
        zip_code: true,
        lat: true,
        lon: true,
      },
    });
  }

  @get("/warehouses/{id}")
  @response(200, {
    description: "Warehouse model instance",
    content: {
      "application/json": {
        schema: getModelSchemaRef(Warehouse, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number("id") id: number,
    @param.filter(Warehouse, { exclude: "where" })
    filter?: FilterExcludingWhere<Warehouse>
  ): Promise<Warehouse> {
    return this.warehouseRepository.findById(id, filter);
  }

  @get("/warehouses/count")
  @response(200, {
    description: "Warehouse model count",
    content: { "application/json": { schema: { type: "object", properties: { count: { type: "number" } } } } },
  })
  async count(
    @param.where(Warehouse) where?: Where<Warehouse>
  ): Promise<{ count: number }> {
    return this.warehouseRepository.count(where);
  }  

  // PATCH endpoint:
  @patch("/warehouses/{id}")
  @authenticate("jwt")
  @response(204, {
    description: "Warehouse PATCH success",
  })
  async updateById(
    @param.path.number("id") id: number,
    @requestBody() warehouse: Partial<Warehouse>,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    const existingWarehouse = await this.warehouseRepository.findById(id);
    if (!existingWarehouse) {
      throw new HttpErrors.NotFound('Entidade não encontrado!');
    }
    const { last_modified_user_id, ...warehouseData } = warehouse;
    
    try {
      await this.warehouseRepository.updateById(id, {
        ...warehouseData,
        last_modified: new Date().toISOString(),
        last_modified_user_id: currentUser?.id,
      });
      
      const updatedWarehouse = await this.warehouseRepository.findById(id);

      const userAgentHeader = this.request.headers['user-agent'] || 'unknown';
      const agent = useragent.parse(userAgentHeader);
      const deviceInfo = {
        device: agent.device.toString(),
        os: agent.os.toString(),
      };

      await this.logService.logWarehouseChange(
        currentUser.person_name || 'unknown',
        updatedWarehouse.id || 'unknown',
        this.request.ip || 'unknown',
        currentUser.id || 'unknown',
        deviceInfo
      );
    } catch (error) {
      console.error('Error updating warehouse:', error);
      throw error;
    }
  }

  // DELETE endpoint:
  @del("/warehouses/{id}")
  @authenticate("jwt")
  @response(204, {
    description: "Warehouse DELETE success",
  })
  async deleteById(
    @param.path.number("id") id: number,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    const existingWarehouse = await this.warehouseRepository.findById(id);
    if (!existingWarehouse) {
      throw new HttpErrors.NotFound('Entidade não encontrado!');
    }

    await this.warehouseRepository.deleteById(id);

    const userAgentHeader = this.request.headers['user-agent'] || 'unknown';
    const agent = useragent.parse(userAgentHeader);
    const deviceInfo = {
      device: agent.device.toString(),
      os: agent.os.toString(),
    };

    await this.logService.logWarehouseDelete(
      currentUser.person_name || 'unknown',
      id,
      this.request.ip || 'unknown',
      currentUser.id || 'unknown',
      deviceInfo
    );
  }

  @del("/warehouses")
  @authenticate("jwt")
  @response(204, {
    description: "Warehouses DELETE success",
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

    const warehousesToDelete = await this.warehouseRepository.find({ where: { id: { inq: ids } } });
    await this.warehouseRepository.deleteAll({ id: { inq: ids } });

    const userAgentHeader = this.request.headers['user-agent'] || 'unknown';
    const agent = useragent.parse(userAgentHeader);
    const deviceInfo = {
      device: agent.device.toString(),
      os: agent.os.toString(),
    };

    for (const warehouse of warehousesToDelete) {
      await this.logService.logWarehouseDelete(
        currentUser.person_name || 'unknown',
        warehouse.id || 'unknown',
        this.request.ip || 'unknown',
        currentUser.id || 'unknown',
        deviceInfo
      );
    }
  }

  validateWarehouse(
    warehouse: Omit<Warehouse, "id" | "created_date" | "last_modified" | "last_modified_user">
  ): void {
    const validate = (condition: boolean, field: string, message: string) => { if (condition) throw new HttpErrors.BadRequest(`Erro no campo "${field}": ${message}`); };

    // Mandatory fields
    const rules: { [key: string]: { condition: boolean; message: string }[] } = {
      name: [
        { condition: !warehouse.name, message: "O nome do armazém é obrigatório!" },
        { condition: warehouse.name?.length > 255, message: "O nome do armazém não pode ter mais de 255 caracteres!" }
      ],
      address: [
        { condition: !warehouse.address, message: "O endereço é obrigatório!" },
        { condition: warehouse.address.length > 255, message: "O endereço não pode ter mais de 255 caracteres!" }
      ],
      city: [
        { condition: !warehouse.city, message: "A cidade é obrigatória!" },
        { condition: warehouse.city.length > 100, message: "A cidade não pode ter mais de 100 caracteres!" }
      ],
      district: [
        { condition: !warehouse.district, message: "O distrito é obrigatório!" },
        { condition: warehouse.district?.length > 100, message: "O distrito não pode ter mais de 100 caracteres!" }
      ],
      zip_code: [
        { condition: !warehouse.zip_code, message: "O código postal é obrigatório!" },
        { condition: warehouse.zip_code.length > 20, message: "O código postal não pode ter mais de 20 caracteres!" }
      ]
    };
    Object.entries(rules).forEach(([field, validations]) => { 
      validations.forEach(({ condition, message }) => validate(condition, field, message)); 
    });

    // Optional fields
    if (warehouse.email) validate(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(warehouse.email), "email", "O email não é válido!");
    if (warehouse.website) validate(!/^(https?:\/\/)?[^\s$.?#].[^\s]*$/.test(warehouse.website), "website", "O website deve ser uma URL válida!");
    if (warehouse.lat) validate(warehouse.lat < -90 || warehouse.lat > 90, "lat", "A latitude deve estar entre -90 e 90!");
    if (warehouse.lon) validate(warehouse.lon < -180 || warehouse.lon > 180, "lon", "A longitude deve estar entre -180 e 180!");  
  }
}
