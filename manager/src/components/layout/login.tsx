import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextInput from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { useLogin, useNotify, useTranslate, useTheme as useThemeRA } from 'react-admin';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import Copyright from './Copyright';
import './css/form-shake.css';

export default function SignIn() {

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [shake, setShake] = useState(false);

  const login = useLogin();
  const notify = useNotify();
  const translate = useTranslate();
  const [theme, setTheme] = useThemeRA();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username')?.toString().trim();
    const password = data.get('password')?.toString().trim();
    // Validação simples dos campos obrigatórios
    if (!username || !password) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      notify('Preencha todos os campos obrigatórios.', { type: 'warning' });
      return;
    }
    login({
      username,
      password,
    })
      .then((response: any) => {
        if (response?.theme) {
          setTheme(response.theme);
        }
      })
      .catch(() => {
        setShake(true);
        setTimeout(() => setShake(false), 600);
        notify('Utilizador ou palavra-passe inválidos', { type: 'warning' });
      });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      <Box sx={{ flex: '95%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box className={shake ? 'shake' : ''} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', margin: '5px' }}>
          <img src='MMN_H_RGB.svg' alt="logo" style={{ height: 70 }} />
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 4 }}>
            <TextInput
              margin="normal"
              fullWidth
              size='small'
              name="username"
              label={translate('ra.auth.username')}
              id="username"
              autoComplete="username"
              autoFocus
            />
            <TextInput
              margin="normal"
              fullWidth
              size='small'
              name="password"
              label={translate('ra.auth.password')}
              type={showPassword ? 'text' : "password"}
              id="password"
              autoComplete="current-password"
              InputProps={{ // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              {translate('ra.auth.sign_in')}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/#/forgotpass">
                  {translate('ra.auth.forgot')}
                </Link>
              </Grid>
              <Grid item xs sx={{ display: 'flex', justifyContent: 'end' }}>
                <Link href="/register">
                  {translate('ra.auth.sign_up')}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

      </Box>
      <Copyright sx={{ flex: '5%' }} />
    </Box >
  );
}
