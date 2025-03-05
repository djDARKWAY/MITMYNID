import { AccessPointsList } from "./AccessPointsList";
import { AccessPointsShow } from "./AccessPointsShow";

export const accessPoints = (permissions?: string[]) => {
    let accessPoints = null;

    if (!permissions) return accessPoints;

    switch (true) {
        case permissions.includes("ADMIN"): {
            accessPoints = {
                list: AccessPointsList,
                show: AccessPointsShow,
            };
            break;
        }
    }

    return accessPoints;
};