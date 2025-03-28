import { List, DatagridConfigurable , TextField, FunctionField, SimpleList, usePermissions } from "react-admin";
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { LogsFilters } from "./LogsFilter";

export const LogsList = () => {
    const { permissions } = usePermissions();
    const isSmall = useMediaQuery(useTheme().breakpoints.down('lg'));

    const getBackgroundColor = (logType: string) => {
        switch (logType) {
            case "INFO": return "#90A4AE";
            case "ERROR": return "#F44336";
            case "WARNING": return "#FFA500";
            case "DEBUG": return "#505050";
            case "SECURITY": return "#2196F3";
            case "AUDIT": return "#4CAF50";
            default: return "#000000";
        }
    };
    
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
            sort={{ field: 'timestamp', order: 'DESC' }}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.type?.type || "Desconhecido"}
                    secondaryText={record => record.message}
                    tertiaryText={record => new Date(record.timestamp).toLocaleString()}
                    linkType={"edit"}
                />
            ) : (
                <DatagridConfigurable rowClick={false} bulkActionButtons={false} >
                    <FunctionField
                        label="resources.logs.fields.category" 
                        render={record => {
                            const logType = record.type?.type || "Desconhecido"; 

                            return (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '23px', borderRadius: '8px', backgroundColor: getBackgroundColor(logType), color: '#fff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase' }}>{logType}</div>
                            );
                        }}
                    />
                    <FunctionField 
                        label="resources.logs.fields.timestamp"  
                        render={record => (
                            <div>
                                {new Date(record.timestamp).toLocaleString('pt-PT', { 
                                    day: '2-digit', month: '2-digit', year: 'numeric', 
                                    hour: '2-digit', minute: '2-digit', second: '2-digit', 
                                    fractionalSecondDigits: 3 
                                })}
                            </div>
                        )}
                    />
                    <TextField source="message" label="resources.logs.fields.message" />
                </DatagridConfigurable >
            )}
        </List>
    );
};
