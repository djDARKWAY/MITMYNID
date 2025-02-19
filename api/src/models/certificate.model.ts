import { Entity, model, property, belongsTo } from "@loopback/repository";
import { User } from "./user.model";

@model()
export class Certificate extends Entity {
  @property({
    type: "number",
    id: true,
    generated: true,
    postgresql: {
      columnName: "idCertificate",
      dataType: "serial",
      nullable: "NO",
    },
  })
  idCertificate?: number;

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
      columnName: "filePath",
      dataType: "text",
      nullable: "NO",
    },
  })
  filePath: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "certificateText",
      dataType: "text",
      nullable: "YES",
    },
  })
  certificateText?: string;

  @property({
    type: "date",
    required: true,
    postgresql: {
      columnName: "issueDate",
      dataType: "date",
      nullable: "NO",
    },
  })
  issueDate: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "issuerUrl",
      dataType: "text",
      nullable: "YES",
    },
  })
  issuerUrl?: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "issuerName",
      dataType: "text",
      nullable: "YES",
    },
  })
  issuerName?: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "certificateData",
      dataType: "text",
      nullable: "YES",
    },
  })
  certificateData?: string;

  @property({
    type: "date",
    required: true,
    postgresql: {
      columnName: "expirationDate",
      dataType: "date",
      nullable: "NO",
    },
  })
  expirationDate: string;

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

  constructor(data?: Partial<Certificate>) {
    super(data);
  }
}

export interface CertificateRelations {
  // describe navigational properties here
}

export type CertificateWithRelations = Certificate & CertificateRelations;
