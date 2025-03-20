import { LogsList } from "./LogsList";

export const logs = (permissions?: string[]) => {
    let certificates = null;

    if (!permissions) return certificates;

    switch (true) {
        case permissions.includes("ADMIN"): {
            certificates = {
                list: LogsList,
            };
            break;
        }
    }

    return certificates;
};