import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import {TokenService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import {TokenServiceBindings} from '../keys';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET) private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) private jwtExpiresIn: string,
    @repository(UserRepository) public userRepository: UserRepository,
  ) {
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      // decode user profile from token
      const decodedToken = await verifyAsync(token, this.jwtSecret);
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        {[securityId]: '', person_name: ''},
        {
          [securityId]: decodedToken.id,
          person_name: decodedToken.person_name,
          id: decodedToken.id,
          roles: decodedToken.roles
        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    
    // const isValid = await this.userRepository.findOne({where: {token:token}})

    // if (isValid == null) {
    //   throw new HttpErrors.Unauthorized(
    //     `Error verifying token : token is not valid.`,
    //   );
    // }

    return userProfile;
    
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }
    const userInfoForToken = {
      id: userProfile[securityId],
      person_name: userProfile.person_name,
      roles: await userProfile.roles
    };
    // Generate a JSON Web Token
    let token: string;
    try {
      token = await signAsync(userInfoForToken, this.jwtSecret, {expiresIn: Number(this.jwtExpiresIn)});
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }
    // await this.userRepository.updateById(userProfile[securityId], {token: token})
    return token;
  }
}
