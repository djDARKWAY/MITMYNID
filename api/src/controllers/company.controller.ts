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
import { Company } from "../models";
import { CompanyRepository } from "../repositories";
import { authenticate, TokenService, UserService } from '@loopback/authentication';
import { basicAuthorization } from '../middlewares/auth.middleware';
import { authorize } from '@loopback/authorization';

export class CompanyController {
  constructor(
    @repository(CompanyRepository)
    public companyRepository: CompanyRepository
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
    @param.filter(Company) filter?: Filter<Company>
  ): Promise<Company[]> {
    if (filter?.where && (filter.where as any).name) {
      const name = (filter.where as any).name;
      (filter.where as any).name = { ilike: `%${name}%` };
    }
    if (filter?.where && (filter.where as any).country) {
      const country = (filter.where as any).country;
      (filter.where as any).country_id = { like: `${country}` };
      delete (filter.where as any).country;
    }
  
    return this.companyRepository.find({
      ...filter,
      fields: {
        id: true,
        name: true,
        city: true,
        country_id: true,
        zip_code: true,
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

  // PATCH endpoint:
  @patch("/companies/{id}")
  @response(204, {
    description: "Company PATCH success",
  })
  async updateById(
    @param.path.number("id") id: number,
    @requestBody() company: Partial<Company>
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
  }

  // DELETE endpoint:
  @del("/companies/{id}")
  @response(204, {
    description: "Company DELETE success",
  })
  async deleteById(@param.path.number("id") id: number): Promise<void> {
    const existingCompany = await this.companyRepository.findById(id);
    if (!existingCompany) {
      throw new HttpErrors.NotFound('Armazém não encontrado!');
    }
    await this.companyRepository.deleteById(id);
  }

  @del("/companies")
  @response(204, {
    description: "Companies DELETE success",
  })
  async deleteMany(
    @param.query.string("filter") filterStr: string
  ): Promise<void> {
    let filter;
    try {
      filter = JSON.parse(filterStr);
    } catch (error) {
      throw new HttpErrors.BadRequest('Invalid filter format.');
    }

    const ids = filter?.where?.id?.inq;
    if (!ids || ids.length === 0) {
      throw new HttpErrors.BadRequest('No IDs provided for deletion.');
    }

    await this.companyRepository.deleteAll({
      id: { inq: ids },
    });
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
      zip_code: [
        { condition: !company.zip_code, message: "O código postal é obrigatório!" },
        { condition: company.zip_code.length > 20, message: "O código postal não pode ter mais de 20 caracteres!" }
      ]
    };
    Object.entries(rules).forEach(([field, validations]) => { 
      validations.forEach(({ condition, message }) => validate(condition, field, message)); 
    });

    // Optional fields
    const phoneRegex = /^\+?\d{1,3}[-.\s]?\(?\d+\)?[-.\s]?\d+[-.\s]?\d+$/;
    if (company.email) validate(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email), "email", "O email não é válido!");
    if (company.contact) validate(!phoneRegex.test(company.contact), "contact", "O contacto deve ser um número de telefone válido!");
    if (company.phone) validate(!phoneRegex.test(company.phone), "phone", "O telefone do responsável deve ser um número de telefone válido!");
    if (company.website) validate(!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(company.website), "website", "O website deve ser uma URL válida!");
  }
}
