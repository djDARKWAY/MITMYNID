import { Box, Button, TextField, Typography, CssBaseline, InputAdornment, IconButton, Checkbox, FormControlLabel, Grid, Link } from "@mui/material";
import { useNotify, useTranslate, Notification } from "react-admin";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { url } from "../../App";
import Copyright from "./Copyright";

const theme = createTheme({
  palette: {
    background: { default: "#FCFCFE" },
    customElements: { actions: { main: "#FCFCFE" } },
    primary: { main: "#00B3E6" },
  },
});

export default function Register() {
  const notify = useNotify();
  const translate = useTranslate();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [skipConfirmPassword, setSkipConfirmPassword] = useState(false);

  console.log(translate("resources.users.fields.name"));

  const sanitizeInput = (input: FormDataEntryValue | null): string => {
    if (!input) return "";
    const stringValue = input.toString();
    return stringValue.replace(/<[^>]*>?/gm, '').trim();
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      if (!skipConfirmPassword && formData.get("password") !== formData.get("confirm_password")) {
        return notify(translate("userRegister.error.confirm_password"), { type: "warning" });
      }

      const data = {
        username: sanitizeInput(formData.get("username")),
        password: sanitizeInput(formData.get("password")),
        person_name: sanitizeInput(formData.get("person_name")),
        email: sanitizeInput(formData.get("email")),
        nif: sanitizeInput(formData.get("nif")),
      };

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
          <Box component="form" onSubmit={handleSubmit}>
            <Box display="flex" gap={2}>
              <TextField name="person_name" label={translate("resources.users.fields.name")} fullWidth required margin="normal" size="small" />
              <TextField name="username" label={translate("resources.users.fields.username")} fullWidth required margin="normal" size="small" />
            </Box>
            <Box display="flex" gap={2}>
              <TextField name="email" label={translate("resources.users.fields.email")} type="email" fullWidth required margin="normal" size="small" />
              <TextField name="nif" label={translate("resources.users.fields.nif")} fullWidth required margin="normal" size="small" />
            </Box>
            <Box display="flex" gap={2}>
            <TextField
              name="password"
              label={translate("resources.users.fields.password")}
              type={skipConfirmPassword ? "text" : "password"}
              fullWidth
              required
              margin="normal"
              size="small"
            />
              {!skipConfirmPassword && (
              <TextField
                name="confirm_password"
                label={translate("resources.users.fields.confirm_password")}
                type="password"
                fullWidth
                required
                margin="normal"
                size="small"
              />
              )}
            </Box>
            <FormControlLabel
              control={<Checkbox checked={skipConfirmPassword} onChange={(e) => setSkipConfirmPassword(e.target.checked)} />}
              label={translate("resources.users.fields.show_password")}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2, color: "#FFFFFF" }}>
              {translate("ra.auth.sign_up")}
            </Button>
            <Grid item xs sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              <Link href="/login" sx={{ color: "#00B3E6" }}>
              {translate("ra.auth.back_to_login")}
              </Link>
            </Grid>
          </Box>
        </Box>
        <Box sx={{ position: "absolute", bottom: 46 }}>
          <Copyright />
        </Box>
        <Notification />
      </Box>
    </ThemeProvider>
  );
}
