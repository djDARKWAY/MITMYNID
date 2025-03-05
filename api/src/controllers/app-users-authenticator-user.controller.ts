import { repository } from "@loopback/repository";
import { param, get, getModelSchemaRef } from "@loopback/rest";
import { AppUsersAuthenticator, User } from "../models";
import { AppUsersAuthenticatorRepository } from "../repositories";

export class AppUsersAuthenticatorUserController {
  constructor(
    @repository(AppUsersAuthenticatorRepository)
    public appUsersAuthenticatorRepository: AppUsersAuthenticatorRepository
  ) {}

  @get("/app-users-authenticators/{id}/user", {
    responses: {
      "200": {
        description: "User belonging to AppUsersAuthenticator",
        content: {
          "application/json": {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string("id") id: typeof AppUsersAuthenticator.prototype.id
  ): Promise<User> {
    return this.appUsersAuthenticatorRepository.user(id);
  }
}
