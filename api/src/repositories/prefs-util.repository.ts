import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {PrefsUtil, PrefsUtilRelations} from '../models';

export class PrefsUtilRepository extends DefaultCrudRepository<
  PrefsUtil,
  typeof PrefsUtil.prototype.id_utilizador,
  PrefsUtilRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(PrefsUtil, dataSource);
  }
}
