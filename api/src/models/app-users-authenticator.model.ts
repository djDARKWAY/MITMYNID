import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model({
  settings: {
    strict: false,
    postgresql: {
      table: 'app_users_authenticator',
    },
  }
})
export class AppUsersAuthenticator extends Entity {
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


  @belongsTo(() => User, {name: 'user'})
  app_users_id: string;

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
    postgresql: {
      columnName: 'expires',
      dataType: 'timestamp with time zone',
    },
  })
  expires: string;

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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<AppUsersAuthenticator>) {
    super(data);
  }
}

export interface AppUsersAuthenticatorRelations {
  // describe navigational properties here
}

export type AppUsersAuthenticatorWithRelations = AppUsersAuthenticator & AppUsersAuthenticatorRelations;
