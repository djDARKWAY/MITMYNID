import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, BelongsToAccessor, repository} from '@loopback/repository';
import {NetworkDataSource} from '../datasources';
import {Warehouse, WarehouseRelations } from '../models/warehouse.model';
import {Country} from '../models/country.model';
import {CountryRepository} from './country.repository';

export class WarehouseRepository extends DefaultCrudRepository<
  Warehouse,
  typeof Warehouse.prototype.id,
  WarehouseRelations
> {
  public readonly country: BelongsToAccessor<Country, typeof Warehouse.prototype.id>;

  constructor(
    @inject('datasources.network') dataSource: NetworkDataSource,
    @repository.getter('CountryRepository') protected countryRepositoryGetter: Getter<CountryRepository>,
  ) {
    super(Warehouse, dataSource);

    this.country = this.createBelongsToAccessorFor('country', countryRepositoryGetter);
    this.registerInclusionResolver('country', this.country.inclusionResolver);
  }
}
