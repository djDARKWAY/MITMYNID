import { Box, Button, TextField, Typography, CssBaseline, Checkbox, FormControlLabel, Grid, Link, LinearProgress } from "@mui/material";
import { useNotify, useTranslate, Notification } from "react-admin";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import zxcvbn from "zxcvbn";
import { url } from "../../App";
import Copyright from "./Copyright";

const theme = createTheme({
  palette: {
    background: { default: "#FCFCFE" },
    customElements: { actions: { main: "#FCFCFE" } },
  },
})

export default function Register() {
  const notify = useNotify();
  const translate = useTranslate();
  const navigate = useNavigate();
  const [skipConfirmPassword, setSkipConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const validateFields = (data: { [key: string]: string }): boolean => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      const data = {
        username: sanitizeInput(formData.get("username") as string),
        password: sanitizeInput(formData.get("password") as string),
        person_name: sanitizeInput(formData.get("person_name") as string),
        email: sanitizeInput(formData.get("email") as string),
        nif: sanitizeInput(formData.get("nif") as string),
      };

      if (!validateFields(data)) return;

      if (!skipConfirmPassword && formData.get("password") !== formData.get("confirm_password")) {
        return notify(translate("userRegister.error.confirm_password"), { type: "warning" });
      }

      try {
        const response = await fetch(`${url}auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok) {
          notify("ra.notification.register_user", { type: "success" });
          setTimeout(() => navigate("/login"), 2000);
        } else {
          notify(responseData.message || responseData.error?.message || "ra.notification.error_register_user", { type: "error" });
        }
      } catch (error) {
        console.log("Registration error:", error);
        notify("ra.notification.error_register_user", { type: "error" });
      }
    },
    [notify, translate, navigate, skipConfirmPassword]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "background.default" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", borderRadius: 2, width: "100%", maxWidth: 500 }}>
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
                />
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
                  />
                </Grid>
              )}
            </Grid>
            <LinearProgress variant="determinate" value={(passwordStrength + 1) * 20} sx={{ height: 6, borderRadius: 1, mt: 1 }} />
            <Typography variant="caption" sx={{ mt: 1, textAlign: "center", display: "block" }}>
              {getPasswordStrengthLabel()}
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={skipConfirmPassword} onChange={(e) => setSkipConfirmPassword(e.target.checked)} />}
              label={translate("resources.users.fields.show_password")}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 1, color: "#FFFFFF" }}>
              {translate("ra.auth.sign_up")}
            </Button>
            <Grid item xs sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              <Link href="/login" sx={{ color: "#00B3E6" }}>
                {translate("ra.auth.back_to_login")}
              </Link>
            </Grid>
          </Box>
        </Box>
        <Box sx={{ width: "100%", mb: 2 }}>
          {Object.values(errors).map((error, index) => (
            <Typography key={index} variant="body2" color="error" sx={{ textAlign: "center" }}>
              {error}
            </Typography>
          ))}
        </Box>
        <Box sx={{ position: "absolute", bottom: 46 }}>
          <Copyright />
        </Box>
        <Notification />
      </Box>
    </ThemeProvider>
  );
}