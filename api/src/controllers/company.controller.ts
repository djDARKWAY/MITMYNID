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
    await this.companyRepository.replaceById(id, company);
  }

  // DELETE endpoint:
  @del("/companies/{id}")
  @response(204, {
    description: "Company DELETE success",
  })
  async deleteById(@param.path.number("id") id: number): Promise<void> {
    await this.companyRepository.deleteById(id);
  }

  validateCompany(company: Omit<Company, "idCompany" | "createdDate" | "lastModified" | "lastModifiedUser">): void {
    const check = (condition: boolean, message: string) => {
      if (condition) {
        throw new HttpErrors.BadRequest(message);
      }
    };

    // Validate company name
    check(!company.name || typeof company.name !== "string", "O nome da empresa é obrigatório.");
    check(company.name.length > 255, "O nome da empresa não pode ter mais de 255 caracteres.");

    // Validate company address
    check(!company.address || typeof company.address !== "string", "O endereço é obrigatório.");
    check(company.address.length > 255, "O endereço não pode ter mais de 255 caracteres.");

    // Validate company city
    check(!company.city || typeof company.city !== "string", "A cidade é obrigatória.");
    check(company.city.length > 255, "A cidade não pode ter mais de 255 caracteres.");

    // Validate company country
    check(!company.country || typeof company.country !== "string", "O país é obrigatório.");
    check(company.country.length > 100, "O país não pode ter mais de 100 caracteres.");

    // Validate company zipCode
    check(!company.zipCode || typeof company.zipCode !== "string", "O código postal é obrigatório.");
    check(company.zipCode.length > 20, "O código postal não pode ter mais de 20 caracteres.");
  }
}
