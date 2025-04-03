import { HttpErrors } from '@loopback/rest';
import { Credentials, RoleRepository, UserRepository, UserRoleRepository } from '../repositories';
import { User } from '../models';
import { UserService } from '@loopback/authentication';
import { securityId, UserProfile } from '@loopback/security';
import { repository } from '@loopback/repository';
import { PasswordHasherBindings } from '../keys';
import { inject } from '@loopback/context';
import { PasswordHasher } from './hash-password.service';

export class AuthService implements UserService<User, Credentials>{
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @repository(UserRoleRepository) public userRoleRepository: UserRoleRepository,
        @repository(RoleRepository) public roleRepository: RoleRepository,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public passwordHasher: PasswordHasher,
    ){
    }

    async verifyCredentials(credentials: Credentials): Promise<User>{

        const invalidCredentialsError = 'Utilizador ou palavra-passe inválidos';

        credentials.username = credentials.username.toLowerCase();

        const foundUser = await this.userRepository.findOne({
            where: {username: credentials.username},
        });

        if (!foundUser){
            throw new HttpErrors.Unauthorized(invalidCredentialsError);
        }

        const credentialsFound = await this.userRepository.findCredentials(
            foundUser.id,
        );

        if (!credentialsFound){
            throw new HttpErrors.Unauthorized(invalidCredentialsError);
        }

        if(!credentialsFound.active || credentialsFound.blocked===true){
            throw new HttpErrors.Unauthorized(invalidCredentialsError);
        }

        const passwordMatched = await this.passwordHasher.comparePassword(
            credentials.password,
            credentialsFound.password,
        );

        if (!passwordMatched){
            throw new HttpErrors.Unauthorized(invalidCredentialsError);
        }



        return foundUser;
    }

    convertToUserProfile(user: User): UserProfile{
        // since first person_name and lastName are optional, no error is thrown if not provided
        const roles = this.userRepository.findRoles(user.id)
        return {
            [securityId]: user.id as string,
            id: user.id,
            person_name: user.person_name,
            roles: roles
        };
    }
}
