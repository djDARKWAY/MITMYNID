import { useEffect, useState } from "react";
import { TextInput, SelectInput } from "react-admin";
import { fetchUtils } from "react-admin";

const FLAG_BASE_URL = import.meta.env.VITE_FLAG_BASE_URL;

export const WarehousesFilters = (permissions: string[]) => {
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
        <TextInput key="name" source="name" size="small" label="pos.warehouses.name" fullWidth alwaysOn resettable />,
        <TextInput key="district" source="district" size="small" label="pos.warehouses.district" fullWidth resettable />,
        <TextInput key="city" source="city" size="small" label="pos.warehouses.city" fullWidth alwaysOn resettable />,
        <TextInput key="zip_code" source="zip_code" size="small" label="pos.warehouses.zip_code" fullWidth alwaysOn resettable />,
        <SelectInput key="country" source="country" label="pos.warehouses.country" choices={countries} optionText={(choice) => (
                <span>
                    <img
                        src={`${FLAG_BASE_URL}${choice.flag_url || "xx.svg"}`}
                        alt={choice.name}
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => (e.currentTarget.src = `${FLAG_BASE_URL}xx.svg`)}
                        style={{ width: "20px", marginRight: "10px", verticalAlign: "middle" }}
                    />
                    {choice.name}
                </span> )}
            optionValue="id" fullWidth alwaysOn resettable
        />
    ];

    return filters;
};