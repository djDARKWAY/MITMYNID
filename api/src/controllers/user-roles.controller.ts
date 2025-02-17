import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  response,
} from '@loopback/rest';
import { basicAuthorization } from '../middlewares/auth.middleware';
import {UserRole} from '../models';
import {UserRepository, UserRoleRepository} from '../repositories';

export class UserRolesController {
  constructor(
    @repository(UserRoleRepository)
    private userRoleRepository : UserRoleRepository,
    @repository(UserRepository)
    public userRepository : UserRepository,
  ) {}

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN'],
    voters: [basicAuthorization],
  })
  //@intercept(log)
  async count(
    @param.where(UserRole) where?: Where<UserRole>,
  ): Promise<Count> {
    return this.userRoleRepository.count(where);
  }

  @get('/user-roles')
  @response(200, {
    description: 'Array of UserRole model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserRole, {includeRelations: true}),
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN'],
    voters: [basicAuthorization],
  })
  //@intercept(log)
  async find(
    @param.filter(UserRole) filter?: Filter<UserRole>,
  ): Promise<UserRole[]> {
    return this.userRoleRepository.find(filter);
  }

  /*@patch('/user-roles')
  @response(200, {
    description: 'UserRole PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRole, {partial: true}),
        },
      },
    })
    userRole: UserRole,
    @param.where(UserRole) where?: Where<UserRole>,
  ): Promise<Count> {
    return this.userRoleRepository.updateAll(userRole, where);
  } */

  @get('/user-roles/{user_id}')
  @response(200, {
    description: 'UserRole model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserRole, {includeRelations: true}),
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN'],
    voters: [basicAuthorization],
  })
  //@intercept(log)
  async findById(
    @param.path.string('user_id') user_id: string,
    @param.filter(UserRole, {exclude: 'where'}) filter?: FilterExcludingWhere<UserRole>
  ): Promise<UserRole> {
    return this.userRoleRepository.findById(user_id, filter);
  }
}
