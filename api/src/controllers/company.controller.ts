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
  RestBindings
} from "@loopback/rest";
import { inject } from "@loopback/core";
import { Company } from "../models";
import { CompanyRepository } from "../repositories";
import { LogService } from "../services/log.service";
import { SecurityBindings, UserProfile } from '@loopback/security';
import * as useragent from 'useragent';
import { authenticate, TokenService, UserService } from '@loopback/authentication';
import { basicAuthorization } from '../middlewares/auth.middleware';
import { authorize } from '@loopback/authorization';

export class CompanyController {
  constructor(
    @repository(CompanyRepository)
    public companyRepository: CompanyRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @inject('services.LogService') private logService: LogService,
  ) {}

  // POST endpoint:
  @post("/companies")
  @response(200, {
    description: "Company model instance",
    content: { "application/json": { schema: getModelSchemaRef(Company) } },
  })
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Company, {
            title: "NewCompany",
            exclude: ["id"],
          }),
        },
      },
    })
    company: Omit<Company, "id" | "last_modified" | "last_modified_user_id">
  ): Promise<Company> {
    this.validateCompany(company);

    return this.companyRepository.create({
      ...company,
      last_modified: new Date().toISOString(),
    });
  }

  // GET endpoints:
  @get("/companies")
  @response(200, {
    description: "Array of Company model instances",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: getModelSchemaRef(Company, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.filter(Company) filter?: Filter<Company>
  ): Promise<Company[]> {
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
    
    const countResult = await this.companyRepository.count((filter && filter.where) ? filter.where : {});
    response.setHeader("x-total-count", countResult.count);
    response.setHeader("Access-Control-Expose-Headers", "x-total-count");

    return this.companyRepository.find({
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

  @get("/companies/{id}")
  @response(200, {
    description: "Company model instance",
    content: {
      "application/json": {
        schema: getModelSchemaRef(Company, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number("id") id: number,
    @param.filter(Company, { exclude: "where" })
    filter?: FilterExcludingWhere<Company>
  ): Promise<Company> {
    return this.companyRepository.findById(id, filter);
  }

  @get("/companies/count")
  @response(200, {
    description: "Company model count",
    content: { "application/json": { schema: { type: "object", properties: { count: { type: "number" } } } } },
  })
  async count(
    @param.where(Company) where?: Where<Company>
  ): Promise<{ count: number }> {
    return this.companyRepository.count(where);
  }  

  // PATCH endpoint:
  @patch("/companies/{id}")
  @authenticate("jwt")
  @response(204, {
    description: "Company PATCH success",
  })
  async updateById(
    @param.path.number("id") id: number,
    @requestBody() company: Partial<Company>,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    const existingCompany = await this.companyRepository.findById(id);
    if (!existingCompany) {
      throw new HttpErrors.NotFound('Armazém não encontrado!');
    }
    const { last_modified_user_id, ...companyData } = company;

    await this.companyRepository.updateById(id, {
      ...companyData,
      last_modified: new Date().toISOString(),
    });

    const updatedCompany = await this.companyRepository.findById(id);

    const userAgentHeader = this.request.headers['user-agent'] || 'unknown';
    const agent = useragent.parse(userAgentHeader);
    const deviceInfo = {
      device: agent.device.toString(),
      os: agent.os.toString(),
    };

    await this.logService.logCompanyChange(
      currentUser.person_name || 'unknown',
      updatedCompany.id || 'unknown',
      this.request.ip || 'unknown',
      currentUser.id || 'unknown',
      deviceInfo
    );
  }

  // DELETE endpoint:
  @del("/companies/{id}")
  @authenticate("jwt")
  @response(204, {
    description: "Company DELETE success",
  })
  async deleteById(
    @param.path.number("id") id: number,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<void> {
    const existingCompany = await this.companyRepository.findById(id);
    if (!existingCompany) {
      throw new HttpErrors.NotFound('Armazém não encontrado!');
    }

    await this.companyRepository.deleteById(id);

    const userAgentHeader = this.request.headers['user-agent'] || 'unknown';
    const agent = useragent.parse(userAgentHeader);
    const deviceInfo = {
      device: agent.device.toString(),
      os: agent.os.toString(),
    };

    await this.logService.logCompanyDelete(
      currentUser.person_name || 'unknown',
      id,
      this.request.ip || 'unknown',
      currentUser.id || 'unknown',
      deviceInfo
    );
  }

  @del("/companies")
  @authenticate("jwt")
  @response(204, {
    description: "Companies DELETE success",
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

    const companiesToDelete = await this.companyRepository.find({ where: { id: { inq: ids } } });
    await this.companyRepository.deleteAll({ id: { inq: ids } });

    const userAgentHeader = this.request.headers['user-agent'] || 'unknown';
    const agent = useragent.parse(userAgentHeader);
    const deviceInfo = {
      device: agent.device.toString(),
      os: agent.os.toString(),
    };

    for (const company of companiesToDelete) {
      await this.logService.logCompanyDelete(
        currentUser.person_name || 'unknown',
        company.id || 'unknown',
        this.request.ip || 'unknown',
        currentUser.id || 'unknown',
        deviceInfo
      );
    }
  }

  validateCompany(
    company: Omit<Company, "id" | "created_date" | "last_modified" | "last_modified_user">
  ): void {
    const validate = (condition: boolean, field: string, message: string) => { if (condition) throw new HttpErrors.BadRequest(`Erro no campo "${field}": ${message}`); };

    // Mandatory fields
    const rules: { [key: string]: { condition: boolean; message: string }[] } = {
      name: [
        { condition: !company.name, message: "O nome do armazém é obrigatório!" },
        { condition: company.name?.length > 255, message: "O nome do armazém não pode ter mais de 255 caracteres!" }
      ],
      address: [
        { condition: !company.address, message: "O endereço é obrigatório!" },
        { condition: company.address.length > 255, message: "O endereço não pode ter mais de 255 caracteres!" }
      ],
      city: [
        { condition: !company.city, message: "A cidade é obrigatória!" },
        { condition: company.city.length > 100, message: "A cidade não pode ter mais de 100 caracteres!" }
      ],
      district: [
        { condition: !company.district, message: "O distrito é obrigatório!" },
        { condition: company.district?.length > 100, message: "O distrito não pode ter mais de 100 caracteres!" }
      ],
      zip_code: [
        { condition: !company.zip_code, message: "O código postal é obrigatório!" },
        { condition: company.zip_code.length > 20, message: "O código postal não pode ter mais de 20 caracteres!" }
      ]
    };
    Object.entries(rules).forEach(([field, validations]) => { 
      validations.forEach(({ condition, message }) => validate(condition, field, message)); 
    });

    // Optional fields
    if (company.email) validate(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email), "email", "O email não é válido!");
    if (company.contact) validate(!Number.isInteger(company.contact), "contact", "O contacto deve ser um número inteiro!");
    if (company.phone) validate(!Number.isInteger(company.phone), "phone", "O telefone do responsável deve ser um número inteiro!");
    if (company.website) validate(!/^(https?:\/\/)?[^\s$.?#].[^\s]*$/.test(company.website), "website", "O website deve ser uma URL válida!");
    if (company.lat) validate(company.lat < -90 || company.lat > 90, "lat", "A latitude deve estar entre -90 e 90!");
    if (company.lon) validate(company.lon < -180 || company.lon > 180, "lon", "A longitude deve estar entre -180 e 180!");  
  }
}
