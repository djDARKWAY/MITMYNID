import { Box, Button, TextField, Typography, CssBaseline, Checkbox, FormControlLabel, Grid, Link, LinearProgress, Fade, Tooltip, CircularProgress } from "@mui/material";
import { useNotify, useTranslate, Notification } from "react-admin";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import zxcvbn from "zxcvbn";
import { url } from "../../App";
import Copyright from "./Copyright";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ReCAPTCHA from "react-google-recaptcha";

const theme = createTheme({
  palette: {
    background: { default: "#FCFCFE" },
    customElements: { actions: { main: "#FCFCFE" } },
  },
})

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || process.env.VITE_RECAPTCHA_SITE_KEY;

export default function Register() {
  const notify = useNotify();
  const translate = useTranslate();
  const navigate = useNavigate();
  const [skipConfirmPassword, setSkipConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sanitizeInput = (input: string | null | undefined): string => {
    if (!input) return "";
    return input.toString().replace(/<[^>]*>?/gm, '').trim();
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordStrength(zxcvbn(newPassword).score);
  };

  const getPasswordStrengthLabel = (): string => {
    const labels = ["Muito Fraca", "Fraca", "Média", "Forte", "Muito Forte"];
    return labels[passwordStrength];
  };

  const validateFields = (data: { [key: string]: string }, confirmPassword?: string): boolean => {
    const newErrors: { [key: string]: string } = {};
    const validate = (condition: boolean, field: string, message: string) => {
      if (condition) newErrors[field] = message;
    };

    // Mandatory fields validation
    const rules: { [key: string]: { condition: boolean; message: string }[] } = {
      username: [
        { condition: !data.username, message: "O nome de utilizador é obrigatório!" },
        { condition: data.username?.length < 3, message: "O nome de utilizador deve ter pelo menos 3 caracteres!" },
        { condition: data.username?.length > 50, message: "O nome de utilizador é muito longo!" },
        { condition: !/^[a-zA-Z0-9_.-]+$/.test(data.username || ''), message: "O nome de utilizador só pode conter letras, números, pontos, hífens e underscores!" },
      ],
      password: [
        { condition: !data.password, message: "A password é obrigatória!" },
        { condition: data.password?.length < 8, message: "A password deve ter pelo menos 8 caracteres!" },
        { condition: !/[A-Z]/.test(data.password || ''), message: "A password deve conter pelo menos uma letra maiúscula!" },
        { condition: !/[a-z]/.test(data.password || ''), message: "A password deve conter pelo menos uma letra minúscula!" },
        { condition: !/[0-9]/.test(data.password || ''), message: "A password deve conter pelo menos um número!" },
        { condition: !/[!@#$%^&*(),.?":{}|<>]/.test(data.password || ''), message: "A password deve conter pelo menos um caractere especial!" },
      ],
      person_name: [
        { condition: !data.person_name, message: "O nome é obrigatório!" },
        { condition: data.person_name?.length < 2, message: "O nome deve ter pelo menos 2 caracteres!" },
        { condition: data.person_name?.length > 100, message: "O nome é muito longo!" },
      ],
      email: [
        { condition: !data.email, message: "O email é obrigatório!" },
        { condition: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || ''), message: "O formato do email é inválido!" },
      ],
      nif: [
        { condition: !data.nif, message: "O NIF é obrigatório!" },
        { condition: !/^\d{9}$/.test(data.nif || ''), message: "O NIF deve conter exatamente 9 dígitos!" },
      ],
    };

    Object.entries(rules).forEach(([field, validations]) => {
      for (const { condition, message } of validations) {
        if (condition) {
          validate(true, field, message);
          break;
        }
      }
    });

    if (!skipConfirmPassword) {
      if (!confirmPassword) {
        newErrors["confirm_password"] = translate("resources.users.error.confirm_password") + " é obrigatória!";
      } else if (data.password !== confirmPassword) {
        newErrors["confirm_password"] = translate("resources.users.error.confirm_password") || "As palavras-passe não coincidem.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      if (loading) return;
      setLoading(true);
      const formData = new FormData(event.currentTarget);

      if (!recaptchaToken) {
        notify("Por favor, conclua o reCAPTCHA.", { type: "warning" });
        setLoading(false);
        return;
      }

      const data = {
        username: sanitizeInput(formData.get("username") as string),
        password: sanitizeInput(formData.get("password") as string),
        person_name: sanitizeInput(formData.get("person_name") as string),
        email: sanitizeInput(formData.get("email") as string),
        nif: sanitizeInput(formData.get("nif") as string),
        recaptchaToken,
      };
      const confirmPassword = sanitizeInput(formData.get("confirm_password") as string);
      if (!validateFields(data, confirmPassword)) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${url}auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok) {
          notify(translate("ra.notification.register_user", { _: "Registo efetuado com sucesso! Será redirecionado para o login." }), {
            type: "success",
            autoHideDuration: 2000,
            anchorOrigin: { vertical: 'top', horizontal: 'center' }
          });
          setTimeout(() => {
            navigate("/login");
            // Não fazer setLoading(false) aqui, pois o redirect vai acontecer
          }, 2000);
          return; // Garante que não faz setLoading(false) depois
        } else {
          notify(responseData.message || responseData.error?.message || "ra.notification.error_register_user", { type: "error" });
          setLoading(false);
        }
      } catch (error) {
        console.log("Registration error:", error);
        notify("ra.notification.error_register_user", { type: "error" });
        setLoading(false);
      }
    },
    [notify, translate, navigate, skipConfirmPassword, recaptchaToken, loading]
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <CssBaseline />
        <Box sx={{ flex: '95%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 500, width: "100%", margin: '5px' }}>
            <img src="MMN_H_RGB.svg" alt="logo" style={{ height: 70 }} />
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <Grid container spacing={0.1} columnSpacing={1.5} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                <Grid item xs={12} sm={6}>
                  <TextField name="person_name" label={translate("resources.users.fields.name")} fullWidth required margin="dense" size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField name="username" label={translate("resources.users.fields.username")} fullWidth required margin="dense" size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField name="email" label={translate("resources.users.fields.email")} type="email" fullWidth required margin="dense" size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField name="nif" label={translate("resources.users.fields.nif")} fullWidth required margin="dense" size="small" />
                </Grid>
                <Grid item xs={12} sm={skipConfirmPassword ? 12 : 6}>
                  <Tooltip
                    open={passwordFocused}
                    placement={skipConfirmPassword ? "right" : "left"}
                    title={
                      <Box sx={{ backgroundColor: '#FCFCFE', color: '#222', borderRadius: 2, boxShadow: 3, p: 2, minWidth: 220, border: '1px solid #e0e0e0' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1976D2', mb: 0.5 }}>
                        {translate("show.register.password_requirements")}
                        </Typography>
                        {[
                        { test: password.length >= 8, label: translate("show.register.min_8_chars") },
                        { test: /[A-Z]/.test(password), label: translate("show.register.uppercase") },
                        { test: /[a-z]/.test(password), label: translate("show.register.lowercase") },
                        { test: /[0-9]/.test(password), label: translate("show.register.number") },
                        { test: /[^A-Za-z0-9]/.test(password), label: translate("show.register.special_char") }
                        ].map(({ test, label }, i) => (
                        <Box key={i} component="li" sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap', listStyle: 'none', pl: 0 }}>
                          {test ? <CheckCircleIcon sx={{ color: '#1976D2', fontSize: 20 }} /> : <RadioButtonUncheckedIcon sx={{ color: '#1976D2', fontSize: 20 }} />}
                          <span style={{ marginLeft: 6 }}>{label}</span>
                        </Box>
                        ))}
                      </Box>
                    }
                    arrow
                    componentsProps={{
                      tooltip: { sx: { backgroundColor: 'transparent', boxShadow: 'none', p: 0, m: 0, maxWidth: 300 } },
                      arrow: { sx: { color: '#FCFCFE', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))' } },
                    }}
                  >
                    <TextField
                      name="password"
                      label={translate("resources.users.fields.password")}
                      type={skipConfirmPassword ? "text" : "password"}
                      fullWidth
                      required
                      margin="dense"
                      size="small"
                      value={password}
                      onChange={handlePasswordChange}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                  </Tooltip>
                </Grid>
                {!skipConfirmPassword && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="confirm_password"
                      label={translate("resources.users.fields.confirm_password")}
                      type="password"
                      fullWidth
                      required
                      margin="dense"
                      size="small"
                      error={Boolean(errors.confirm_password)}
                      helperText={errors.confirm_password}
                    />
                  </Grid>
                )}
              </Grid>
              <Fade in={!!password} timeout={400} unmountOnExit>
                <Box>
                  <LinearProgress
                    variant="determinate"
                    value={password ? (passwordStrength + 1) * 20 : 0}
                    sx={{ height: 6, borderRadius: 1, mt: 1 }}
                  />
                  <Typography variant="caption" sx={{ mt: 1, textAlign: "center", display: "block" }}>
                    {getPasswordStrengthLabel()}
                  </Typography>
                </Box>
              </Fade>
              <FormControlLabel
                control={<Checkbox checked={skipConfirmPassword} onChange={(e) => setSkipConfirmPassword(e.target.checked)} />}
                label={translate("resources.users.fields.show_password")}
              />
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={token => setRecaptchaToken(token)}
                />
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!recaptchaToken || loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? translate("ra.action.loading", { _: "A registar..." }) : translate("ra.auth.sign_up")}
              </Button>
              <Grid item xs sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <Link href="/login" sx={{ color: "#00B3E6" }}>
                  {translate("ra.auth.back_to_login")}
                </Link>
              </Grid>
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              {Object.values(errors).map((error, index) => (
                <Typography key={index} variant="body2" color="error" sx={{ textAlign: "center" }}>
                  {error}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
        <Copyright sx={{ flex: '5%' }} />
        <Notification />
      </Box>
    </ThemeProvider>
  );
}