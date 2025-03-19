import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StatusDataSource} from '../datasources';
import {Log, LogRelations} from '../models';

export class LogRepository extends DefaultCrudRepository<
  Log,
  typeof Log.prototype.id,
  LogRelations
> {
  constructor(
    @inject('datasources.status') dataSource: StatusDataSource,
  ) {
    super(Log, dataSource);
  }
}
