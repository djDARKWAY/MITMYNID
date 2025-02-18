import { Entity, model, property } from "@loopback/repository";

@model({
  settings: {
    strict: false,
    postgresql: {
      table: "cookies_type",
    },
  },
})
export class CookiesType extends Entity {
  @property({
    type: "number",
    id: true,
    generated: true,
    postgresql: {
      columnName: "id",
      dataType: "integer",
      nullable: "NO",
    },
  })
  id?: number;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "title",
      dataType: "text",
      nullable: "NO",
    },
  })
  title: string;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "description",
      dataType: "text",
      nullable: "NO",
    },
  })
  description: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "short_desc",
      dataType: "text",
      nullable: "YES",
    },
    jsonSchema: {
      type: "string",
      nullable: true,
    },
  })
  short_desc?: string;

  @property({
    type: "boolean",
    required: true,
    default: true,
    postgresql: {
      columnName: "optional",
      dataType: "boolean",
      nullable: "NO",
    },
  })
  optional: boolean;

  @property({
    type: "any",
    postgresql: {
      columnName: "tags",
      dataType: "text",
    },
  })
  tags?: string | null;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<CookiesType>) {
    super(data);
  }
}

export interface CookiesTypeRelations {
  // describe navigational properties here
}

export type CookiesTypeWithRelations = CookiesType & CookiesTypeRelations;
