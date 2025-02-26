import { Entity, model, property, belongsTo } from "@loopback/repository";
import { User } from "./user.model";

@model()
export class Certificate extends Entity {
  @property({
    type: "number",
    id: true,
    generated: true,
    postgresql: {
      columnName: "id_certificate",
      dataType: "serial",
      nullable: "NO",
    },
  })
  id_certificate?: number;

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
      columnName: "file_path",
      dataType: "text",
      nullable: "NO",
    },
  })
  file_path: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "certificate_text",
      dataType: "text",
      nullable: "YES",
    },
  })
  certificate_text?: string;

  @property({
    type: "date",
    required: true,
    postgresql: {
      columnName: "issue_date",
      dataType: "date",
      nullable: "NO",
    },
  })
  issue_date: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "issuer_url",
      dataType: "text",
      nullable: "YES",
    },
  })
  issuer_url?: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "issuer_name",
      dataType: "text",
      nullable: "YES",
    },
  })
  issuer_name?: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "certificate_data",
      dataType: "text",
      nullable: "YES",
    },
  })
  certificate_data?: string;

  @property({
    type: "date",
    required: true,
    postgresql: {
      columnName: "expiration_date",
      dataType: "date",
      nullable: "NO",
    },
  })
  expiration_date: string;

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
    type: "boolean",
    required: true,
    postgresql: {
      columnName: "is_expired",
      dataType: "boolean",
      nullable: "NO",
      default: false,
    },
  })
  is_expired: boolean;

  @belongsTo(() => User, { name: "last_modified_user_id" })
  last_modified_user_id?: number;

  constructor(data?: Partial<Certificate>) {
    super(data);
  }
}

export interface CertificateRelations {
  // describe navigational properties here
}

export type CertificateWithRelations = Certificate & CertificateRelations;
