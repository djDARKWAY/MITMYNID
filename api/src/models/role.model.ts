import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {
      table: 'role'
    },
    description: 'Perfis de utilizadores associados a cada aplicação instalada no sistema'
  }
})
export class Role extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
    postgresql: {
      columnName: 'id',
      dataType: 'UUID',
      nullable: 'NO'
    },
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'description',
      dataType: 'VARCHAR',
      nullable: 'NO',
      dataLength: 100
    },
    index: {
      unique: true
    }
  })
  description: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
