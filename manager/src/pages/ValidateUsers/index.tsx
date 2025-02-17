import { ValidateEdit } from "./ValidateEdit";
import { ValidateList } from "./ValidateList";

export const validateUsers = (permissions?: string[]) => {

    if(!permissions) return null;

    let validate = {
        list: ValidateList,
        edit: ValidateEdit,
    }

    return permissions.includes('ADMIN') ? validate : null
}
