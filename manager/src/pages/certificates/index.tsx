import { CertificatesList } from "./CertificatesList";

export const certificates = (permissions?: string[]) => {
    let certificates = null;

    if (!permissions) return certificates;

    switch (true) {
        case permissions.includes("ADMIN"): {
            certificates = {
                list: CertificatesList,
            };
            break;
        }
    }

    return certificates;
};