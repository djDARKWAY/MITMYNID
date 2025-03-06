import { CertificatesList } from "./CertificatesList";
import { CertificatesShow } from "./CertificatesShow";
import { CertificatesEdit } from "./CertificatesEdit";

export const certificates = (permissions?: string[]) => {
    let certificates = null;

    if (!permissions) return certificates;

    switch (true) {
        case permissions.includes("ADMIN"): {
            certificates = {
                list: CertificatesList,
                show: CertificatesShow,
                edit: CertificatesEdit,
            };
            break;
        }
    }

    return certificates;
};