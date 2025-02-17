import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Container from '@mui/material/Container';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNotify, useTranslate, Notification, IconButtonWithTooltip, useDataProvider, LocalesMenuButton } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react'
import { DataProviderWithCustomMethods } from '../../utils/types';
import Copyright from './Copyright';

export default function Register() {

  const dataProvider = useDataProvider<DataProviderWithCustomMethods>()
  const notify = useNotify()
  const translate = useTranslate()
  const navigate = useNavigate()
  // const [locale] = useLocaleState();

  // useEffect(() => {
  //   if (localStorage.getItem('token')) {
  //     navigate('/')
  //   }
  // }, []);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (formData.get('password') !== formData.get('confirm_password'))
      return notify(translate('userRegister.error.confirm_password'), { type: 'warning' })

    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
      person_name: formData.get('person_name'),
      email: formData.get('email'),
      nif: formData.get('nif'),
      // locale: locale,
      // validity: new Date(Date.now())
    }

    dataProvider.createneId('auth/register', { data: data })
      .then(() => notify('ra.notification.register_user', { type: 'success' }))
      .catch((error: any) => notify(error.message ? error.message : 'ra.notification.error_register_user', { type: 'error' }))

  }, []);

  return (
    <Container component="div" maxWidth="md">
      <CssBaseline />
      <Box sx={{ marginTop: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* <Box display={'grid'} gridTemplateColumns={'auto 1fr'} width={'100%'} justifyItems={'center'} alignItems={'center'}>
          <IconButtonWithTooltip onClick={() => navigate('/login')} label={translate('ra.navigation.previous')} size="small" sx={{ width: 'fit-content', height: 'fit-content' }}> <ArrowBackIcon /> </IconButtonWithTooltip>
          <img src='cologistics_horizontal.svg' alt="logo" style={{ width: '350px', flexGrow: '1' }} />
        </Box> */}
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 4, width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>

          <Box display={'flex'} gap={'1rem'}>
            <TextField fullWidth name="person_name" label={translate('resources.utilizadores.fields.nome')} id="person_name" autoFocus required />
            <TextField fullWidth name="username" label={translate('resources.utilizadores.fields.username')} id="username" autoComplete="username" required />
          </Box>
          <Box display={'flex'} gap={'1rem'}>
            <TextField fullWidth name='email' label={translate('resources.utilizadores.fields.email')} id='email' type={'email'} required />
            <TextField fullWidth name='nif' label={translate('resources.utilizadores.fields.nif')} id='nif' required />
          </Box>
          <Box display={'flex'} gap={'1rem'}>
            <TextField fullWidth name="password" label={translate('resources.utilizadores.fields.password')} type="password" id="password" autoComplete="new-password" required />
            <TextField fullWidth name="confirm_password" label={translate('resources.utilizadores.fields.confirm_password')} type="password" id="confirm_password" autoComplete="new-password" required />
          </Box>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {translate('ra.auth.sign_up')}
          </Button>

        </Box>
      </Box>
      <Notification />

    </Container>

  );
}
