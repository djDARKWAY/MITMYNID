import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Certificate} from './certificate.model';
import {Company} from './company.model';

@model()
export class AccessPoint extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {
      columnName: 'idAccessPoint',
      dataType: 'serial',
      nullable: 'NO',
    },
  })
  idAccessPoint?: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'locationDescription',
      dataType: 'varchar',
      dataLength: 255,
      nullable: 'NO',
    },
  })
  locationDescription: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'ipAddress',
      dataType: 'inet',
      nullable: 'NO',
    },
  })
  ipAddress: string;

  @property({
    type: 'object',
    postgresql: {
      columnName: 'configurations',
      dataType: 'jsonb',
      nullable: 'YES',
    },
  })
  configurations?: object;

  @property({
    type: 'object',
    postgresql: {
      columnName: 'permissions',
      dataType: 'jsonb',
      nullable: 'YES',
    },
  })
  permissions?: object;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'apSoftware',
      dataType: 'text',
      nullable: 'YES',
    },
  })
  apSoftware?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'softwareVersion',
      dataType: 'text',
      nullable: 'YES',
    },
  })
  softwareVersion?: string;

  @property({
    type: 'date',
    required: true,
    postgresql: {
      columnName: 'createdDate',
      dataType: 'timestamp with time zone',
      nullable: 'NO',
      default: 'NOW()',
    },
  })
  createdDate: string;

  @property({
    type: 'date',
    required: true,
    postgresql: {
      columnName: 'lastModified',
      dataType: 'timestamp with time zone',
      nullable: 'NO',
      default: 'NOW()',
    },
  })
  lastModified: string;

  @property({
    type: 'boolean',
    required: true,
    postgresql: {
      columnName: 'isActive',
      dataType: 'boolean',
      nullable: 'YES',
      default: true,
    },
  })
  isActive: boolean;

  @belongsTo(() => Certificate, {name: 'certificate'})
  certificateId?: number;

  @belongsTo(() => Company, {name: 'company'})
  companyId?: number;

  constructor(data?: Partial<AccessPoint>) {
    super(data);
  }
}

export interface AccessPointRelations {
  // describe navigational properties here
}

export type AccessPointWithRelations = AccessPoint & AccessPointRelations;
