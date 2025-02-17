import { Box } from "@mui/material";
import { List, Datagrid, TextField, TextInput, useTranslate } from "react-admin";
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";

export const ValidateList = () => {

  const translate = useTranslate();

  return (
    <List title="resources.utilizadores.validate" pagination={<CustomPagination />} perPage={perPageDefault} exporter={false} empty={<CustomEmptyPage />} sx={{ paddingLeft: '10px' }}>
      <Datagrid rowClick="edit" bulkActionButtons={false}>
        <TextField source="person_name" />
        <TextField source="nif" />
        <TextField source="email" />
      </Datagrid>
    </List>
  );
};
