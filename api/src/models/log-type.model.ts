import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {schema: 'status', table: 'log_type'}
  }
})
export class LogType extends Entity {
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
  type: string;

  @property({
    type: 'string',
  })
  icon?: string;


  constructor(data?: Partial<LogType>) {
    super(data);
  }
}

export interface LogTypeRelations {
  // describe navigational properties here
}

export type LogTypeWithRelations = LogType & LogTypeRelations;
