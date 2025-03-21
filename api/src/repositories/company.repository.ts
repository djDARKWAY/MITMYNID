import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, BelongsToAccessor, repository} from '@loopback/repository';
import {NetworkDataSource} from '../datasources';
import {Company, CompanyRelations, Country} from '../models';
import {CountryRepository} from './country.repository';

export class CompanyRepository extends DefaultCrudRepository<
  Company,
  typeof Company.prototype.id,
  CompanyRelations
> {
  public readonly country: BelongsToAccessor<Country, typeof Company.prototype.id>;

  constructor(
    @inject('datasources.network') dataSource: NetworkDataSource,
    @repository.getter('CountryRepository') protected countryRepositoryGetter: Getter<CountryRepository>,
  ) {
    super(Company, dataSource);

    this.country = this.createBelongsToAccessorFor('country', countryRepositoryGetter);
    this.registerInclusionResolver('country', this.country.inclusionResolver);
  }
}
