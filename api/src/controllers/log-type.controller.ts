import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  response,
} from '@loopback/rest';
import {LogType} from '../models';
import {LogTypeRepository} from '../repositories';

export class LogTypeController {
  constructor(
    @repository(LogTypeRepository)
    public logTypeRepository : LogTypeRepository,
  ) {}

  @get('/log-types/count')
  @response(200, {
    description: 'LogType model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(LogType) where?: Where<LogType>,
  ): Promise<Count> {
    return this.logTypeRepository.count(where);
  }

  @get('/log-types')
  @response(200, {
    description: 'Array of LogType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LogType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(LogType) filter?: Filter<LogType>,
  ): Promise<LogType[]> {
    return this.logTypeRepository.find(filter);
  }

  @get('/log-types/{id}')
  @response(200, {
    description: 'LogType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LogType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(LogType, {exclude: 'where'}) filter?: FilterExcludingWhere<LogType>
  ): Promise<LogType> {
    return this.logTypeRepository.findById(id, filter);
  }
}