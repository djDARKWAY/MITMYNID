import {
  Entity,
  model,
  property,
  hasMany,
  hasOne,
  belongsTo,
} from "@loopback/repository";
import { imageData } from "../types";
import { Role } from "./role.model";
import { UserRole } from "./user-role.model";
import { PrefsUtil } from "./prefs-util.model";

@model({
  settings: {
    hiddenProperties: ["password"],
    postgresql: {
      table: "app_users",
    },
    strict: false,
    description: "Dados dos utilizadores que acedem às aplicações.",
  },
})
export class User extends Entity {
  @property({
    type: "string",
    id: true,
    generated: false,
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
      columnName: "person_name",
      dataType: "text",
      nullable: "NO",
    },
  })
  person_name: string;

  @property({
    type: "string",
    required: true,
    index: {
      unique: true,
    },
    postgresql: {
      columnName: "username",
      dataType: "text",
      nullable: "NO",
    },
  })
  username: string;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "password",
      dataType: "text",
      nullable: "NO",
    },
  })
  password: string;

  @property({
    type: "string",
    //default: "",
    postgresql: {
      columnName: "address",
      dataType: "text",
      nullable: "YES",
    },
    jsonSchema: {
      type: "string",
      nullable: true,
    },
  })
  address?: string;

  @property({
    type: "string",
    //default: "",
    postgresql: {
      columnName: "nif",
      dataType: "text",
      nullable: "YES",
    },
    jsonSchema: {
      type: "string",
      nullable: true,
    },
  })
  nif?: string;

  @property({
    type: "string",
    //default: "",
    postgresql: {
      columnName: "nic",
      dataType: "text",
      nullable: "YES",
    },
    jsonSchema: {
      type: "string",
      nullable: true,
    },
  })
  nic?: string;

  @property({
    type: "string",
    //default: "",
    postgresql: {
      columnName: "cc_num",
      dataType: "text",
      nullable: "YES",
    },
    jsonSchema: {
      type: "string",
      nullable: true,
    },
  })
  cc_num?: string;

  @property({
    type: "string",
    required: true,
    index: {
      unique: true,
    },
    postgresql: {
      columnName: "email",
      dataType: "text",
      nullable: "NO",
    },
  })
  email: string;

  @property({
    type: "string",
    //default: "",
    postgresql: {
      columnName: "phone",
      dataType: "text",
      nullable: "YES",
    },
    jsonSchema: {
      type: "string",
      nullable: true,
    },
  })
  phone?: string;

  @property({
    type: "string",
    //default: "",
    postgresql: {
      columnName: "mobile",
      dataType: "text",
      nullable: "YES",
    },
    jsonSchema: {
      type: "string",
      nullable: true,
    },
  })
  mobile?: string;

  @property({
    type: "string",
    //default: "",
    postgresql: {
      columnName: "post_code",
      dataType: "text",
      nullable: "YES",
    },
    jsonSchema: {
      type: "string",
      nullable: true,
    },
  })
  post_code?: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "app_code",
      dataType: "text",
      nullable: "YES",
    },
    jsonSchema: {
      type: "string",
      nullable: true,
    },
  })
  app_code?: string;

  @property({
    type: "any",
    postgresql: {
      columnName: "photo",
      dataType: "text",
      nullable: "YES",
    },
    jsonSchema: {
      anyOf: [{ type: "null" }, { type: "object" }, { type: "string" }],
    },
  })
  photo?: imageData | null;

  @property({
    type: "boolean",
    default: true,
    required: true,
    postgresql: {
      columnName: "active",
      dataType: "boolean",
      nullable: "NO",
    },
  })
  active: boolean;

  @property({
    type: "boolean",
    default: false,
    required: true,
    postgresql: {
      columnName: "blocked",
      dataType: "boolean",
      nullable: "NO",
    },
  })
  blocked: boolean;

  @property({
    type: "boolean",
    default: false,
    required: true,
    postgresql: {
      columnName: "deleted",
      dataType: "boolean",
      nullable: "NO",
    },
  })
  deleted: boolean;

  @property({
    type: "string",
    postgresql: {
      columnName: "validation_date",
      dataType: "date",
      nullable: "YES",
    },
    jsonSchema: {
      type: "string",
      nullable: true,
    },
  })
  validation_date?: string;

  @property({
    type: "date",
    postgresql: {
      columnName: "last_access",
      dataType: "timestamp with time zone",
      nullable: "YES",
    },
    jsonSchema: {
      type: "string",
      nullable: true,
    },
  })
  last_access?: string;

  @hasMany(() => Role, {
    through: {
      model: () => UserRole,
      keyFrom: "app_users_id",
      keyTo: "role_id",
    },
  })
  roles: Role[] | string[];

  @hasOne(() => PrefsUtil, { keyFrom: "id", keyTo: "id_utilizador" })
  prefs_util?: PrefsUtil;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
