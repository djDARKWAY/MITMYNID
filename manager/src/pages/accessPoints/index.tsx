import { AccessPointsList } from "./AccessPointsList";

export const accessPoints = (permissions?: string[]) => {
    let accessPoints = null;

    if (!permissions) return accessPoints;

    switch (true) {
        case permissions.includes("ADMIN"): {
            accessPoints = {
                list: AccessPointsList,
            };
            break;
        }
    }

    return accessPoints;
};