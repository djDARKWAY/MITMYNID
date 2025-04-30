import React, { useState } from "react";
import { Edit, TabbedForm, TextInput, DateInput, Toolbar, SaveButton, useRecordContext, useInput, useRedirect, useTranslate, required } from "react-admin";
import { Typography, Divider, Box, Button, Paper } from "@mui/material";
import { CalendarToday, Person, DoDisturb, UploadFile, Delete } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const CertificatePreview = ({ source, label }: { source: string; label: string }) => {
  const theme = useTheme();
  const record = useRecordContext();
  const [certificate, setCertificate] = useState<string | null>(null);
  const { field } = useInput({ source });
  const displayValue = certificate ?? (record?.[source] || '');
  const isEmpty = !displayValue;

  const handleFileUpload = async (file: File) => {
    try {
      const fileContent = await file.text();
      setCertificate(fileContent);
      field.onChange(fileContent);
    } catch (error) {
      console.error("Erro ao ler o ficheiro:", error);
    }
  };

  const handleDelete = () => {
    setCertificate('');
    field.onChange('');
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([displayValue], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${source}.crt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
        {label}
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          height: '400px',
          width: '100%',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          wordBreak: 'break-all',
          mb: 1,
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        {isEmpty ? "N/A" : displayValue}
      </Paper>
      <Box display="flex" justifyContent="space-between" gap={1} sx={{ mt: 1, width: '100%' }}>
        {isEmpty ? (
          <FileUploadButton handleFileUpload={handleFileUpload} label="Carregar" fullWidth />
        ) : (
          <>
            <Button
              variant="contained"
              startIcon={<UploadFile />}
              onClick={handleDownload}
              sx={{ flex: 1 }}
            >
              Transferir
            </Button>
            <FileUploadButton handleFileUpload={handleFileUpload} label="Editar" />
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{ width: 40, height: 40, justifyContent: 'center' }}
            >
              <Delete />
            </Button>
          </>
        )}
      </Box>
      <input type="hidden" {...field} value={displayValue} />
    </Box>
  );
};

const FileUploadButton: React.FC<{ handleFileUpload: (file: File) => void; label: string; fullWidth?: boolean }> = ({ handleFileUpload, label, fullWidth = false }) => (
  <Button
    variant="contained"
    component="label"
    startIcon={<UploadFile />}
    sx={{ flex: fullWidth ? 1 : 'auto' }}
  >
    {label}
    <input
      type="file"
      accept=".crt,.pem,.key,.ca-bundle"
      hidden
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
      }}
    />
  </Button>
);

export const CertificatesEdit = () => {
  const translate = useTranslate();

  return (
    <Edit>
      <TabbedForm toolbar={<CustomToolbar />}>
        <TabbedForm.Tab label="Identificação">
          <SectionHeader icon={<Person />} title="Identificação" />
          <TextInput 
              source="name" 
              label="show.certificates.name" 
              fullWidth 
              validate={[
                required(),
                value => value && value.length <= 255 ? undefined : "O nome deve ter no máximo 255 caracteres"
              ]}
          />
          <TextInput 
              source="file_path" 
              label="show.certificates.file_path" 
              fullWidth 
              validate={[
                value => !value || value.length <= 255 ? undefined : "O caminho do ficheiro deve ter no máximo 255 caracteres"
              ]}
          />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Detalhes">
          <SectionHeader icon={<CalendarToday />} title="Detalhes" />
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} sx={{ width: '100%' }}>
            <TextInput 
              source="issuer_name" 
              label="show.certificates.issuer_name" 
              fullWidth 
              validate={[
                value => !value || value.length <= 255 ? undefined : "O nome da entidade emissora deve ter no máximo 255 caracteres"
              ]}
            />
            <TextInput 
              source="issuer_url" 
              label="show.certificates.issuer_url" 
              fullWidth 
              validate={[
                value => {
                  if(!value) return undefined;
                  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/;
                  return urlRegex.test(value) ? undefined : "A URL da entidade emissora deve ser válida";
                }
              ]}
            />
          </Box>
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Conteúdo">
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {translate("show.certificates.edit_instruction")}
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} sx={{ width: '100%' }}>
            <CertificatePreview source="srv_cert" label={translate("show.certificates.srv_cert")} />
            <CertificatePreview source="int_cert" label={translate("show.certificates.int_cert")} />
            <CertificatePreview source="priv_key" label={translate("show.certificates.priv_key")} />
          </Box>
        </TabbedForm.Tab>
      </TabbedForm>
    </Edit>
  );
};

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <>
    <Box display="flex" alignItems="center">
      {icon}
      <Typography variant="h6" sx={{ ml: 1 }}>
        {title}
      </Typography>
    </Box>
    <Divider sx={{ mb: 3 }} />
  </>
);

const CustomToolbar = () => {
  const redirect = useRedirect();
  const record = useRecordContext();

  return (
    <Toolbar>
      <SaveButton
        mutationOptions={{
          onSuccess: () => redirect(`/certificates/${record?.id}/show`),
        }}
      />
      <Button
        onClick={() => redirect(`/certificates/${record?.id}/show`)}
        startIcon={<DoDisturb />}
        color="primary"
        size="small"
        sx={{ ml: 2 }}
      >
        Cancelar
      </Button>
    </Toolbar>
  );
};
