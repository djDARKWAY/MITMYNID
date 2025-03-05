import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { Count, Filter, repository, Where } from "@loopback/repository";
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  requestBody,
  response,
  RestBindings,
  Response,
} from '@loopback/rest';
import { AppUsersSession } from '../models';
import { AppUsersSessionRepository } from '../repositories';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';

export class AppUsersSessionController {
  constructor(
    @repository(AppUsersSessionRepository)
    public appUsersSessionRepository: AppUsersSessionRepository,
    @inject(RestBindings.Http.RESPONSE)
    private response: Response,
    @inject(SecurityBindings.USER, { optional: true }) public user: UserProfile,
  ) { }

  // @post('/app-users-sessions/one')
  // @response(200, {
  //   description: 'AppUsersSession model instance',
  //   content: { 'application/json': { schema: getModelSchemaRef(AppUsersSession) } },
  // })
  // @authenticate('jwt')
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(AppUsersSession, {
  //           title: 'NewAppUsersSession',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   appUsersSession: Omit<AppUsersSession, 'id'>,
  // ): Promise<AppUsersSession> {
  //   return this.appUsersSessionRepository.create(appUsersSession);
  // }

  // @get('/appUsersSessions/count')
  // @response(200, {
  //   description: 'AppUsersSession model count',
  //   content: { 'application/json': { schema: CountSchema } },
  // })
  // @authenticate('jwt')
  async count(
    @param.where(AppUsersSession) where?: Where<AppUsersSession>,
  ): Promise<Count> {
    return this.appUsersSessionRepository.count(where);
  }

  @get('/app-users-sessions')
  @response(200, {
    description: 'Array of AppUsersSession model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AppUsersSession, { includeRelations: true }),
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(AppUsersSession) filter?: Filter<AppUsersSession>,
  ): Promise<AppUsersSession[]> {
    
    if(!filter){
      filter = {}
    }

    if(this.user.roles.some((val : string) => val==='ADMIN')){
      filter.where = {
        app_users_id: this.user[securityId],
        ...filter.where,
      }
    } else {
      filter.where = {
        ...filter.where,
        app_users_id: this.user[securityId]
      }
    }

    return this.appUsersSessionRepository.find(filter).then(async (appUsersSession) => {
      this.response.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
      this.response.setHeader('x-total-count', (await this.count(filter?.where)).count);
      return appUsersSession;
    });
  }

}
