import {Entity, model, property} from '@loopback/repository';

@model()
export class Country extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  country_code: number;


  constructor(data?: Partial<Country>) {
    super(data);
  }
}

export interface CountryRelations {
  // describe navigational properties here
}

export type CountryWithRelations = Country & CountryRelations;
