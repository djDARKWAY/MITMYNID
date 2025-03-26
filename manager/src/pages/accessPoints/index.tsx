import { AccessPointsList } from "./AccessPointsList";
import { AccessPointsShow } from "./AccessPointsShow";
import { AccessPointsEdit } from "./AccessPointsEdit";


export const accessPoints = (permissions?: string[]) => {
    let accessPoints = null;

    if (!permissions) return accessPoints;

    switch (true) {
        case permissions.includes("ADMIN"): {
            accessPoints = {
                list: AccessPointsList,
                show: AccessPointsShow,
                edit: AccessPointsEdit,
            };
            break;
        }
    }

    return accessPoints;
};