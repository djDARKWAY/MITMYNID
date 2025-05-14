import { inject, Getter } from '@loopback/core';
import { DefaultCrudRepository, repository, HasManyThroughRepositoryFactory, BelongsToAccessor } from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { User, UserRelations, Role, UserRole } from '../models';
import { UserRoleRepository } from './user-role.repository';
import { RoleRepository } from './role.repository';

export type Credentials = {
  username: string;
  password: string;
  id?: string;
  code?: string;
};

export type SignInCredentials = {
  person_name: string;
  email: string;
  username: string;
  nif: string;
  password: string;
  entidade?: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly roles: HasManyThroughRepositoryFactory<Role, typeof Role.prototype.id,
    UserRole,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRoleRepository') protected userRoleRepositoryGetter: Getter<UserRoleRepository>,
    @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>,
    @repository(RoleRepository) public roleRepository: RoleRepository,
  ) {
    super(User, dataSource);
    this.roles = this.createHasManyThroughRepositoryFactoryFor('roles', roleRepositoryGetter, userRoleRepositoryGetter,);
    this.registerInclusionResolver('roles', this.roles.inclusionResolver);
  }

  async findCredentials(id: typeof User.prototype.id):
    Promise<User & UserRelations | undefined> {
    try {
      return await this.findById(id);
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }

  async findRoles(id: typeof User.prototype.id): Promise<string[]> {

    const userRoles: string[] = [];

    const userReloRepo = await this.userRoleRepositoryGetter();
    const roles = await userReloRepo.find({ where: { app_users_id: id } }).then((roles) => {

      let arrayIds: string[] = [];

      roles.map((value) => {
        arrayIds.push(value.role_id)
      });

      return arrayIds
    });

    if (roles.length > 0) {

      await this.roleRepository.find({
        where: {
          id: {
            inq: roles
          }
        }
      }).then((roles) => {
        roles.map((value) => {
          userRoles.push(value.description)
        });
      });

    }

    return userRoles

  }

}
