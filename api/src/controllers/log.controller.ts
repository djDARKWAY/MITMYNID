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
} from '@loopback/rest';
import {Log} from '../models';
import {LogRepository} from '../repositories';

export class LogController {
  constructor(
    @repository(LogRepository)
    public logRepository : LogRepository,
  ) {}

  @post('/logs')
  @response(200, {
    description: 'Log model instance',
    content: {'application/json': {schema: getModelSchemaRef(Log)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Log, {
            title: 'NewLog',
            exclude: ['id'],
          }),
        },
      },
    })
    log: Omit<Log, 'id'>,
  ): Promise<Log> {
    return this.logRepository.create(log);
  }

  @get('/logs/count')
  @response(200, {
    description: 'Log model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Log) where?: Where<Log>,
  ): Promise<Count> {
    return this.logRepository.count(where);
  }

  @get('/logs')
  @response(200, {
    description: 'Array of Log model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Log, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Log) filter?: Filter<Log>,
  ): Promise<Log[]> {
    return this.logRepository.find(filter);
  }

  @patch('/logs')
  @response(200, {
    description: 'Log PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Log, {partial: true}),
        },
      },
    })
    log: Log,
    @param.where(Log) where?: Where<Log>,
  ): Promise<Count> {
    return this.logRepository.updateAll(log, where);
  }

  @get('/logs/{id}')
  @response(200, {
    description: 'Log model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Log, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Log, {exclude: 'where'}) filter?: FilterExcludingWhere<Log>
  ): Promise<Log> {
    return this.logRepository.findById(id, filter);
  }

  @patch('/logs/{id}')
  @response(204, {
    description: 'Log PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Log, {partial: true}),
        },
      },
    })
    log: Log,
  ): Promise<void> {
    await this.logRepository.updateById(id, log);
  }

  @put('/logs/{id}')
  @response(204, {
    description: 'Log PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() log: Log,
  ): Promise<void> {
    await this.logRepository.replaceById(id, log);
  }

  @del('/logs/{id}')
  @response(204, {
    description: 'Log DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.logRepository.deleteById(id);
  }
}
