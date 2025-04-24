import { Entity, model, property, belongsTo } from "@loopback/repository";
import { Certificate } from "./certificate.model";
import { Warehouse } from "./warehouse.model";
import { User } from "./user.model";

@model()
export class AccessPoint extends Entity {
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
      columnName: "location_description",
      dataType: "varchar",
      dataLength: 255,
      nullable: "NO",
    },
  })
  location_description: string;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "ip_address",
      dataType: "inet",
      nullable: "NO",
    },
  })
  ip_address: string;

  @property({
    type: "object",
    postgresql: {
      columnName: "pmode",
      dataType: "xml",
      nullable: "YES",
    },
  })
  pmode?: object;

  @property({
    type: "string",
    postgresql: {
      columnName: "ap_software",
      dataType: "text",
      nullable: "YES",
    },
  })
  ap_software?: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "software_version",
      dataType: "text",
      nullable: "YES",
    },
  })
  software_version?: string;

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
    type: "boolean",
    required: true,
    postgresql: {
      columnName: "is_active",
      dataType: "boolean",
      nullable: "NO",
      default: false,
    },
  })
  is_active: boolean;

  @belongsTo(() => Certificate, { name: "certificate" })
  certificate_id?: number | null;

  @belongsTo(() => Warehouse, { name: "warehouse" })
  warehouse_id?: number;

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
    type: "string",
    postgresql: {
      columnName: "last_modified_user_id",
      dataType: "uuid",
      nullable: "YES",
    },
  })
  last_modified_user_id?: string;

  constructor(data?: Partial<AccessPoint>) {
    super(data);
  }
}

export interface AccessPointRelations {
  warehouse?: Warehouse;
  last_modified_user_id?: User;
}

export type AccessPointWithRelations = AccessPoint & AccessPointRelations;
