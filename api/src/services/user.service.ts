import { repository } from "@loopback/repository";
import { User } from "../models";
import { UserRepository, UserRoleRepository } from "../repositories";

export interface CustomUserService<T = void> {
    updateRoles(user: User): T;
}

/**
 * @remark Este user foi desenvolvido para colocar regras de negócio mais extensas.
 * @remark Não foi implementado no
 */
export class CustomClassUserService {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @repository(UserRoleRepository) public userRoleRepository: UserRoleRepository
    ) { }

    async updateRoles(user: User) {
    if(user.roles && typeof user.roles[0]==='string'){
      //roles que está a receber
      const rolesAsString = user.roles as string[];
      //roles já existentes do user
      const roles = await this.userRoleRepository.find({
        where: {
          app_users_id: user.id
        }
      });

      if(roles.length<rolesAsString.length){
        //adicionou role
        for(const value of rolesAsString){
          const exists = await this.userRoleRepository.findOne({
            where: {
              app_users_id: user.id,
              role_id: value
            }
          });
  
          if(!exists){
            await this.userRoleRepository.create({
              app_users_id: user.id,
              role_id: value
            })
          }
        }

      } 
      else if(roles.length===rolesAsString.length && !roles.find(elem => elem.role_id===rolesAsString[0])){
        //trocou role
        await this.userRoleRepository.deleteAll({
          app_users_id: user.id,
          role_id: roles[0].role_id
        })

        await this.userRoleRepository.create({
          app_users_id: user.id,
          role_id: rolesAsString[0]
        })
      }
      else if(roles.length>rolesAsString.length){
        //removeu role
        for(let i = 0; i<roles.length; i++){
          const check = rolesAsString.includes(roles[i].role_id);
          if(check==false){
            await this.userRoleRepository.deleteAll({
              app_users_id: user.id,
              role_id: roles[i].role_id
            })
          }
        }
      }  

    } 
     /*else {
      await this.userRoleRepository.deleteAll({
        app_users_id: id,
      });
    }*/
  }
  
}