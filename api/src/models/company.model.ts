import { Entity, model, property, belongsTo } from "@loopback/repository";
import { User } from "./user.model";
import { Country } from "./country.model";

@model({
  settings: {
    postgresql: { table: 'company' },
  },
})
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
    required: true,
    postgresql: {
      columnName: "district",
      dataType: "varchar",
      dataLength: 100,
      nullable: "NO",
    },
  })
  district: string;

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

  @property({
    type: 'number',
    postgresql: {
      columnName: 'lat',
    },
  })
  lat?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'lon',
    },
  })
  lon?: number;

  @belongsTo(() => Country, { name: 'country', keyFrom: 'country_id', keyTo: 'id' })
  country_id: string;

  @belongsTo(() => User, {name: "last_modified_user_id", keyFrom: 'last_modified_user_id', keyTo: 'id'})
  last_modified_user_id?: string;

  constructor(data?: Partial<Company>) {
    super(data);
  }
}

export interface CompanyRelations {
  country?: Country;
  last_modified_user_id?: User;
}

export type CompanyWithRelations = Company & CompanyRelations;
