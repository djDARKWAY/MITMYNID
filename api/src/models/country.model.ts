import { Entity, model, property } from "@loopback/repository";

@model({
  settings: {
    postgresql: {
      schema: "network",
      table: "country",
    },
  },
})
export class Country extends Entity {
  @property({
    type: "string",
    id: true,
    required: true,
    postgresql: {
      columnName: "id",
      dataType: "char",
      dataLength: 2,
    },
  })
  id?: string;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "name",
      dataType: "varchar",
      dataLength: 100,
    },
  })
  name: string;

  @property({
    type: "number",
    required: true,
    postgresql: {
      columnName: "country_code",
      dataType: "integer",
    },
  })
  country_code: number;

  @property({
    type: "string",
    required: false,
    postgresql: {
      columnName: "flag_url",
      dataType: "text",
    },
  })
  flag_url?: string;

  constructor(data?: Partial<Country>) {
    super(data);
  }
}

export interface CountryRelations {
  // describe navigational properties here
}

export type CountryWithRelations = Country & CountryRelations;
