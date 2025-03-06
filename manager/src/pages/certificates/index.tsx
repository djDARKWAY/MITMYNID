import { CertificatesList } from "./CertificatesList";
import { CertificatesShow } from "./CertificatesShow";

export const certificates = (permissions?: string[]) => {
    let certificates = null;

    if (!permissions) return certificates;

    switch (true) {
        case permissions.includes("ADMIN"): {
            certificates = {
                list: CertificatesList,
                show: CertificatesShow,
            };
            break;
        }
    }

    return certificates;
};