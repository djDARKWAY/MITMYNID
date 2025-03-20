import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StatusDataSource} from '../datasources';
import {LogType, LogTypeRelations} from '../models';

export class LogTypeRepository extends DefaultCrudRepository<
  LogType,
  typeof LogType.prototype.id,
  LogTypeRelations
> {
  constructor(
    @inject('datasources.status') dataSource: StatusDataSource,
  ) {
    super(LogType, dataSource);
  }
}
