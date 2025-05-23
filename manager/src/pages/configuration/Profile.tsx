import { Box } from "@mui/material";
import {
  Edit,
  useGetIdentity,
  Loading,
  TextInput,
  required,
  ImageInput,
  ImageField,
  PasswordInput,
  useAuthenticated,
  SaveButton,
  Toolbar,
  useLocaleState,
  useNotify,
  useTheme,
  ReferenceManyField,
  Pagination,
  Datagrid,
  TabbedForm,
  DateField,
  SelectInput
} from "react-admin";
import { customDropZone } from "../../components/general/customCSS";
import PlaceholderDropZone from "../../components/general/PlaceholderDropZone";
import { url } from "../../App";
import { Users } from "../../utils/types";
import validateUsersProfileForm from "../users/validators/UsersProfileValidation";

const EditActions = () => (
  <Toolbar>
    <SaveButton alwaysEnable/>
  </Toolbar>
);

const themes = [
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' }
];

const langs = [
  { id: 'pt-pt', name: 'Português' },
  { id: 'en-us', name: 'English' },
  { id: 'fr', name: 'Français' },
  { id: 'es', name: 'Español' },
];

function formatLogo(value: any) {
  if (typeof value === "string") { // Value is null or the url string from the backend, wrap it in an object so the form input can handle it
    return { src: url + value };
  } else {  // Else a new image is selected which results in a value object already having a preview link under the url key
    return value;
  }
}

const Profile = () => {

  useAuthenticated();

  const notify = useNotify();
  const { data: identity, isLoading, refetch } = useGetIdentity();
  const [theme, setTheme] = useTheme();
  const [locale, setLocale] = useLocaleState();

  const onSettled = (data?: Users) => {

    if (!data) return;

    localStorage.setItem('profile', JSON.stringify({
      id: data.id,
      fullName: data.person_name,
      //@ts-ignore
      avatar: data.photo ? url + data.photo : '',
      theme: data.theme || 'light',
      language: data.language || 'pt',
    }));

    if (data.theme && data.theme !== theme) {
      setTheme(data.theme);
    }

    if (data.language && data.language !== locale) {
      setLocale(data.language);
    }

    if (identity) refetch();
  };

  return !isLoading && identity ? (
    <Edit
      id={identity.id as string}
      resource="users"
      queryOptions={{
        meta: {}
      }}
      mutationMode="pessimistic"
      mutationOptions={{ onSettled }}
      redirect={false}
      title="ra.page.profile"
    >
      <TabbedForm validate={validateUsersProfileForm} toolbar={<EditActions />} syncWithLocation={false}>
        <TabbedForm.Tab label={"ra.page.profile"}>
          <Box width={'100%'} display={{ s: 'block', md: 'flex' }} sx={{ flexWrap: { xs: 'none', md: 'wrap' } }}>
            <Box display={{ s: 'block', md: 'flex' }} sx={{ flexWrap: { xs: 'none', md: 'wrap' }, width: '100%' }} >
              <Box flex={1} mr={{ s: 0, md: '0.5em' }}>
                <TextInput fullWidth source="person_name" label="resources.utilizadores.fields.nome" validate={required()} />
              </Box>
              <Box flex={1} ml={{ s: 0, md: '0.5em' }}>
                <TextInput source="email" label="Email" validate={required()} fullWidth />
              </Box>
            </Box>
            <Box display={{ s: 'block', md: 'flex' }} sx={{ flexWrap: { xs: 'none', md: 'wrap' }, width: '100%' }} >
              <Box flex={1} mr={{ s: 0, md: '0.5em' }}>
                <TextInput source="username" InputProps={{ disabled: true }} label="resources.utilizadores.fields.username" fullWidth validate={required()} />
              </Box>
              <Box flex={1} ml={{ s: 0, md: '0.5em' }}>
                <PasswordInput size="medium" fullWidth source="password" label="resources.utilizadores.fields.password" />
              </Box>
            </Box>
            <TextInput source="address" label="resources.utilizadores.fields.morada" fullWidth />
            <Box display={{ xs: 'block', md: 'flex' }} justifyContent={{ md: 'space-evenly' }} sx={{ flexWrap: { xs: 'none', md: 'wrap' }, width: '100%' }} >
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
            <Box display={{ xs: 'block', md: 'flex' }} sx={{ flexWrap: { xs: 'none', md: 'wrap' }, width: '100%' }}>
              <Box flex={1} mr={{ xs: 0, md: '0.5em' }}>
                <TextInput fullWidth source="phone" label="resources.utilizadores.fields.telefone" />
              </Box>
              <Box flex={1} ml={{ xs: 0, md: '0.5em' }}>
                <TextInput fullWidth source="mobile" label="resources.utilizadores.fields.telemovel" />
              </Box>
            </Box>
            <ImageInput
              maxSize={5000000}
              options={{
                onDropRejected: () => notify('ra.message.ondroprejected', { type: 'error' })
              }}
              format={formatLogo}
              fullWidth
              placeholder={<PlaceholderDropZone />}
              accept={{ "image/*": [] }}
              source={"photo"}
              label="resources.utilizadores.fields.foto"
              sx={customDropZone}>
              <ImageField source="src" />
            </ImageInput>
          </Box>
        </TabbedForm.Tab>
        <TabbedForm.Tab label="resources.utilizadores.tabs.prefs_util">
          <Box display="flex" sx={{ flexWrap: 'wrap', width: '100%' }}>
            <Box flex={1} sx={{ width: '50%', pr: 1 }}>
              <SelectInput choices={langs} fullWidth source="language" label="resources.utilizadores.fields.lang_fav" />
            </Box>
            <Box flex={1} sx={{ width: '50%', pl: 1 }}>
              <SelectInput choices={themes} fullWidth source="theme" label="resources.utilizadores.fields.tema_fav" />
            </Box>
          </Box>
        </TabbedForm.Tab>
        <TabbedForm.Tab label={'resources.app-users-sessions.name'}>
          <Box sx={{ width: '100%' }}>
            <ReferenceManyField
              reference="app-users-sessions" target="app_users_id"
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
        </TabbedForm.Tab>
      </TabbedForm>
    </Edit>
  ) : <Loading />;

}

export default Profile;