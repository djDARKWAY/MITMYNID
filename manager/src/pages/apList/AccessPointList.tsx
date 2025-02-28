import { Box } from "@mui/material";
import { List, Datagrid, TextField, TextInput, useTranslate } from "react-admin";
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";

export const AccessPointList = () => {

    const translate = useTranslate();

    const filters = [
        <TextInput source="name" label={translate('pos.labels.search')} alwaysOn resettable />,
        <TextInput source="ip_address" label="IP Address" resettable />,
    ];

    return(
        <List pagination={<CustomPagination/>} perPage={perPageDefault} exporter={false} empty={<CustomEmptyPage/>} filters={filters} title="resources.accessPoint.name" sx={{paddingLeft: '10px'}}>
            <Datagrid bulkActionButtons={false}>
                <TextField source="id" label="ID" />
                <TextField source="name" label="Name" />
                <TextField source="ip_address" label="IP Address" />
                <TextField source="location" label="Location" />
                <Box sx={{gap: '4px', float: 'right'}}>
                </Box>
            </Datagrid>
        </List>
    );
};
