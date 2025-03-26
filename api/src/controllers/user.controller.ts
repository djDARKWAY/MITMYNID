import { authenticate, TokenService, UserService } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { inject, intercept } from '@loopback/core';
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
import _ from 'lodash';
import { log } from '../interceptors/log';
import { EmailServiceBindings, PasswordHasherBindings, TokenServiceBindings, UserServiceBindings } from '../keys';
import { basicAuthorization } from '../middlewares/auth.middleware';
import { PrefsUtil, User } from '../models';
import { AppUsersSessionRepository, PrefsUtilRepository, RoleRepository, UserRepository, UserRoleRepository } from '../repositories';
import { CustomUserService, PasswordHasher } from '../services';
import { CredentialsSignInRequestBody } from './specs/user-controller.specs';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { uploadImage } from './specs/files-manager.specs';
import { user_postgres_errors } from '../error-handling/users.error-handling';
import { EmailService } from '../services/email.service';

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(UserRoleRepository) public userRoleRepository: UserRoleRepository,
    @repository(RoleRepository) public roleRepository: RoleRepository,
    @repository(PrefsUtilRepository) public prefsUserRepository: PrefsUtilRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER) public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE) public userService: CustomUserService,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @inject(SecurityBindings.USER, { optional: true }) public user: UserProfile,
    @inject(EmailServiceBindings.EMAIL_SERVICE) public emailService: EmailService,
    @repository(AppUsersSessionRepository) public appUsersSessionRepository: AppUsersSessionRepository,
  ) {}

  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @post("/users", {
    responses: {
      "200": {
        description: "User",
        content: {
          "application/json": {
            schema: getModelSchemaRef(User, {
              exclude: ["id", "roles", "blocked", "active"],
            }),
          },
        },
      },
    },
  })
  @authenticate("jwt")
  @authorize({
    allowedRoles: ["ADMIN"],
    voters: [basicAuthorization],
  })
  @intercept(log)
  async create(
    @requestBody(CredentialsSignInRequestBody) newUserRequest: User
  ): Promise<User | Response> {
    if (!newUserRequest.person_name || !newUserRequest.email || !newUserRequest.password) {
      return this.response
        .status(400)
        .send({ message: "Missing required fields: person_name, email, or password" });
    }

    newUserRequest.username = newUserRequest.username?.toLowerCase();
    newUserRequest.email = newUserRequest.email.toLowerCase();
    newUserRequest.password = await this.passwordHasher.hashPassword(newUserRequest.password);
    newUserRequest.validation_date = new Date().toISOString();

    const roles: string[] = (newUserRequest.roles || []).map(role => typeof role === 'string' ? role : role.id);

    if (newUserRequest.company_id && typeof newUserRequest.company_id !== 'number') {
      return this.response.status(400).send({ message: "Invalid company_id. It must be a number." });
    }

    try {
      if (newUserRequest.photo && typeof newUserRequest.photo !== "string") {
        const path = "./public/files/users/";

        return await uploadImage(
          newUserRequest.photo.data,
          path,
          newUserRequest.photo.name
        ).then(async (value) => {
          newUserRequest.photo = value.slice(9);
          const savedUser = await this.userRepository
            .create(_.omit(newUserRequest, ["roles", "blocked", "active"]))
            .then(async (user) => {
              const prefsUtil = {
                id_utilizador: user.id,
                lang_fav: undefined,
                tema_fav: undefined,
              } as PrefsUtil;

              await this.prefsUserRepository.create(prefsUtil);

              if (roles.length > 0) {
                for (const value of roles) {
                  await this.userRoleRepository.create({
                    role_id: value,
                    app_users_id: user.id,
                  });
                }
              }
              return user;
            });
          return savedUser;
        });
      }

      const savedUser = await this.userRepository
        .create(_.omit(newUserRequest, ["roles", "blocked", "active"]))
        .then(async (user) => {
          const prefsUtil = {
            id_utilizador: user.id,
            lang_fav: undefined,
            tema_fav: undefined,
          } as PrefsUtil;

          await this.prefsUserRepository.create(prefsUtil);

          if (roles.length > 0) {
            for (const value of roles) {
              await this.userRoleRepository.create({
                role_id: value,
                app_users_id: user.id,
              });
            }
          }

          return user;
        });

      return savedUser;
    } catch (err) {
      if (err.code && err.code === "23505") {
        let errorCode = err.detail as string;
        errorCode = errorCode.split(" ")[1];
        errorCode = errorCode.substring(1, errorCode.indexOf(")"));

        return this.response
          .status(422)
          .send({
            message:
              user_postgres_errors["pt"][
                errorCode as keyof (typeof user_postgres_errors)["pt"]
              ] || `Duplicate value for field: ${errorCode}`,
          });
      }

      return this.response
        .status(500)
        .send({ message: "Erro inesperado ao criar utilizador" });
    }
  }
  
  @get("/users")
  @response(200, {
    description: "Array of User model instances",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: getModelSchemaRef(User, { includeRelations: true }),
        },
      },
    },
  })
  @authenticate("jwt")
  @authorize({
    allowedRoles: ["ADMIN"],
    voters: [basicAuthorization],
  })
  async find(
    @param.filter(User) filter?: Filter<User>
  ): Promise<User[]> {
    const user = this.user;

    if (!filter) {
      filter = {};
    }

    if (filter?.where && filter?.where.hasOwnProperty("person_name")) {
      filter.where = {
        ...filter.where,
        person_name: {
          //@ts-ignore
          ilike: `%${filter?.where.person_name}%`,
        },
      };
    }

    if (filter?.where && filter?.where.hasOwnProperty("role")) {
      const whereWithRole = filter.where as { role?: string } & Where<User>;
      const roleId = whereWithRole.role;
      delete whereWithRole.role;

      const userRoles = await this.userRoleRepository.find({
        where: { role_id: roleId },
      });

      const userIds = userRoles.map((ur) => ur.app_users_id);
      filter.where = {
        ...filter.where,
        id: { inq: userIds },
      };
    }

    filter.where = {
      id: {
        neq: user[securityId],
      },
      deleted: false,
      ...filter.where,
    };

    if (
      filter.order &&
      (filter.order.includes("id DESC") || filter.order.includes("id ASC"))
    ) {
      filter.order.splice(filter.order.indexOf("id DESC"), 1);
      filter.order.splice(filter.order.indexOf("id ASC"), 1);
    }

    filter.order?.push("person_name ASC");

    return this.userRepository.find(filter).then(async (users) => {
      this.response.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
      this.response.setHeader(
        "x-total-count",
        (await this.count(filter?.where)).count
      );

      users.forEach((user) => {
        if (user.photo) {
          user.photo = `${user.photo}_xs.webp`;
        }
      });

      return users;
    });
  }

  /*
  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  } */

  @get("/users/{id}")
  @response(200, {
    description: "User model instance",
    content: {
      "application/json": {
        schema: getModelSchemaRef(User, { includeRelations: true }),
      },
    },
  })
  @authenticate("jwt")
  /*@authorize({
    allowedRoles: ['ADMIN', 'OCORRENCIAS_ENT_supervisor'],
    voters: [basicAuthorization],
  })*/
  async findById(
    @param.path.string("id") id: string,
    @param.filter(User, { exclude: "where" })
    filter?: FilterExcludingWhere<User>
  ): Promise<User | Response> {
    try {
      //detalhes do utilizador que está a tentar aceder
      const accessUser = await this.userRepository.findById(id, filter);

      if (accessUser.photo) {
        accessUser.photo = `${accessUser.photo}.webp`;
      }

      return accessUser;
    } catch (err) {
      return this.response.status(422).send({ message: "Utilizador inválido" });
    }
  }

  @patch("/users/{id}")
  @response(204, {
    description: "User PATCH success",
  })
  @authenticate("jwt")
  /*@authorize({
    allowedRoles: ['ADMIN', 'OCORRENCIAS_ENT_supervisor'],
    voters: [basicAuthorization],
  })*/
  async updateById(
    @param.path.string("id") id: string,
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: User
  ): Promise<User | void | Response> {
    let omitArray = ["roles", "password", "token", "prefs_util", "photo"];

    //detalhes do utilizador que está a tentar aceder
    const accessUser = await this.userRepository.findById(id);

    //verifica se é o proprio
    if (!this.user.roles.includes("ADMIN") && this.user[securityId] !== id) {
      return this.response
        .status(422)
        .send({ message: "Acess não autorizado" });
    }

    if (user.email && user.email !== accessUser.email)
      user.email = user.email.toLowerCase();

    if (user.username && user.email !== accessUser.username)
      user.username = user.username.toLowerCase();

    if (user.active && accessUser.active !== user.active) {
      user.validation_date = new Date().toISOString();
    }

    if (
      !this.user.roles.includes("ADMIN") ||
      (this.user.roles.includes("ADMIN") && this.user[securityId] === id)
    ) {
      omitArray.push("username", "active", "blocked");
    }

    try {
      await this.userRepository
        .updateById(id, _.omit(user, omitArray))
        .then(async () => {
          if (this.user.roles.includes("ADMIN")) {
            if (this.user[securityId] !== id)
              this.userService.updateRoles(user);

            if (user.password && user.password.replace(/\s+/g, "").length > 0) {
              user.password = await this.passwordHasher.hashPassword(
                user.password
              );
              await this.userRepository.updateById(id, {
                password: user.password,
              });
            }
          } else if (this.user[securityId] === id) {
            if (user.password && user.password.replace(/\s+/g, "").length > 0) {
              user.password = await this.passwordHasher.hashPassword(
                user.password
              );
              await this.userRepository.updateById(id, {
                password: user.password,
              });
            }
          }

          if (
            user.photo &&
            typeof user.photo !== "string" &&
            user.photo.src &&
            user.photo.src.search("files/users/") === -1
          ) {
            const path = "./public/files/users/";

            await uploadImage(user.photo.data, path, user.photo.name).then(
              async (value) => {
                //.slice para retirar ./public/ do caminho
                user.photo = value.slice(9);

                await this.userRepository.updateById(id, { photo: user.photo });
              }
            );
          } else if (
            accessUser.photo &&
            user.photo !== undefined &&
            accessUser.photo !== user.photo
          ) {
            await this.userRepository.updateById(id, { photo: null });
          }

          if (user.prefs_util) {
            await this.prefsUserRepository
              .updateById(id, user.prefs_util)
              .catch((err) => {
                console.log("ERROR:", err);
              });
          }
        });

      return this.userRepository.findById(id);
    } catch (err) {
      //postgres error code 23505 - duplicate value
      if (err.code && err.code === "23505") {
        //detail: 'Key (username)=(pedro@gmail.com) already exists.',
        let errorCode = err.detail as string;
        //['Key', '(username)=(pedro@gmail.com)', 'already', 'exists.']
        errorCode = errorCode.split(" ")[1];
        //username
        errorCode = errorCode.substring(1, errorCode.indexOf(")"));

        return this.response
          .status(422)
          .send({
            message:
              user_postgres_errors.pt[
                errorCode as keyof (typeof user_postgres_errors)["pt"]
              ],
          });
      }

      return this.response.status(422).send({ message: "Utilizador inválido" });
    }
  }

  /*
  @put('/users/{id}')
  @response(204, {
    description: 'PUT User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true, partial: true}),
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody({}) user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, _.omit(user, ['roles']));
  } */

  @del("/users/{id}")
  @authenticate("jwt")
  @authorize({
    allowedRoles: ["ADMIN"],
    voters: [basicAuthorization],
  })
  @response(204, {
    description: "User DELETE success",
  })
  async deleteById(
    @param.path.string("id") id: string
  ): Promise<void | Response> {
    if (this.user[securityId] === id) {
      return this.response
        .status(422)
        .send({ message: "Erro a eliminar utilizador" });
    } else if (!this.user.roles.includes("ADMIN")) {
      return this.response
        .status(422)
        .send({ message: "Erro a eliminar utilizador" });
    } else {
      await this.userRepository.deleteById(id);
      await this.prefsUserRepository.deleteById(id);
      await this.appUsersSessionRepository.deleteAll({ app_users_id: id });
      await this.userRoleRepository.deleteAll({ app_users_id: id });
    }
  }

  @get("/validateUsers")
  @response(200, {
    description: "Array of User model instances",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: getModelSchemaRef(User, { includeRelations: true }),
        },
      },
    },
  })
  @authenticate("jwt")
  @authorize({
    allowedRoles: ["ADMIN"],
    voters: [basicAuthorization],
  })
  async findValidate(
    @param.filter(User) filter?: Filter<User>
  ): Promise<User[]> {
    const user = this.user;

    if (!filter) {
      filter = {};
    }

    if (filter?.where && filter?.where.hasOwnProperty("person_name")) {
      filter.where = {
        ...filter.where,
        person_name: {
          //@ts-ignore
          ilike: `${filter?.where.person_name}%`,
        },
      };
    }

    filter.where = {
      id: {
        neq: user[securityId],
      },
      deleted: false,
      active: false,
      validation_date: { neq: null },
      ...filter.where,
    };

    return this.userRepository.find(filter).then(async (users) => {
      this.response.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
      this.response.setHeader(
        "x-total-count",
        (await this.count(filter?.where)).count
      );
      return users;
    });
  }

  @get("/validateUsers/{id}")
  @response(200, {
    description: "User model instance",
    content: {
      "application/json": {
        schema: getModelSchemaRef(User, { includeRelations: true }),
      },
    },
  })
  @authenticate("jwt")
  @authorize({
    allowedRoles: ["ADMIN"],
    voters: [basicAuthorization],
  })
  async findValidateById(
    @param.path.string("id") id: string,
    @param.filter(User, { exclude: "where" })
    filter?: FilterExcludingWhere<User>
  ): Promise<User | Response> {
    try {
      //detalhes do utilizador que está a tentar aceder
      const accessUser = await this.userRepository.findById(id, filter);

      return accessUser;
    } catch (err) {
      return this.response.status(422).send({ message: "Utilizador inválido" });
    }
  }

  @get("/validateUsers/{id}/validate")
  @response(200, {
    description: "Array of User model instances",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: getModelSchemaRef(User, { includeRelations: true }),
        },
      },
    },
  })
  @authenticate("jwt")
  @authorize({
    allowedRoles: ["ADMIN"],
    voters: [basicAuthorization],
  })
  async validate(@param.path.string("id") id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    await this.userRepository.updateById(id, { active: true });
    this.emailService.sendMailRegisterActive(
      "pt-pt",
      user.email,
      user.person_name
    );

    return;
  }
}
