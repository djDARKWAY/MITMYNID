import React, { useState } from "react";
import { Edit, TabbedForm, TextInput, DateInput, Toolbar, SaveButton, useRecordContext, useInput, useRedirect } from "react-admin";
import { Typography, Divider, Box, Button, Card, CardContent, Paper } from "@mui/material";
import { CalendarToday, Person, DoDisturb, UploadFile, Delete, Download } from "@mui/icons-material";
import { Link } from "react-router-dom";

interface CertificatePreviewProps {
  source: string;
  label: string;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({ source, label }) => {
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

  const handleDownload = () => {
    const blob = new Blob([displayValue], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${source}.crt`;
    link.click();
  };

  const handleDelete = () => {
    setCertificate(null);
    field.onChange(null);
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
          height: '100%', // Fixed height
          overflowY: 'auto', // Enable vertical scrollbar
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          mb: 1,
          bgcolor: '#f5f5f5'
        }}
      >
        {displayValue}
      </Paper>
      <Box display="flex" justifyContent="space-between" gap={1}>
        {displayValue && (
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownload}
            sx={{ flex: 1 }}
          >
            Transferir
          </Button>
        )}
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFile />}
          sx={{ flex: 1 }}
        >
          {displayValue ? "Editar" : "Importar"}
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
        {displayValue && (
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
            sx={{ flex: 1 }}
          >
            Eliminar
          </Button>
        )}
      </Box>
      <input 
        type="hidden" 
        {...field}
        value={certificate !== null ? certificate : record?.[source] || ''}
      />
    </Box>
  );
};

export const CertificatesEdit = () => {
  const redirect = useRedirect();

  const handleSave = () => {
    redirect("show", "/certificates");
  };

  return (
    <Edit mutationOptions={{ onSuccess: handleSave }}>
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
                            Para alterar um certificado, clique no botão "Editar" abaixo de cada campo. As alterações só serão guardadas ao clicar em "Guardar".
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
};

const CustomToolbar = () => (
    <Toolbar>
        <SaveButton />
        <Button component={Link} to="/certificates" startIcon={<DoDisturb />} color="primary" size="small" sx={{ ml: 2 }}>Cancelar</Button>
    </Toolbar>
);
