import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
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
  Response,
  RestBindings,
} from '@loopback/rest';
import {CookiesType} from '../models';
import {CookiesTypeRepository} from '../repositories';
import { inject } from '@loopback/core';

export class CookiesTypeController {
  constructor(
    @repository(CookiesTypeRepository)
    public cookiesTypeRepository : CookiesTypeRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
  ) {}

  async count(
    @param.where(CookiesType) where?: Where<CookiesType>,
  ): Promise<Count> {
    return this.cookiesTypeRepository.count(where);
  }

  @get('/cookiesTypes')
  @response(200, {
    description: 'Array of CookiesType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CookiesType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CookiesType) filter?: Filter<CookiesType>,
  ): Promise<CookiesType[]> {
    return this.cookiesTypeRepository.find(filter).then(async (cookies) => {
      this.response.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
      this.response.setHeader('x-total-count', (await this.count(filter?.where)).count);
      return cookies;
    });
  }

  @get('/cookiesTypes/{id}')
  @response(200, {
    description: 'CookiesType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CookiesType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(CookiesType, {exclude: 'where'}) filter?: FilterExcludingWhere<CookiesType>
  ): Promise<CookiesType> {
    return this.cookiesTypeRepository.findById(id, filter);
  }
}
