import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {CookiesType, CookiesTypeRelations} from '../models';

export class CookiesTypeRepository extends DefaultCrudRepository<
  CookiesType,
  typeof CookiesType.prototype.id,
  CookiesTypeRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(CookiesType, dataSource);
  }
}
