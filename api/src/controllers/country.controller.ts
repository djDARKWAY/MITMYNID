import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from "@loopback/repository";
import {
  param,
  get,
  getModelSchemaRef,
  response,
} from "@loopback/rest";
import { Country } from "../models";
import { CountryRepository } from "../repositories";

export class CountryController {
  constructor(
    @repository(CountryRepository)
    public countryRepository: CountryRepository
  ) {}

  @get("/countries/count")
  @response(200, {
    description: "Country model count",
    content: { "application/json": { schema: CountSchema } },
  })
  async count(@param.where(Country) where?: Where<Country>): Promise<Count> {
    return this.countryRepository.count(where);
  }

  @get("/countries")
  @response(200, {
    description: "Array of Country model instances",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: getModelSchemaRef(Country, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Country) filter?: Filter<Country>
  ): Promise<Country[]> {
    return this.countryRepository.find(filter);
  }
}
