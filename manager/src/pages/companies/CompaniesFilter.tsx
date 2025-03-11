import { useEffect, useState } from "react";
import { TextInput, SelectInput } from "react-admin";
import { fetchUtils } from "react-admin";

export const CompaniesFilters = (permissions: string[]) => {
    const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const fetchIssuers = async () => {
            try {
                const { json } = await fetchUtils.fetchJson("http://127.0.0.1:13090/countries");
                const sortedCountries = json.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
                setCountries(sortedCountries);
            } catch (error) {
                setCountries([]);
            }
        };

        fetchIssuers();
    }, []);

    const filters = [
        <TextInput key="name" source="name" size="small" label="pos.companies.name" fullWidth alwaysOn resettable />,
        <SelectInput key="country" source="country" label="pos.companies.country" choices={countries} optionText="name" optionValue="id" fullWidth resettable />
    ];

    return filters;
};
