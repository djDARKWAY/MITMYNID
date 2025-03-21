import { useEffect, useState } from "react";
import { TextInput, SelectInput } from "react-admin";
import { fetchUtils } from "react-admin";

const FLAG_BASE_URL = import.meta.env.REACT_APP_FLAG_BASE_URL || "http://127.0.0.1:13090/files/flags/";

export const CompaniesFilters = () => {
    const [countries, setCountries] = useState<{ id: string; name: string; flag_url: string }[]>([]);

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
        <SelectInput
            key="country"
            source="country"
            label="pos.companies.country"
            choices={countries}
            optionText={(choice) => (
                <span>
                    <img
                        src={`${FLAG_BASE_URL}${choice.flag_url || "xx.svg"}`}
                        alt={choice.name}
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => (e.currentTarget.src = `${FLAG_BASE_URL}xx.svg`)}
                        style={{ width: "20px", marginRight: "10px", verticalAlign: "middle" }}
                    />
                    {choice.name}
                </span>
            )}
            optionValue="id"
            fullWidth
            resettable
        />
    ];

    return filters;
};