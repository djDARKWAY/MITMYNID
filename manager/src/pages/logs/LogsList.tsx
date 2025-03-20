import { List, Datagrid, TextField, FunctionField, SimpleList, usePermissions, DateField } from "react-admin";
import * as Icon from '@mui/icons-material'; // Import all Material-UI icons
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
                <Datagrid rowClick="show" bulkActionButtons={false} >
                    <FunctionField
                        // label="resources.logs.fields.category"
                        render={record => {
                            const logType = record.type;
                            const IconComponent = logType?.icon && Icon[logType.icon as keyof typeof Icon] ? Icon[logType.icon as keyof typeof Icon] : null;
                            
                            return (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {IconComponent && <IconComponent style={{ marginRight: '8px' }} />}
                                </div>
                            );
                        }}
                    />
                    <FunctionField label="resources.logs.fields.timestamp" render={record => {
                        return new Date(record.timestamp).toLocaleString('pt-PT', { 
                            day: '2-digit', month: '2-digit', year: 'numeric', 
                            hour: '2-digit', minute: '2-digit', second: '2-digit', 
                            fractionalSecondDigits: 3 
                        });
                    }} />
                    <TextField source="message" label="resources.logs.fields.message" />
                </Datagrid>
            )}
        </List>
    );
};
