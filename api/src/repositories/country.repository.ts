import { inject } from "@loopback/core";
import { DefaultCrudRepository } from "@loopback/repository";
import { NetworkDataSource } from "../datasources";
import { Country, CountryRelations } from "../models";

export class CountryRepository extends DefaultCrudRepository<
  Country,
  typeof Country.prototype.id,
  CountryRelations
> {
  constructor(@inject("datasources.network") dataSource: NetworkDataSource) {
    super(Country, dataSource);
  }
}
