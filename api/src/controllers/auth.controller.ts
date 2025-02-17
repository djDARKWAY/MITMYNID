import { authenticate, TokenService, UserService } from "@loopback/authentication";
import { inject, intercept } from "@loopback/core";
import { repository } from "@loopback/repository";
import { post, requestBody, get, Response, Request, RestBindings } from "@loopback/rest";
import { AuthServiceBindings, EmailServiceBindings, PasswordHasherBindings, TokenServiceBindings } from "../keys";
import { PedidosRemocao, PrefsUtil, User } from "../models";
import { UserRepository, UserRoleRepository, RoleRepository, Credentials, AppUsersSessionRepository, SignInCredentials, AppUsersRegisterRepository, PrefsUtilRepository, PedidosRemocaoRepository, AppUsersAuthenticatorRepository } from "../repositories";
import { PasswordHasher } from "../services";
import {
  CredentialsLoginRequestBody,
  UserProfileSchema,
  CredentialsPublicSignRequestBody
} from "./specs/user-controller.specs";
import { log } from "../interceptors/log";
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { decode } from 'jsonwebtoken';
import { JWT } from "../types";
import { randomBytes } from "crypto";
import { EmailService } from "../services/email.service";

export class AuthController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(UserRoleRepository) public userRoleRepository: UserRoleRepository,
    @repository(PrefsUtilRepository) public prefsUserRepository: PrefsUtilRepository,
    @repository(PedidosRemocaoRepository) public pedidosRemocaoRepository: PedidosRemocaoRepository,
    @repository(RoleRepository) public roleRepository: RoleRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER) public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject(AuthServiceBindings.AUTH_SERVICE) public authService: UserService<User, Credentials>,
    @inject(SecurityBindings.USER, { optional: true }) public user: UserProfile,
    @repository(AppUsersSessionRepository) public appUsersSessionRepository: AppUsersSessionRepository,
    @repository(AppUsersRegisterRepository) public appUsersRegisterRepository: AppUsersRegisterRepository,
    @repository(AppUsersAuthenticatorRepository) public appUsersAuthenticatorRepository: AppUsersAuthenticatorRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @inject(EmailServiceBindings.EMAIL_SERVICE) public emailService: EmailService,
  ) { }

  @post('/auth/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsLoginRequestBody) credentials: Credentials,
  ): Promise<{ token: string } | { authenticator: string } | void> {

    // ensure the user exists, and the password is correct
    const user = await this.authService.verifyCredentials(credentials);

    if (!credentials.id || !credentials.code) {

      const gen_auth = await this.appUsersAuthenticatorRepository.execute('SELECT * FROM template.generate_authenticator()')
        .then((data) => data[0]);

      const authenticator = await this.appUsersAuthenticatorRepository.create({ app_users_id: user.id, code: gen_auth.code, expires: gen_auth.expires })

      this.emailService.sendMailAuthenticator('pt-pt', user.email, user.person_name, gen_auth.code);

      return { authenticator: authenticator.id }
    }

    const authenticator = await this.appUsersAuthenticatorRepository.findOne({ where: { id: credentials.id, active: true } })

    if (!authenticator)
      return

    await this.appUsersAuthenticatorRepository.updateById(authenticator.id, { active: false })

    if (authenticator.code != credentials.code || new Date(authenticator.expires) < new Date())
      return

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.authService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    const decodedToken = decode(token) as JWT;

    if (!decodedToken) return

    const tokenValidaty = new Date(decodedToken.exp * 1000);

    await this.appUsersSessionRepository.create({
      app_users_id: userProfile[securityId],
      token: token,
      login: new Date().toISOString(),
      validity: tokenValidaty.toISOString()
    });

    return { token: token };
  }

  @post('/man/auth/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async loginMan(
    @requestBody(CredentialsLoginRequestBody) credentials: Credentials,
  ): Promise<{ token: string } | { authenticator: string } | void> {

    // ensure the user exists, and the password is correct
    const user = await this.authService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.authService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    const decodedToken = decode(token) as JWT;

    if (!decodedToken) return

    const tokenValidaty = new Date(decodedToken.exp * 1000);

    await this.appUsersSessionRepository.create({
      app_users_id: userProfile[securityId],
      token: token,
      login: new Date().toISOString(),
      validity: tokenValidaty.toISOString()
    });

    return { token: token };
  }

  @get('/auth/logout', {
    responses: {
      '200': {
        description: 'Logoust user',
      },
    },
  })
  @authenticate('jwt')
  async logout(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<void> {


    const lastSession = await this.appUsersSessionRepository.findOne({
      order: ['login DESC'],
      where: {
        app_users_id: currentUserProfile[securityId]
      }
    });

    if (lastSession) await this.appUsersSessionRepository.updateById(lastSession.id, { logout: new Date().toISOString() })

  }

  @get('/auth/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<User> {
    return this.userRepository.findById(currentUserProfile[securityId], { include: [{ relation: 'prefs_util' }] });
  }

  @post('/auth/register', {
    responses: {
      '200': {
        description: 'User registration',
        content: {
          'application/json': {
            schema: {}
          },
        },
      },
    },
  })
  async register(
    @requestBody(CredentialsPublicSignRequestBody) credentials: SignInCredentials,
  ): Promise<void | Response> {

    const userDetails = await this.userRepository.findOne({
      where: {
        or: [
          { email: credentials.email },
          { username: credentials.username }
        ]
      }
    });

    if (userDetails) return this.response.status(422).send({ message: 'Utilizador inválido. Contacte a entidade' });

    // if (userDetails && userDetails.active) return this.response.status(422).send({ message: 'Utilizador inválido. Contacte a entidade' });

    // if (userDetails && userDetails.blocked) return this.response.status(422).send({ message: 'Utilizador inválido. Contacte a entidade' });

    const hashPassword = await this.passwordHasher.hashPassword(credentials.password);

    await this.userRepository.create({
      person_name: credentials.person_name,
      password: hashPassword,
      email: credentials.email,
      username: credentials.username,
      nif: credentials.nif,
      active: false
    }).then(async (value) => {

      const prefsUtil = {
        id_utilizador: value.id,
        lang_fav: undefined,
        tema_fav: undefined
      } as PrefsUtil;

      await this.prefsUserRepository.create(prefsUtil);

      //role de utilizador
      await this.userRoleRepository.create({
        role_id: '78950dce-2093-4679-b59c-73f9cad3abad',
        app_users_id: value.id
      });

      const encryptedString = encodeURIComponent(randomBytes(64).toString('base64url'));

      await this.appUsersRegisterRepository.create({
        app_users_id: value.id,
        code: encryptedString,
        type: 1,
      });

      this.emailService.sendMailRegister('pt-pt', credentials.email, credentials.person_name, encryptedString);

    });

  }

  @post('/auth/forgotPass/request', {
    responses: {
      '200': {
        description: 'User forgot password',
        content: {
          'application/json': {
            schema: {}
          },
        },
      },
    },
  })
  async forgotPassRequest(
    @requestBody() body: { email: string },
  ): Promise<void | Response> {

    const userDetails = await this.userRepository.findOne({
      where: {
        or: [
          { email: body.email }
        ]
      }
    });

    if (!userDetails) return

    // if (userDetails && userDetails.active) return this.response.status(422).send({ message: 'Utilizador inválido. Contacte a entidade' });

    // if (userDetails && userDetails.blocked) return this.response.status(422).send({ message: 'Utilizador inválido. Contacte a entidade' });



    const encryptedString = encodeURIComponent(randomBytes(64).toString('base64url'));

    await this.appUsersRegisterRepository.create({
      app_users_id: userDetails.id,
      code: encryptedString,
      type: 2,
    });

    this.emailService.sendMailForgotPassword('pt-pt', body.email, userDetails.person_name, encryptedString);



  }

  @post('/auth/delete/request', {
    responses: {
      '200': {
        description: 'User registration',
        content: {
          'application/json': {
            schema: {}
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async deleteRequest(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @requestBody() body: { motive: string },
  ): Promise<void | Response> {

    const user = await this.userRepository.findById(currentUserProfile[securityId])

    if (user) {

      const encryptedString = encodeURIComponent(randomBytes(64).toString('base64url'));

      this.pedidosRemocaoRepository.create({ email_cliente: user.email, motivo: body.motive, ip_cliente: this.request.ip, code: encryptedString })
      this.emailService.sendMailDelete('pt-pt', user.email, user.person_name, encryptedString);

      return this.response.status(200).send({ message: 'OK' })

    } else
      return this.response.status(404).send({ message: 'Utilizador não encontrado' })

  }

  @post('/auth/validate/reg', {
    responses: {
      '200': {
        description: 'User registration',
        content: {
          'application/json': {
            schema: {}
          },
        },
      },
    },
  })
  async validateReg(
    @requestBody() body: { code: string },
  ): Promise<void | Response> {

    if (body.code) {
      const findKey = await this.appUsersRegisterRepository.findOne({
        where: {
          code: body.code,
          active: true
        }
      });
      // console.log(findKey)

      if (!findKey) return this.response.status(422).send({ message: 'Utilizador inválido. Contacte a entidade' });

      await this.userRepository.updateById(findKey.app_users_id, { validation_date: new Date().toISOString() })
      await this.appUsersRegisterRepository.updateById(findKey.id, { active: false })

      return
    }

    return this.response.status(422).send({ message: 'Utilizador inválido. Contacte a entidade' })
  }

  @post('/auth/validate/del', {
    responses: {
      '200': {
        description: 'User registration',
        content: {
          'application/json': {
            schema: {}
          },
        },
      },
    },
  })
  async validateDel(
    @requestBody() body: { code: string },
  ): Promise<void | Response> {

    if (body.code) {
      const findKey = await this.pedidosRemocaoRepository.findOne({
        where: {
          code: body.code,
          data_confirm: undefined
        }
      });

      if (!findKey) return this.response.status(422).send({ message: 'Utilizador inválido. Contacte a entidade' });
      await this.pedidosRemocaoRepository.execute(`SELECT template.fn_delete_user('${body.code}')`)
      return
    }

    return this.response.status(422).send({ message: 'Utilizador inválido. Contacte a entidade' })
  }

}
