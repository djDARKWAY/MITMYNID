import { TextInput, SelectInput, DateInput } from "react-admin";
import { useEffect, useState } from "react";
import { fetchUtils } from "ra-core";

export const LogsFilters = (permissions: string[]) => {
    const [logTypes, setLogTypes] = useState<{ id: number; type: string }[]>([]);

    useEffect(() => {
        const fetchLogTypes = async () => {
            try {
                const { json } = await fetchUtils.fetchJson("http://127.0.0.1:13090/logs/types");    
                if (Array.isArray(json)) {
                    setLogTypes(json.map((type, index) => ({
                        id: index + 1,
                        type: type
                    })));
                } else {
                    setLogTypes([]);
                }
            } catch (error) {
                console.error("Erro ao buscar os log types:", error);
                setLogTypes([]);
            }
        };
    
        fetchLogTypes();
    }, []);
    

    const filters = [
        <SelectInput key="type_id" source="type_id" label="pos.logs.type" choices={logTypes.map(logType => ({ id: logType.id, name: logType.type }))} fullWidth alwaysOn resettable />,
        <DateInput key="timestamp" source="timestamp" label="pos.logs.timestamp" fullWidth/>,
    ];

    return filters;
};
