import { Entity, model, property } from "@loopback/repository";

@model({
  settings: {
    postgresql: {
      table: "app_users_role",
    },
    description: "Atribuição de perfis das aplicações aos utilizadores.",
  },
})
export class UserRole extends Entity {
  @property({
    type: "string",
    id: true,
    generated: false,
    defaultFn: "uuidv4",
    postgresql: {
      columnName: "id",
      dataType: "UUID",
      nullable: "NO",
    },
  })
  id: string;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "app_users_id",
      dataType: "UUID",
      nullable: "NO",
    },
  })
  app_users_id: string;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "role_id",
      dataType: "UUID",
      nullable: "NO",
    },
  })
  role_id: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserRole>) {
    super(data);
  }
}

export interface UserRoleRelations {
  // describe navigational properties here
}

export type UserRoleWithRelations = UserRole & UserRoleRelations;
