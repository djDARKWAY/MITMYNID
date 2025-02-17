import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {AppUsersSession, AppUsersSessionRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class AppUsersSessionRepository extends DefaultCrudRepository<
  AppUsersSession,
  typeof AppUsersSession.prototype.id,
  AppUsersSessionRelations
> {

  public readonly user: BelongsToAccessor<User, typeof AppUsersSession.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, 
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(AppUsersSession, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
