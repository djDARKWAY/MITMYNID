import { UsersCreate } from "./UsersCreate";
import { UsersEdit } from "./UsersEdit";
import { UsersList } from "./UsersList";
import { UsersShow } from "./UsersShow";

export const users = (permissions?: string[]) => {
  //console.log(permissions)

  let users = null;

  if (!permissions) return users;

  switch (true) {
    case permissions.includes("ADMIN"): {
      users = {
        list: UsersList,
        create: UsersCreate,
        edit: UsersEdit,
        show: UsersShow,
      };
      break;
    }
    default: {
      users = {
        edit: UsersEdit,
      };
      break;
    }
  }

  return users;
};
