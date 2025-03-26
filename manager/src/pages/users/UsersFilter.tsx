import { TextInput, SelectInput } from "react-admin";
import { useEffect, useState } from "react";

export const userFilters = (permissions: string[]) => {
    const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        fetch("http://127.0.0.1:13090/roles", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data: { id: string; description: string }[]) => {
                const rolesData = data.map((role) => ({
                    id: role.id,
                    name: role.description,
                }));
                setRoles(rolesData);
            })
            .catch((error: unknown) => {
                console.error("Error fetching roles:", error);
            });
    }, []);

    let filters = [
        <TextInput source="person_name" size="small" label={'pos.labels.search'} fullWidth alwaysOn resettable={true} />,
    ];

    switch (true) {
        case permissions.includes('ADMIN'):
            filters.push(
                <SelectInput
                    source="role"
                    choices={roles.map(role => ({ id: role.id, name: role.name }))}
                    label="Role"
                    fullWidth
                />
            );
            break;
        default:
            break;
    }

    return filters;
};