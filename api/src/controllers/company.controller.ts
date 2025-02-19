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
    company: Omit<Company, "idCompany">
  ): Promise<Company> {
    return this.companyRepository.create(company);
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
}
