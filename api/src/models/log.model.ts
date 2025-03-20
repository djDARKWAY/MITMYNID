import {Entity, model, property, belongsTo } from '@loopback/repository';
import {LogType} from './log-type.model';

@model()
export class Log extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'date',
    required: true,
  })
  timestamp: string;

  @property({
    type: 'object',
  })
  metadata?: object;

  @belongsTo(() => LogType, {name: 'type'})
  type_id: number;

  constructor(data?: Partial<Log>) {
    super(data);
  }
}

export interface LogRelations {
  // describe navigational properties here
}

export type LogWithRelations = Log & LogRelations;
