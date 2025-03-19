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
    if (filter?.where && 'timestamp' in filter.where) {
      const timestamp = (filter.where as any).timestamp;
      (filter.where as any).timestamp = {
        between: [
          new Date(timestamp).toISOString(),
          new Date(timestamp).toISOString().replace("T00:00:00.000Z", "T23:59:59.999Z")
        ]
      };
    }
    return this.logRepository.find(filter);
  }

  @get('/logs/types')
  @response(200, {
    description: 'Array of unique log types',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {type: 'string'},
        },
      },
    },
  })
  async findLogTypes(): Promise<string[]> {
    const logs = await this.logRepository.find();
    const types = logs.map(log => log.type);
    return Array.from(new Set(types));
  }
}
