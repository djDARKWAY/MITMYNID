import { Entity, model, property, belongsTo } from '@loopback/repository';
import { User } from './user.model';

@model({
  settings: {
    strict: false,
    postgresql: {
      table: 'app_users_register',
    },
  }
})
export class AppUsersRegister extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    defaultFn: 'uuidv4',
    postgresql: {
      columnName: 'id',
      dataType: 'UUID',
      nullable: 'NO'
    },
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'code',
      dataType: 'text',
    },
  })
  code: string;

  @property({
    type: 'date',
    required: true,
    defaultFn: 'now',
    postgresql: {
      columnName: 'register_date',
      dataType: 'timestamp with time zone',
    },
  })
  register_date: string;

  @property({
    type: 'number',
    required: true,
    default: 1,
    postgresql: {
      columnName: 'type',
      dataType: 'integer',
      default: 1,
    },
  })
  type: number;

  @property({
    type: 'boolean',
    default: true,
    required: true,
    postgresql: {
      columnName: 'active',
      dataType: 'boolean',
      nullable: 'NO'
    },
  })
  active: boolean;

  @belongsTo(() => User, { name: 'user' })
  app_users_id: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<AppUsersRegister>) {
    super(data);
  }
}

export interface AppUsersRegisterRelations {
  // describe navigational properties here
}

export type AppUsersRegisterWithRelations = AppUsersRegister & AppUsersRegisterRelations;
