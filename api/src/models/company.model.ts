import { Entity, model, property, belongsTo } from "@loopback/repository";
import { User } from "./user.model";

@model()
export class Company extends Entity {
  @property({
    type: "number",
    id: true,
    generated: true,
    postgresql: {
      columnName: "id",
      dataType: "serial",
      nullable: "NO",
    },
  })
  id?: number;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "name",
      dataType: "varchar",
      dataLength: 255,
      nullable: "NO",
    },
  })
  name: string;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "address",
      dataType: "varchar",
      dataLength: 255,
      nullable: "NO",
    },
  })
  address: string;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "city",
      dataType: "varchar",
      dataLength: 255,
      nullable: "NO",
    },
  })
  city: string;

  @property({
    type: "number",
    required: true,
    postgresql: {
      columnName: "country_id",
      dataType: "integer",
      nullable: "NO",
    },
  })
  country_id: number;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "zip_code",
      dataType: "varchar",
      dataLength: 20,
      nullable: "NO",
    },
  })
  zip_code: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "email",
      dataType: "text",
      nullable: "YES",
    },
  })
  email?: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "contact",
      dataType: "text",
      nullable: "YES",
    },
  })
  contact?: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "phone",
      dataType: "text",
      nullable: "YES",
    },
  })
  phone?: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "website",
      dataType: "text",
      nullable: "YES",
    },
  })
  website?: string;

  @property({
    type: "date",
    required: true,
    postgresql: {
      columnName: "created_date",
      dataType: "timestamp with time zone",
      nullable: "NO",
      default: "NOW()",
    },
  })
  created_date: string;

  @property({
    type: "date",
    required: true,
    postgresql: {
      columnName: "last_modified",
      dataType: "timestamp with time zone",
      nullable: "NO",
      default: "NOW()",
    },
  })
  last_modified: string;

  @belongsTo(() => User, { name: "last_modified_user_id" })
  last_modified_user_id?: number;

  constructor(data?: Partial<Company>) {
    super(data);
  }
}

export interface CompanyRelations {
  // describe navigational properties here
}

export type CompanyWithRelations = Company & CompanyRelations;
