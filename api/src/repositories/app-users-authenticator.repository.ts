import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {AppUsersAuthenticator, AppUsersAuthenticatorRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class AppUsersAuthenticatorRepository extends DefaultCrudRepository<
  AppUsersAuthenticator,
  typeof AppUsersAuthenticator.prototype.id,
  AppUsersAuthenticatorRelations
> {

  public readonly user: BelongsToAccessor<User, typeof AppUsersAuthenticator.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(AppUsersAuthenticator, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
