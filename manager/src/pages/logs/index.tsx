import { LogsList } from "./LogsList";
import { LogsShow } from "./LogsShow";

export const logs = (permissions?: string[]) => {
    let certificates = null;

    if (!permissions) return certificates;

    switch (true) {
        case permissions.includes("ADMIN"): {
            certificates = {
                list: LogsList,
                show: LogsShow,
            };
            break;
        }
    }

    return certificates;
};