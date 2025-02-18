import { Entity, model, property, belongsTo } from "@loopback/repository";
import { User } from "./user.model";
// import {AppId} from './app-id.model';

@model({
  settings: {
    strict: false,
    postgresql: {
      table: "app_users_session",
    },
  },
})
export class AppUsersSession extends Entity {
  @property({
    type: "string",
    id: true,
    generated: false,
    required: true,
    defaultFn: "uuidv4",
    postgresql: {
      columnName: "id",
      dataType: "UUID",
      nullable: "NO",
    },
  })
  id: string;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "token",
      dataType: "text",
      nullable: "NO",
    },
  })
  token: string;

  @property({
    type: "date",
    required: true,
    postgresql: {
      columnName: "validity",
      dataType: "timestamp",
      nullable: "NO",
    },
  })
  validity: string;

  @property({
    type: "date",
    postgresql: {
      columnName: "login",
      dataType: "timestamp",
    },
  })
  login?: string;

  @property({
    type: "date",
    postgresql: {
      columnName: "logout",
      dataType: "timestamp",
    },
  })
  logout?: string;

  @belongsTo(
    () => User,
    { name: "user" },
    {
      type: "string",
      generated: false,
      required: true,
      postgresql: {
        columnName: "app_users_id",
        dataType: "UUID",
        nullable: "NO",
      },
    }
  )
  app_users_id: string;

  // @belongsTo(() => AppId, {name: 'appId'}, {
  //   type: 'string',
  //   generated: false,
  //   postgresql: {
  //     columnName: 'app_id',
  //     dataType: 'UUID',
  //   }
  // })
  // app_id?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<AppUsersSession>) {
    super(data);
  }
}

export interface AppUsersSessionRelations {
  // describe navigational properties here
}

export type AppUsersSessionWithRelations = AppUsersSession &
  AppUsersSessionRelations;
