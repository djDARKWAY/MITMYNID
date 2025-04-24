import { Entity, model, property, belongsTo } from "@loopback/repository";
import { User } from "./user.model";

@model()
export class Certificate extends Entity {
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
  id: number;

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
    postgresql: {
      columnName: "srv_cert",
      dataType: "text",
      nullable: "YES",
    },
  })
  srv_cert?: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "int_cert",
      dataType: "text",
      nullable: "YES",
    },
  })
  int_cert?: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "priv_key",
      dataType: "text",
      nullable: "YES",
    },
  })
  priv_key?: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "file_path",
      dataType: "text",
      nullable: "YES",
    },
  })
  file_path?: string;

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
    },
  })
  last_modified_user_id?: string;

  constructor(data?: Partial<Certificate>) {
    super(data);
  }
}

export interface CertificateRelations {
  last_modified_user_id?: User;
}

export type CertificateWithRelations = Certificate & CertificateRelations;
