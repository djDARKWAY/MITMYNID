import { useEffect, useState } from 'react';
import { TextInput, SelectInput } from "react-admin";
import { fetchUtils } from 'react-admin';

export const CertificatesFilters = (permissions: string[]) => {
    const [issuers, setIssuers] = useState<string[]>([]);

    useEffect(() => {
        const fetchIssuers = async () => {
            try {
                const { json } = await fetchUtils.fetchJson('http://127.0.0.1:13090/certificates/issuers');
                setIssuers(json);
            } catch (error) {
                console.error("Erro ao buscar emissores:", error);
                setIssuers([]);
            }
        };

        fetchIssuers();
    }, []);

    const filters = [
        <TextInput key="name" source="name" size="small" label="pos.certificates.name" fullWidth alwaysOn resettable />,
        <SelectInput key="issuer" source="issuer_name" label="pos.certificates.issuer" choices={issuers.map(issuer => ({ id: issuer, name: issuer }))} fullWidth resettable />
    ];

    if (permissions.includes('ADMIN')) {
        filters.push(
            <TextInput
                key="admin_only_field"
                source="admin_only_field"
                size="small"
                label="pos.labels.admin"
                fullWidth
                resettable
            />
        );
    }

    return filters;
};
