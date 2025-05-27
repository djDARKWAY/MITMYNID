import { authenticate, TokenService, UserService } from "@loopback/authentication";
import { inject, intercept } from "@loopback/core";
import { repository } from "@loopback/repository";
import { post, requestBody, get, Response, Request, RestBindings } from "@loopback/rest";
import { AuthServiceBindings, EmailServiceBindings, PasswordHasherBindings, TokenServiceBindings } from "../keys";
import { PedidosRemocao, User } from "../models";
import { UserRepository, UserRoleRepository, RoleRepository, Credentials, AppUsersSessionRepository, SignInCredentials, AppUsersRegisterRepository, PedidosRemocaoRepository, AppUsersAuthenticatorRepository } from "../repositories";
import { PasswordHasher } from "../services";
import {
  CredentialsLoginRequestBody,
  UserProfileSchema,
  CredentialsPublicSignRequestBody
} from "./specs/user-controller.specs";
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { decode } from 'jsonwebtoken';
import { JWT } from "../types";
import { randomBytes } from "crypto";
import { EmailService } from "../services/email.service";
import {LogService} from '../services/log.service';
import * as useragent from 'useragent';

export class AuthController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(UserRoleRepository) public userRoleRepository: UserRoleRepository,
    @repository(PedidosRemocaoRepository) public pedidosRemocaoRepository: PedidosRemocaoRepository,
    @repository(RoleRepository) public roleRepository: RoleRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER) public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject(AuthServiceBindings.AUTH_SERVICE) public authService: UserService<User, Credentials>,
    @inject(SecurityBindings.USER, { optional: true }) public user: UserProfile,
    @inject('services.LogService') private logService: LogService,
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

    const user = await this.authService.verifyCredentials(credentials);

    if (!credentials.id || !credentials.code) {

      const gen_auth = await this.appUsersAuthenticatorRepository.execute('SELECT * FROM users.generate_authenticator()')
        .then((data) => data[0]);

      const authenticator = await this.appUsersAuthenticatorRepository.create({ app_users_id: user.id, code: gen_auth.code, expires: gen_auth.expires })

      // Temporarily disable email sending
      // this.emailService.sendMailAuthenticator('pt-pt', user.email, user.person_name, gen_auth.code);

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
    const ip = this.request.ip;
    const userAgentHeader = this.request.headers['user-agent'] || 'unknown';
    const agent = useragent.parse(userAgentHeader);
    const deviceInfo = {
      device: agent.device.toString(),
      os: agent.os.toString(),
    };

    const existingUser = await this.userRepository.findOne({
      where: { username: credentials.username },
    });

    if (!existingUser) {
      await this.logService.logLoginFailure(
        credentials.username, 
        ip as string, 
        'User not found', 
        deviceInfo
      );
      throw new Error('USER_NOT_FOUND');
    }

    if (!existingUser.active) {
      await this.logService.logLoginFailure(
        credentials.username, 
        ip as string, 
        'Account blocked', 
        deviceInfo
      );
      throw new Error('ACCOUNT_BLOCKED');
    }

    if (existingUser.login_attempts && existingUser.login_attempts >= 5) {
      try {
        await this.userRepository.updateById(existingUser.id, { 
          blocked: true 
        });
        
        await this.logService.logLoginFailure(
          credentials.username, 
          ip as string, 
          'Account blocked after 5 failed attempts', 
          deviceInfo
        );
      } catch (updateErr) {
        console.error('Error updating user blocked status:', updateErr);
      }
      
      throw new Error('ACCOUNT_BLOCKED_MAX_ATTEMPTS');
    }

    try {
      const user = await this.authService.verifyCredentials(credentials);
      
      try {
        await this.userRepository.updateById(user.id, { 
          login_attempts: 0 
        });
      } catch (updateErr) {
        console.error('Error resetting login attempts:', updateErr);
      }
      
      const userProfile = this.authService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(userProfile);
      const decodedToken = decode(token) as JWT;

      if (!decodedToken) return;

      const tokenValidaty = new Date(decodedToken.exp * 1000);

      await this.appUsersSessionRepository.create({
        app_users_id: userProfile[securityId],
        token: token,
        login: new Date().toISOString(),
        validity: tokenValidaty.toISOString(),
      });

      await this.logService.logLoginSuccess(
        user.person_name, 
        ip as string, 
        deviceInfo, 
        userProfile[securityId]
      );
      return { token: token };
    } catch (err) {
      const isCredentialError = 
        err.name === 'UnauthorizedError' ||
        (err.message && (
          err.message.includes('Invalid credentials') || 
          err.message.includes('Utilizador ou palavra-passe inválidos')
        ));
      
      if (isCredentialError && existingUser) {
        try {
          const currentAttempts = existingUser.login_attempts || 0;
          const newAttempts = currentAttempts + 1;
          
          console.log(`Current login_attempts: ${currentAttempts}`);
          console.log(`Setting login_attempts to ${newAttempts} for user ${existingUser.username} (ID: ${existingUser.id})`);
          
          await this.userRepository.updateById(existingUser.id, { 
            login_attempts: newAttempts 
          });
          
          if (newAttempts >= 5) {
            await this.userRepository.updateById(existingUser.id, { 
              blocked: true 
            });
            
            await this.logService.logLoginFailure(
              credentials.username, 
              ip as string, 
              'Account blocked after 5 failed attempts', 
              deviceInfo
            );
            
            throw new Error('ACCOUNT_BLOCKED_MAX_ATTEMPTS');
          }
          
          await this.logService.logLoginFailure(
            credentials.username, 
            ip as string, 
            `Invalid password (attempt ${newAttempts} of 5)`, 
            deviceInfo
          );
        } catch (updateErr) {
          console.error('Error updating login attempts:', updateErr);
        }
      } else {
        await this.logService.logLoginFailure(
          credentials.username, 
          ip as string, 
          err.message, 
          deviceInfo
        );
      }
      throw err;
    }
  }
  
  @get('/auth/logout', {
    responses: {
      '200': {
        description: 'Logout user',
      },
    },
  })
  @authenticate('jwt')
  async logout(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<void> {
    const ip = this.request.ip;
    const userAgentHeader = this.request.headers['user-agent'] || 'unknown';
    const agent = useragent.parse(userAgentHeader);
    const deviceInfo = {
      device: agent.device.toString(),
      os: agent.os.toString(),
    };

    const user = await this.userRepository.findById(currentUserProfile[securityId]);

    if (!user) {
      throw new Error('User not found');
    }

    const lastSession = await this.appUsersSessionRepository.findOne({
      order: ['login DESC'],
      where: {
        app_users_id: currentUserProfile[securityId]
      }
    });

    if (lastSession) {
      await this.appUsersSessionRepository.updateById(lastSession.id, { logout: new Date().toISOString() });
      await this.logService.logLogout(user.person_name ?? 'Administrador', ip ?? 'unknown', deviceInfo, currentUserProfile[securityId]);
    }
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
    return this.userRepository.findById(currentUserProfile[securityId]);
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

    // Mandatory fields validation
    const rules: { [key: string]: { condition: boolean; message: string }[] } = {
      username: [
        { condition: !credentials.username, message: "O nome de utilizador é obrigatório!" },
        { condition: credentials.username?.length < 3, message: "O nome de utilizador deve ter pelo menos 3 caracteres!" },
        { condition: credentials.username?.length > 50, message: "O nome de utilizador é muito longo!" },
        { condition: !/^[a-zA-Z0-9_.-]+$/.test(credentials.username || ''), message: "O nome de utilizador só pode conter letras, números, pontos, hífens e underscores!" },
      ],
      password: [
        { condition: !credentials.password, message: "A password é obrigatória!" },
        { condition: credentials.password?.length < 8, message: "A password deve ter pelo menos 8 caracteres!" },
        { condition: !/[A-Z]/.test(credentials.password || ''), message: "A password deve conter pelo menos uma letra maiúscula!" },
        { condition: !/[a-z]/.test(credentials.password || ''), message: "A password deve conter pelo menos uma letra minúscula!" },
        { condition: !/[0-9]/.test(credentials.password || ''), message: "A password deve conter pelo menos um número!" },
        { condition: !/[!@#$%^&*(),.?":{}|<>]/.test(credentials.password || ''), message: "A password deve conter pelo menos um caractere especial!" },
      ],
      person_name: [
        { condition: !credentials.person_name, message: "O nome é obrigatório!" },
        { condition: credentials.person_name?.length < 2, message: "O nome deve ter pelo menos 2 caracteres!" },
        { condition: credentials.person_name?.length > 100, message: "O nome é muito longo!" },
      ],
      email: [
        { condition: !credentials.email, message: "O email é obrigatório!" },
        { condition: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email || ''), message: "O formato do email é inválido!" },
      ],
      nif: [
        { condition: !credentials.nif, message: "O NIF é obrigatório!" },
        { condition: !/^\d{9}$/.test(credentials.nif || ''), message: "O NIF deve conter exatamente 9 dígitos!" },
      ],
    };

    for (const [field, validations] of Object.entries(rules)) {
      for (const { condition, message } of validations) {
        if (condition) {
          return this.response.status(422).send({ field, message });
        }
      }
    }

    const userDetails = await this.userRepository.findOne({
      where: {
        or: [
          { email: credentials.email },
          { username: credentials.username }
        ]
      }
    });

    if (userDetails) return this.response.status(422).send({ message: 'Utilizador inválido. Contacte a entidade' });
    const hashPassword = await this.passwordHasher.hashPassword(credentials.password);

    await this.userRepository.create({
      person_name: credentials.person_name,
      password: hashPassword,
      email: credentials.email,
      username: credentials.username,
      nif: credentials.nif,
      active: false,
      validation_date: undefined
    }).then(async (value) => {

      //role de utilizador
      await this.userRoleRepository.create({
        role_id: '78950dce-2093-4679-b59c-73f9cad3abad',
        app_users_id: value.id
      });
    });

    return this.response.status(201).send({ message: 'Utilizador registado com sucesso' });
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
    const encryptedString = encodeURIComponent(randomBytes(64).toString('base64url'));

    await this.appUsersRegisterRepository.create({
      app_users_id: userDetails.id,
      code: encryptedString,
      type: 2,
    });

    // Temporarily disable email sending
    // this.emailService.sendMailForgotPassword('pt-pt', body.email, userDetails.person_name, encryptedString);
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
      // Temporarily disable email sending
      // this.emailService.sendMailDelete('pt-pt', user.email, user.person_name, encryptedString);

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
      await this.pedidosRemocaoRepository.execute(`SELECT users.fn_delete_user('${body.code}')`)
      return
    }

    return this.response.status(422).send({ message: 'Utilizador inválido. Contacte a entidade' })
  }
}