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

  // @post('/cookiesTypes')
  // @response(200, {
  //   description: 'CookiesType model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(CookiesType)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(CookiesType, {
  //           title: 'NewCookiesType',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   cookiesType: Omit<CookiesType, 'id'>,
  // ): Promise<CookiesType> {
  //   return this.cookiesTypeRepository.create(cookiesType);
  // }

  // @get('/cookiesTypes/count')
  // @response(200, {
  //   description: 'CookiesType model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
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

  // @patch('/cookiesTypes')
  // @response(200, {
  //   description: 'CookiesType PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(CookiesType, {partial: true}),
  //       },
  //     },
  //   })
  //   cookiesType: CookiesType,
  //   @param.where(CookiesType) where?: Where<CookiesType>,
  // ): Promise<Count> {
  //   return this.cookiesTypeRepository.updateAll(cookiesType, where);
  // }

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

  // @patch('/cookiesTypes/{id}')
  // @response(204, {
  //   description: 'CookiesType PATCH success',
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(CookiesType, {partial: true}),
  //       },
  //     },
  //   })
  //   cookiesType: CookiesType,
  // ): Promise<void> {
  //   await this.cookiesTypeRepository.updateById(id, cookiesType);
  // }

  // @put('/cookiesTypes/{id}')
  // @response(204, {
  //   description: 'CookiesType PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() cookiesType: CookiesType,
  // ): Promise<void> {
  //   await this.cookiesTypeRepository.replaceById(id, cookiesType);
  // }

  // @del('/cookiesTypes/{id}')
  // @response(204, {
  //   description: 'CookiesType DELETE success',
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.cookiesTypeRepository.deleteById(id);
  // }
}
