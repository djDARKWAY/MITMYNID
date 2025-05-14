import { Box } from "@mui/material";
import {
  usePermissions,
  Edit,
  TextInput,
  required,
  BooleanInput,
  FunctionField,
  ImageField,
  ImageInput,
  Loading,
  useGetIdentity,
  PasswordInput,
  TabbedForm,
  ReferenceManyField,
  Datagrid,
  Pagination,
  DateField,
  useNotify
} from "react-admin";
import RolesInput from "./RolesInput";
import validateUsersEditForm from "./validators/UsersEditValidation";
import { Users } from "../../utils/types";
import ToolbarEditForm from "../../components/general/ToolbarEditForm";
import { customDropZone } from "../../components/general/customCSS";
import PlaceholderDropZone from "../../components/general/PlaceholderDropZone";
import { url } from "../../App";

function formatLogo(value: any) {
  if (typeof value === "string") { // Value is null or the url string from the backend, wrap it in an object so the form input can handle it
    return { src: url + value };
  } else {  // Else a new image is selected which results in a value object already having a preview link under the url key
    return value;
  }
}

export const UsersEdit = () => {

  const { permissions, isLoading } = usePermissions();
  const { identity } = useGetIdentity();
  const notify = useNotify();

  const transform = (data: Users) => {

    if (data.password && data.password.trim().length === 0) {
      delete data.password
    }

    if (data.roles_ids) {
      data.roles = data.roles_ids;
      delete data.roles_ids;
    }

    if (data.tempRoles) delete data.tempRoles;

    // Se a foto vier como string (valor atual) mantenha o campo omitindo alteração
    if (data.photo && typeof data.photo === "string") {
      // O campo 'photo' será o mesmo que o backend já possui, então remova-o para não sobrescrever
      delete data.photo;
    }
    
    return data
  };

  return !isLoading ? (
    <Edit
      mutationMode="optimistic"
      queryOptions={{
        meta: {
          include: [
            {
              relation: "roles",
            }
          ]
        }
      }}
      title="resources.utilizadores.edit_title"
      transform={transform}
    >
      <TabbedForm validate={validateUsersEditForm} toolbar={<ToolbarEditForm hasDelete={permissions && permissions.includes('ADMIN')} />}>
        <TabbedForm.Tab label={"ra.page.profile"}>
          <Box width={'100%'} display={{ s: 'block', md: 'flex' }} sx={{ flexWrap: { xs: 'nowrap', md: 'wrap' } }}>
            <Box display={{ s: 'block', md: 'flex' }} sx={{ flexWrap: { xs: 'nowrap', md: 'wrap' }, width: '100%' }} >
              <Box flex={1} mr={{ s: 0, md: '0.5em' }}>
                <TextInput fullWidth source="person_name" inputProps={{ minLength: 3 }} label="resources.utilizadores.fields.nome" validate={required()} />
              </Box>
              <Box flex={1} ml={{ s: 0, md: '0.5em' }}>
                <TextInput source="email" label="Email" validate={required()} fullWidth />
              </Box>
            </Box>
            <Box display={{ s: 'block', md: 'flex' }} sx={{ flexWrap: { xs: 'nowrap', md: 'wrap' }, width: '100%' }} >
              <Box flex={1} mr={{ s: 0, md: '0.5em' }}>
                <TextInput source="username" label="resources.utilizadores.fields.username" fullWidth validate={required()} />
              </Box>
              {permissions.includes('ADMIN') && <Box flex={1} ml={{ s: 0, md: '0.5em' }}>
                <PasswordInput size="medium" fullWidth source="password" inputProps={{ minLength: 6 }} label="resources.utilizadores.fields.password" />
              </Box>}
            </Box>
            <Box display={{ xs: 'block', md: 'flex' }} sx={{ flexWrap: { xs: 'nowrap', md: 'wrap' }, width: '100%' }}>
              <Box flex={1} mr={{ xs: 0, md: '0.5em' }}>
                <TextInput source="address" label="resources.utilizadores.fields.morada" fullWidth />
              </Box>
              <Box flex={1} ml={{ xs: 0, md: '0.5em' }}>
                <TextInput source="post_code" label="resources.utilizadores.fields.cod_postal" fullWidth />
              </Box>
            </Box>
            <Box display={{ xs: 'block', md: 'flex' }} justifyContent={{ md: 'space-evenly' }} sx={{ flexWrap: { xs: 'nowrap', md: 'wrap' }, width: '100%' }} >
              <Box flex={1} mr={{ xs: '0px', md: '1em' }}>
                <TextInput fullWidth source="nif" label="resources.utilizadores.fields.nif" />
              </Box>
              <Box flex={1} >
                <TextInput fullWidth source="nic" label="resources.utilizadores.fields.nic" />
              </Box>
              <Box flex={1} ml={{ xs: '0px', md: '1em' }}>
                <TextInput fullWidth source="cc_num" label="resources.utilizadores.fields.cc" />
              </Box>
            </Box>
            <Box display={{ xs: 'block', md: 'flex' }} sx={{ flexWrap: { xs: 'nowrap', md: 'wrap' }, width: '100%' }}>
              <Box flex={1} mr={{ xs: 0, md: '0.5em' }}>
                <TextInput fullWidth source="phone" label="resources.utilizadores.fields.telefone" />
              </Box>
              <Box flex={1} ml={{ xs: 0, md: '0.5em' }}>
                <TextInput fullWidth source="mobile" label="resources.utilizadores.fields.telemovel" />
              </Box>
            </Box>

            <FunctionField label={false} fullWidth sx={{ width: '100%' }} render={(record: any) => identity && record.id !== identity.id && permissions.includes('ADMIN')
              ?
              <Box
                // display={{xs: 'block', md: 'flex'}}
                sx={{
                  flexWrap: { xs: 'wrap', md: 'nowrap' },
                  flexDirection: 'row',
                  display: { xs: 'block', md: 'flex' },
                  gap: '1em',
                  alignItems: 'center'
                }}>
                <RolesInput />
              </Box>
              :
              null
            } />
            <FunctionField label={false} render={(record: any) => identity && record.id !== identity.id && permissions.includes('ADMIN')
              ?
              <BooleanInput sx={{ width: 'max-content' }} label="resources.utilizadores.fields.ativo" source="active" />
              :
              null
            } />
            <ImageInput
              maxSize={5000000}
              fullWidth
              options={{
                onDropRejected: () => notify('ra.message.ondroprejected', { type: 'error' })
              }}
              format={formatLogo}
              placeholder={<PlaceholderDropZone />}
              accept={{ "image/*": [] }}
              source={"photo"}
              label="resources.utilizadores.fields.foto"
              sx={customDropZone}>
              <ImageField source="src" />
            </ImageInput>
          </Box>
        </TabbedForm.Tab>
        {permissions.includes('ADMIN') && <TabbedForm.Tab label={'resources.app-users-sessions.name'}>
          <Box sx={{ width: '100%' }}>
            <ReferenceManyField
              reference="app-users-sessions"
              target="app_users_id"
              source="id"
              sort={{ field: 'login', order: 'DESC' }}
              perPage={10}
              pagination={<Pagination />}
            >
              <Datagrid bulkActionButtons={false}>
                <DateField source="login" showTime />
                <DateField source="logout" showTime />
              </Datagrid>
            </ReferenceManyField>
          </Box>
        </TabbedForm.Tab>}
      </TabbedForm>
    </Edit>
  ) : <Loading />;
};
