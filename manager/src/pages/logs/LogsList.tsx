import { List, Datagrid, TextField, FunctionField, SimpleList, usePermissions, DateField } from "react-admin";
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { LogsFilters } from "./LogsFilter";

export const LogsList = () => {
    const { permissions } = usePermissions();
    const isSmall = useMediaQuery(useTheme().breakpoints.down('lg'));

    return (
        <List
            resource="logs"
            filters={LogsFilters(permissions)}
            queryOptions={{ refetchOnWindowFocus: false }}
            pagination={<CustomPagination />}
            perPage={perPageDefault}
            empty={<CustomEmptyPage />}
            exporter={false}
            title="resources.logs.name"
            sx={{ paddingLeft: '10px' }}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.type}
                    secondaryText={record => record.message}
                    tertiaryText={record => new Date(record.timestamp).toLocaleString()}
                    linkType={"edit"}
                />
            ) : (
                <Datagrid rowClick="show" bulkActionButtons={false}> 
                    <FunctionField label="resources.logs.fields.type" render={record => record?.type?.type} />
                    <DateField source="timestamp" label="resources.logs.fields.timestamp" />
                    <TextField source="message" label="resources.logs.fields.message" />
                </Datagrid>
            )}
        </List>
    );
};
