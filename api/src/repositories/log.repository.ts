import {DefaultCrudRepository, BelongsToAccessor, repository} from '@loopback/repository';
import {Log, LogRelations, LogType} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {LogTypeRepository} from './log-type.repository';

export class LogRepository extends DefaultCrudRepository<
  Log,
  typeof Log.prototype.id,
  LogRelations
> {
  public readonly type: BelongsToAccessor<LogType, typeof Log.prototype.id>;

  constructor(
    @inject('datasources.status') dataSource: DbDataSource,
    @repository.getter('LogTypeRepository') protected logTypeRepositoryGetter: Getter<LogTypeRepository>,
  ) {
    super(Log, dataSource);
    
    this.type = this.createBelongsToAccessorFor('type', logTypeRepositoryGetter);
    this.registerInclusionResolver('type', this.type.inclusionResolver);
  }
}
