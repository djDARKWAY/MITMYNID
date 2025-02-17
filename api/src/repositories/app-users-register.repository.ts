import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {AppUsersRegister, AppUsersRegisterRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class AppUsersRegisterRepository extends DefaultCrudRepository<
  AppUsersRegister,
  typeof AppUsersRegister.prototype.id,
  AppUsersRegisterRelations
> {

  public readonly user: BelongsToAccessor<User, typeof AppUsersRegister.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(AppUsersRegister, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
