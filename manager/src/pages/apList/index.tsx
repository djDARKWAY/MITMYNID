// import { RoleCreate } from "./RoleCreate";
// import { RoleEdit } from "./RoleEdit";
import { RoleList } from "../roles/RoleList";

export const roles = (permissions?: string[]) => {
    
    if(!permissions) return null;

    let roles = { 
        list: RoleList,
        // create: RoleCreate,
        // edit: RoleEdit 
    }

    return permissions.includes('ADMIN') ? roles : null
}