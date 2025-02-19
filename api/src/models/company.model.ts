import { Entity, model, property, belongsTo } from "@loopback/repository";
import { User } from "./user.model";

@model()
export class Company extends Entity {
  @property({
    type: "number",
    id: true,
    generated: true,
    postgresql: {
      columnName: "idCompany",
      dataType: "serial",
      nullable: "NO",
    },
  })
  idCompany?: number;

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
    type: "string",
    required: true,
    postgresql: {
      columnName: "country",
      dataType: "varchar",
      dataLength: 100,
      nullable: "NO",
    },
  })
  country: string;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "zipCode",
      dataType: "varchar",
      dataLength: 20,
      nullable: "NO",
    },
  })
  zipCode: string;

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
      columnName: "createdDate",
      dataType: "timestamp with time zone",
      nullable: "NO",
      default: "NOW()",
    },
  })
  createdDate: string;

  @property({
    type: "date",
    required: true,
    postgresql: {
      columnName: "lastModified",
      dataType: "timestamp with time zone",
      nullable: "NO",
      default: "NOW()",
    },
  })
  lastModified: string;

  @belongsTo(() => User, { name: "lastModifiedUserId" })
  lastModifiedUserId?: number;

  constructor(data?: Partial<Company>) {
    super(data);
  }
}

export interface CompanyRelations {
  // describe navigational properties here
}

export type CompanyWithRelations = Company & CompanyRelations;
