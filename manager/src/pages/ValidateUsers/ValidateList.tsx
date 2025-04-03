import { List, Datagrid, TextField, useTranslate, EditButton, DeleteButton } from "react-admin";
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";

export const ValidateList = () => {
  const translate = useTranslate();

  return (
    <List 
      title="resources.utilizadores.validate" 
      pagination={<CustomPagination />} 
      perPage={perPageDefault} 
      exporter={false} 
      empty={<CustomEmptyPage />} 
      filter={{ active: false }}
      sx={{ paddingLeft: '10px' }}
    >
      <Datagrid rowClick={false} bulkActionButtons={false}>
        <TextField source="person_name" label="resources.utilizadores.fields.nome" />
        <TextField source="username" label="resources.utilizadores.fields.username" />
        <TextField source="email" label="Email" />
        <TextField source="nif" label="NIF" />
        <EditButton/>
        <DeleteButton 
          mutationMode="pessimistic"
          confirmTitle={translate('resources.utilizadores.confirm.title')}
          confirmContent={translate('resources.utilizadores.confirm.content')} 
        />
      </Datagrid>
    </List>
  );
};