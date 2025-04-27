import React, { useState } from "react";
import { Edit, TabbedForm, TextInput, DateInput, Toolbar, SaveButton, useRecordContext, useInput, useRedirect } from "react-admin";
import { Typography, Divider, Box, Button, Card, CardContent, Paper } from "@mui/material";
import { CalendarToday, Person, DoDisturb, UploadFile } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface CertificatePreviewProps {
  source: string;
  label: string;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({ source, label }) => {
  const theme = useTheme();
  const record = useRecordContext();
  const [certificate, setCertificate] = useState<string | null>(null);
  
  const { field } = useInput({ source });
  const displayValue = certificate !== null ? certificate : record?.[source] || '';

  const handleFileUpload = async (file: File) => {
    try {
      const fileContent = await file.text();
      setCertificate(fileContent);
      field.onChange(fileContent);
    } catch (error) {
      console.error("Erro ao ler o arquivo:", error);
    }
  };

  const handleDelete = () => {
    setCertificate('');
    field.onChange('');
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
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          mb: 1,
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary
        }}
      >
        {displayValue}
      </Paper>
      
      <Box display="flex" justifyContent="center" gap={1} sx={{ mt: 0.5 }}>
        <Button
          variant="contained"
          startIcon={<UploadFile />}
          onClick={() => {
            const element = document.createElement("a");
            const file = new Blob([displayValue], { type: "text/plain" });
            element.href = URL.createObjectURL(file);
            element.download = `${source}.crt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
        >
          Transferir
        </Button>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFile />}
        >
          Editar
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
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
        >
          Eliminar
        </Button>
      </Box>
      
      <input type="hidden" {...field} value={certificate !== null ? certificate : record?.[source] || ''} />
    </Box>
  );
};

export const CertificatesEdit = () => (
    <Edit>
        <TabbedForm toolbar={<CustomToolbar />}>
            <TabbedForm.Tab label="Identificação">
                <Box display="flex" alignItems="center">
                    <Person />
                    <Typography variant="h6" sx={{ ml: 1 }}>Identificação</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <TextInput source="name" label="show.certificates.name" fullWidth />
                <TextInput source="file_path" label="show.certificates.file_path" fullWidth />
            </TabbedForm.Tab>

            <TabbedForm.Tab label="Detalhes">
                <Box display="flex" alignItems="center">
                    <CalendarToday />
                    <Typography variant="h6" sx={{ ml: 1 }}>Detalhes</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <TextInput source="issuer_url" label="show.certificates.issuer_url" fullWidth />
                <Box display="flex" gap={2} sx={{ width: "100%" }}>
                    <DateInput source="issue_date" label="show.certificates.issue_date" fullWidth />
                    <DateInput source="expiration_date" label="show.certificates.expiration_date" fullWidth />
                </Box>
            </TabbedForm.Tab>

            <TabbedForm.Tab label="Conteúdo">
                <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Para alterar um certificado, clique no botão "Editar" abaixo de cada campo. As alterações só serão salvas ao clicar em "Guardar".
                        </Typography>
                        <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={2}>
                            <CertificatePreview 
                                source="srv_cert" 
                                label="show.certificates.srv_cert" 
                            />
                            <CertificatePreview 
                                source="int_cert" 
                                label="show.certificates.int_cert" 
                            />
                            <CertificatePreview 
                                source="priv_key" 
                                label="show.certificates.priv_key" 
                            />
                        </Box>
                    </CardContent>
                </Card>
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
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
