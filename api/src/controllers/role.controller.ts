import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { inject } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  Response,
  RestBindings,
} from '@loopback/rest';
import { basicAuthorization } from '../middlewares/auth.middleware';
import {Role} from '../models';
import {RoleRepository, UserRoleRepository} from '../repositories';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';

export class RoleController {
  constructor(
    @repository(RoleRepository)
    private roleRepository : RoleRepository,
    @inject(RestBindings.Http.RESPONSE) 
    private response: Response,
    @repository(UserRoleRepository) 
    private userRoleRepository: UserRoleRepository,
    @inject(SecurityBindings.USER, { optional: true })
    public user: UserProfile,
  ) {}

  async count(
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    return this.roleRepository.count(where);
  }

  // @post('/roles/one')
  // @response(200, {
  //   description: 'Role model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Role)}},
  // })
  // @authenticate('jwt')
  // @authorize({
  //   allowedRoles: ['ADMIN'],
  //   voters: [basicAuthorization],
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Role, {
  //           title: 'NewRole',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   role: Omit<Role, 'id'>,
  // ): Promise<Role> {
  //   return this.roleRepository.create(role);
  // }
  

  @get('/roles')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN'],
    voters: [basicAuthorization],
  })
  @response(200, {
    description: 'Array of Role model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Role, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Role) filter?: Filter<Role>,
  ): Promise<Role[]> {

    //@ts-ignore
    filter?.where={
      description: {neq: 'ADMIN'},
      ...filter?.where,
      app_id: {eq: '8fbbe14e-b1ae-427a-92e6-ad7422ebf7c8'},
    }

    return this.roleRepository.find(filter).then(async (roles) => {
      this.response.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
      this.response.setHeader('x-total-count', (await this.count(filter?.where)).count);
      return roles;
    });
  }

  /*@patch('/roles')
  @response(200, {
    description: 'Role PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {partial: true}),
        },
      },
    })
    role: Role,
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    return this.roleRepository.updateAll(role, where);
  }*/

  @get('/roles/{id}')
  @response(200, {
    description: 'Role model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Role, {includeRelations: true}),
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN'],
    voters: [basicAuthorization],
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Role, {exclude: 'where'}) filter?: FilterExcludingWhere<Role>
  ): Promise<Role> {
    return this.roleRepository.findById(id, filter);
  }

  // @patch('/roles/{id}')
  // @authenticate('jwt')
  // @authorize({
  //   allowedRoles: ['ADMIN'],
  //   voters: [basicAuthorization],
  // })
  // @response(204, {
  //   description: 'Role PATCH success',
  // })
  // async updateById(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Role, {partial: true}),
  //       },
  //     },
  //   })
  //   role: Role,
  // ): Promise<void> {
    

  //   const adminRoleId = await this.roleRepository.findOne({where: {description: 'ADMIN'}}).then((role) => role?.id);

  //   const adminCheck = await this.userRoleRepository.findOne({where: {app_users_id: this.user[securityId], role_id: adminRoleId}});
    
  //   if(adminCheck){
  //     await this.roleRepository.updateById(id, role);
  //   } else {
  //     this.response.status(422).send({
  //       message: 'Error editing role'
  //     });
  //   }
    
  // }

  /* @put('/roles/{id}')
  @response(204, {
    description: 'Role PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() role: Role,
  ): Promise<void> {

    

    await this.roleRepository.replaceById(id, role);
  } */

  // @del('/roles/{id}')
  // @response(204, {
  //   description: 'Role DELETE success',
  // })
  // @authenticate('jwt')
  // @authorize({
  //   allowedRoles: ['ADMIN'],
  //   voters: [basicAuthorization],
  // })
  // async deleteById(@param.path.string('id') id: string): Promise<void> {
    
  //   /*
  //   const hasAny = await this.userRoleRepository.findOne({
  //     where:{
  //       role_id: id,
  //     }
  //   });

    
  //   const adminCheck = await this.roleRepository.findById(id).then((role) => role.app_id);
    
  //   if(adminCheck!==1000){
  //     if(hasAny){
  //       this.response.status(422).send({
  //         message: "Can't delete role with an association"
  //       });
  //     } else {
  //       await this.userRoleRepository.deleteAll({role_id: id});
  //       await this.roleRepository.deleteById(id);
  //     }
  //   } else {
  //     this.response.status(422).send({
  //       message: 'Error deleting role'
  //     });
  //   }*/
    

  // }
}
