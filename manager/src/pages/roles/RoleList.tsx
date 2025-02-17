import { Box } from "@mui/material";
import {List, Datagrid, TextField, TextInput, useTranslate } from "react-admin";
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";

export const RoleList = () => {
    
    const translate = useTranslate();

    const filters = [
        <TextInput source="description" label={translate('pos.labels.search')} alwaysOn resettable={true}/>,
    ];

    return(
    <List pagination={<CustomPagination/>} perPage={perPageDefault} exporter={false} empty={<CustomEmptyPage/>} filters={filters}  title="resources.role.name" sx={{paddingLeft: '10px'}}>
        <Datagrid bulkActionButtons={false}>
            <TextField source="description" label="resources.role.fields.nome"/>
            <Box sx={{gap: '4px', float: 'right'}}>
            </Box>
        </Datagrid>
    </List>
    );
};