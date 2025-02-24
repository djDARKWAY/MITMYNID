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
            exclude: ["idCompany"],
          }),
        },
      },
    })
    company: Omit<Company, "idCompany" | "lastModified" | "lastModifiedUserId">
  ): Promise<Company> {
    this.validateCompany(company);

    return this.companyRepository.create({
      ...company,
      lastModified: new Date().toISOString(),
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
    return this.companyRepository.find({
      fields: {
        idCompany: true,
        name: true,
        city: true,
        country: true,
        createdDate: true,
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

  // PUT endpoint:
  @put("/companies/{id}")
  @response(204, {
    description: "Company PUT success",
  })
  async replaceById(
    @param.path.number("id") id: number,
    @requestBody() company: Company
  ): Promise<void> {
    const existingCompany = await this.companyRepository.findById(id);
    if (!existingCompany) {
      throw new HttpErrors.NotFound('Empresa não encontrada!');
    }
    await this.companyRepository.replaceById(id, company);
  }

  // DELETE endpoint:
  @del("/companies/{id}")
  @response(204, {
    description: "Company DELETE success",
  })
  async deleteById(@param.path.number("id") id: number): Promise<void> {
    const existingCompany = await this.companyRepository.findById(id);
    if (!existingCompany) {
      throw new HttpErrors.NotFound('Empresa não encontrada!');
    }
    await this.companyRepository.deleteById(id);
  }

  validateCompany(
    company: Omit<Company, "idCompany" | "createdDate" | "lastModified" | "lastModifiedUser">
  ): void {
    const validate = (condition: boolean, field: string, message: string) => { if (condition) throw new HttpErrors.BadRequest(`Erro no campo "${field}": ${message}`); };

    // Mandatory fields
    const rules: { [key: string]: { condition: boolean; message: string }[] } = {
      name: [
        { condition: !company.name, message: "O nome da empresa é obrigatório!" },
        { condition: company.name?.length > 255, message: "O nome da empresa não pode ter mais de 255 caracteres!" }
      ],
      address: [
        { condition: !company.address, message: "O endereço é obrigatório!" },
        { condition: company.address.length > 255, message: "O endereço não pode ter mais de 255 caracteres!" }
      ],
      city: [
        { condition: !company.city, message: "A cidade é obrigatória!" },
        { condition: company.city.length > 100, message: "A cidade não pode ter mais de 100 caracteres!" }
      ],
      country: [
        { condition: !company.country , message: "O país é obrigatório!" },
        { condition: company.country.length > 60, message: "O país não pode ter mais de 60 caracteres!" }
      ],
      zipCode: [
        { condition: !company.zipCode, message: "O código postal é obrigatório!" },
        { condition: company.zipCode.length > 20, message: "O código postal não pode ter mais de 20 caracteres!" }
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
