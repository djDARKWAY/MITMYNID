import { useState } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  ReferenceArrayInput,
  SelectArrayInput,
  PasswordInput,
  ImageField,
  ImageInput,
  useTranslate,
  ReferenceInput,
  AutocompleteInput
} from "react-admin";
import ToolbarCreateForm from "../../components/general/ToolbarCreateForm";
import validateUsersCreateForm from "./validators/UsersCreateValidation";
import { Typography, Checkbox, Box } from '@mui/material';
import CustomInputDisabled from "../../components/general/CustomInputDisabled";
import CustomInputLabel from "../../components/general/CustomInputLabel";
import { customDropZone } from "../../components/general/customCSS";
import PlaceholderDropZone from "../../components/general/PlaceholderDropZone";

export const UsersCreate = () => {

  const [userName, setUserName] = useState<string>('');
  const [isChecked, setChecked] = useState<boolean>(true);

  const translate = useTranslate();

  const transform = (data: any) => {

    if (isChecked && userName.length > 0) {
      data.username = userName;
    }
    if (data.phone) {
      data.phone = parseInt(data.phone, 10);
    }
  
    if (data.mobile) {
      data.mobile = parseInt(data.mobile, 10);
    }

    return data
  };

  return (
    <Create transform={transform} title="resources.utilizadores.create_title">
      <SimpleForm defaultValues={{ active: true }} validate={values => validateUsersCreateForm(values, isChecked)} toolbar={<ToolbarCreateForm />}>
        <Box width={'100%'} display={{ s: 'block', md: 'flex' }} sx={{ flexWrap: { xs: 'none', md: 'wrap' } }}>
          <Box width={'100%'}>
            <Box>
              <Box sx={{ display: 'flex', gap: { xs: '5px', md: '18px' }, flexDirection: { xs: 'column', md: 'row' } }}>
                <Box flex={1} >
                  <TextInput fullWidth source="person_name" inputProps={{ minLength: 3 }} autoComplete="off" label="resources.utilizadores.fields.nome" validate={required()} />
                </Box>
                <Box flex={1} >
                  <TextInput source="email" autoComplete="off" type="email" onChange={e => setUserName(e.target.value)} label="Email" validate={required()} fullWidth />
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: { xs: '5px', md: '18px' }, flexDirection: { xs: 'column', md: 'row' } }}>
              <Box flex={1} mr={{ s: 0, md: '0.5em' }} display={'flex'} sx={{ flexWrap: 'wrap', gap: { md: '0px', xl: '15px' } }}>
                <Box flex={"auto"}>
                  {!isChecked ?
                    <TextInput source="username" autoComplete="off" label="resources.utilizadores.fields.username" fullWidth validate={required()} />
                    :
                    <Box sx={{ paddingBottom: '23.906px' }}>
                      <CustomInputDisabled>
                        <CustomInputLabel>{translate('resources.utilizadores.fields.username')} *</CustomInputLabel>
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>&nbsp;{userName}</Typography>
                      </CustomInputDisabled>
                    </Box>
                  }
                </Box>
                <Box flex={"0 1 20%"} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '38px' }}>
                  <Checkbox onChange={e => setChecked(e.target.checked)} defaultChecked={isChecked} />
                  <Typography sx={{ whiteSpace: 'nowrap' }}>{translate('resources.utilizadores.fields.use_email')}</Typography>
                </Box>
              </Box>
              <Box flex={1} >
                <PasswordInput fullWidth source="password" inputProps={{ minLength: 6 }} autoComplete="off" label="resources.utilizadores.fields.password" validate={required()} />
              </Box>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', gap: { xs: '5px', md: '18px' }, flexDirection: { xs: 'column', md: 'row' } }}>
                <Box flex={1}>
                  <TextInput source="address" autoComplete="off" label="resources.utilizadores.fields.morada" fullWidth />
                </Box>
                <Box flex={1}>
                  <TextInput source="post_code" autoComplete="off" label="resources.utilizadores.fields.cod_postal" fullWidth />
                </Box>
              </Box>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', gap: { xs: '5px', md: '18px' }, flexDirection: { xs: 'column', md: 'row' } }}>
                <Box flex={1} >
                  <TextInput fullWidth source="nif" autoComplete="off" label="resources.utilizadores.fields.nif" />
                </Box>
                <Box flex={1} >
                  <TextInput fullWidth source="nic" autoComplete="off" label="resources.utilizadores.fields.nic" />
                </Box>
                <Box flex={1} >
                  <TextInput fullWidth source="cc_num" autoComplete="off" label="resources.utilizadores.fields.cc" />
                </Box>
              </Box>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', gap: { xs: '5px', md: '18px' }, flexDirection: { xs: 'column', md: 'row' } }}>
                <Box flex={1} >
                  <TextInput fullWidth source="phone" autoComplete="off" label="resources.utilizadores.fields.telefone" />
                </Box>
                <Box flex={1} >
                  <TextInput fullWidth source="mobile" autoComplete="off" label="resources.utilizadores.fields.telemovel" />
                </Box>
              </Box>
            </Box>
            <Box display={'flex'} gap={'1rem'}>
              <ReferenceArrayInput reference="roles" source="roles">
                <SelectArrayInput optionValue="id" variant='standard' optionText="description" fullWidth label="resources.utilizadores.fields.roles" size="small" validate={required()} />
              </ReferenceArrayInput>
              <ReferenceInput source="warehouse_id" reference="warehouses">
                <AutocompleteInput
                  size="small"
                  fullWidth
                  filterToQuery={(searchText: string) => ({ localidade: `%${searchText}%` })}
                  label="resources.utilizadores.fields.warehouse"
                  validate={required()}
                />
              </ReferenceInput>
            </Box>
            <Box>
              <ImageInput
                maxSize={5000000}
                fullWidth
                placeholder={<PlaceholderDropZone />}
                accept={{ "image/*": [] }}
                source={"photo"}
                label="resources.utilizadores.fields.foto"
                sx={customDropZone}>
                <ImageField source="src" />
              </ImageInput>
            </Box>
          </Box>
        </Box>
      </SimpleForm>
    </Create>
  );
};
