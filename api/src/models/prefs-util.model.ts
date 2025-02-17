import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {
      table: 'prefs_util',
    },
    strict: false,
  }
})
export class PrefsUtil extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
    postgresql: {
      columnName: 'id_utilizador',
      dataType: 'UUID',
      nullable: 'NO'
    },
  })
  id_utilizador: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'tema_fav',
      dataType: 'text',
      nullable: 'YES',
    },
    jsonSchema: {
      type: 'string',
      nullable: true
    }
  })
  tema_fav?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'lang_fav',
      dataType: 'text',
      nullable: 'YES',
    },
    jsonSchema: {
      type: 'string',
      nullable: true
    }
  })
  lang_fav?: string | null;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PrefsUtil>) {
    super(data);
  }
}

export interface PrefsUtilRelations {
  // describe navigational properties here
}

export type PrefsUtilWithRelations = PrefsUtil & PrefsUtilRelations;
