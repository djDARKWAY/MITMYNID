import { TextInput } from "react-admin";

export const CertificatesFilters = (permissions: string[]) => {
    let filters = [
        <TextInput source="name" size="small" label={'pos.labels.search'} fullWidth alwaysOn resettable={true} />,
    ];

    switch (true) {
        case permissions.includes('ADMIN'):
            filters.push(
                <TextInput source="admin_only_field" size="small" label={'pos.labels.admin'} fullWidth resettable={true} />
            );
            break;
        default:
            break;
    }

    return filters;
}