import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {NetworkDataSource} from '../datasources';
import {Company, CompanyRelations} from '../models';

export class CompanyRepository extends DefaultCrudRepository<
  Company,
  typeof Company.prototype.id,
  CompanyRelations
> {
  constructor(
    @inject('datasources.network') dataSource: NetworkDataSource,
  ) {
    super(Company, dataSource);
  }
}
