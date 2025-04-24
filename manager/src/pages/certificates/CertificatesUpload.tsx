import React, { useState, useEffect } from "react";
import { Alert, Box, Button, Card, CardContent, Grid, Snackbar, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, IconButton, InputLabel, CircularProgress } from "@mui/material";
import { UploadFile, CheckCircle, RadioButtonUnchecked, Warning, Delete } from "@mui/icons-material";
import JSZip from "jszip";
import { useDropzone } from "react-dropzone";
import { useTheme } from "@mui/material/styles";

// Define the AccessPoint interface
interface AccessPoint {
  id: number;
  location_description: string;
  ip_address: string;
  is_active: boolean;
}

const CertificatesUpload: React.FC = () => {
  const theme = useTheme();
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" as "error" | "success" });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: "", message: "", onConfirm: () => {}, onCancel: () => {} });
  const certTypes = ["srv_cert", "priv_key", "int_cert"];
  
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [selectedAccessPoint, setSelectedAccessPoint] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccessPoints = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_REST_API}/access-points`);
        if (!response.ok) {
          throw new Error("Erro ao obter os Access Points");
        }
        const data = await response.json();
        setAccessPoints(data);
      } catch (error) {
        showNotification("Erro ao obter os Access Points", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAccessPoints();
  }, []);

  const showNotification = (message: string, severity: "error" | "success") =>
    setSnackbar({ open: true, message, severity });

  const showConfirmDialog = (title: string, message: string): Promise<boolean> =>
    new Promise((resolve) =>
      setConfirmDialog({ open: true, title, message, onConfirm: () => resolve(true), onCancel: () => resolve(false) })
    );

  const promptReplace = async (key: string): Promise<boolean> => {
    if (!files[key]) return true;
    const fileType = { srv_cert: "Certificado do Servidor", priv_key: "Chave Privada", int_cert: "Certificado Intermediário" }[key];
    return await showConfirmDialog("Substituir Ficheiro", `Já existe um ficheiro para "${fileType}". Deseja substituir?`);
  };

  const handleFileUpload = async (uploadedFile: File) => {
    const fileExtension = uploadedFile.name.split(".").pop()?.toLowerCase();
    const updatedFiles = { ...files };
    const updatedProgress = { ...progress };

    const processFile = async (key: string, file: File): Promise<boolean> => {
      if (!(await promptReplace(key))) return false;
      updatedFiles[key] = file;
      updatedProgress[key] = true;
      return true;
    };

    if (fileExtension === "zip") {
      try {
        const zip = await JSZip().loadAsync(uploadedFile);
        let filesProcessed = 0;

        for (const filename of Object.keys(zip.files)) {
          if (zip.files[filename].dir) continue;
          const fileData = await zip.files[filename].async("uint8array");
          const file = new File([fileData], filename);
          const lower = filename.toLowerCase();

          const accepted = lower.endsWith(".crt") || lower.endsWith(".pem")
            ? await processFile("srv_cert", file)
            : lower.endsWith(".key")
            ? await processFile("priv_key", file)
            : lower.endsWith(".ca-bundle")
            ? await processFile("int_cert", file)
            : false;

          if (accepted) filesProcessed++;
        }

        showNotification(filesProcessed ? `${filesProcessed} ficheiro(s) carregado(s) com sucesso.` : "Nenhum ficheiro válido encontrado no ZIP.", filesProcessed ? "success" : "error");
      } catch {
        showNotification("Erro ao processar o arquivo ZIP.", "error");
      }
    } else {
      const fileKey = { crt: "srv_cert", pem: "srv_cert", key: "priv_key", "ca-bundle": "int_cert" }[fileExtension || ""];
      if (fileKey && (await processFile(fileKey, uploadedFile))) showNotification("Ficheiro carregado com sucesso.", "success");
      else showNotification("Formato de ficheiro não suportado.", "error");
    }

    setFiles(updatedFiles);
    setProgress(updatedProgress);
  };

  const removeFile = (key: string) => {
    setFiles((prev) => ({ ...prev, [key]: null }));
    setProgress((prev) => ({ ...prev, [key]: false }));
  };

  const isSubmitEnabled = progress.srv_cert && progress.priv_key && progress.int_cert && selectedAccessPoint !== "";
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => acceptedFiles.forEach(handleFileUpload),
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!files.srv_cert || !files.int_cert || !files.priv_key || !selectedAccessPoint) {
      showNotification("Todos os ficheiros e o Access Point devem ser selecionados.", "error");
      return;
    }
  
    const formData = {
      name: files.srv_cert.name,
      srv_cert: await files.srv_cert.text(),
      int_cert: await files.int_cert.text(),
      priv_key: await files.priv_key.text(),
      issue_date: new Date().toISOString(),
      expiration_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      is_active: true,
    };
  
    try {
      const response = await fetch(`${import.meta.env.VITE_REST_API}/certificates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error("Erro ao enviar os certificados para o servidor.");
      }
  
      showNotification("Certificados enviados com sucesso.", "success");
      setFiles({ srv_cert: null, int_cert: null, priv_key: null });
      setProgress({ srv_cert: false, int_cert: false, priv_key: false });
      setSelectedAccessPoint("");
    } catch (error) {
      showNotification("Erro ao enviar os certificados para o servidor.", "error");
    }
  };  

  return (
    <Box sx={{ width: "100%", mt: 4, paddingLeft: "10px" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Certificados SSL
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Pode carregar um ficheiro ZIP com todos os certificados ou fazer o upload individualmente.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box
                {...getRootProps()}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "2px dashed #5384ED",
                  textAlign: "center",
                  cursor: "pointer",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  padding: "40px",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <input {...getInputProps()} />
                <UploadFile sx={{ fontSize: 50, color: "#5384ED" }} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#5384ED" }}>
                  Arraste e solte os certificados aqui ou clique
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                  Apenas ficheiros: .zip, .crt, .pem, .key, .ca-bundle
                </Typography>
              </Box>

              <Box mt={2}>
                <input
                  type="file"
                  id="manual-upload"
                  accept=".zip,.crt,.pem,.key,.ca-bundle"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ficheiros carregados
              </Typography>
              <Stack spacing={1}>
                {certTypes.map((key) => (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: 1,
                      borderRadius: 1,
                      backgroundColor: progress[key] ? "#f0f7ff" : "transparent",
                      border: progress[key] ? "1px solid #c2e0ff" : "1px solid #e0e0e0",
                    }}
                  >
                    {progress[key] ? <CheckCircle sx={{ color: "#4caf50" }} /> : <RadioButtonUnchecked sx={{ color: "#9e9e9e" }} />}
                    <Box ml={1} flex={1}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{ color: theme.palette.text.primary }}
                      >
                        {key === "srv_cert"
                          ? "Certificado do Servidor"
                          : key === "priv_key"
                          ? "Chave Privada"
                          : "Certificado Intermediário"}
                      </Typography>
                        
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary, fontStyle: files[key] ? "normal" : "italic" }}
                      >
                        {files[key]?.name || "Nenhum ficheiro carregado"}
                      </Typography>
                    </Box>
                    {files[key] && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFile(key)}
                        sx={{ padding: 1 }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Access Point
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                Selecione o Access Point para o qual deseja aplicar os certificados.
              </Typography>
              
              <FormControl fullWidth variant="outlined">
                <InputLabel id="access-point-select-label">Access Point</InputLabel>
                <Select
                  labelId="access-point-select-label"
                  id="access-point-select"
                  value={selectedAccessPoint}
                  onChange={(e) => setSelectedAccessPoint(e.target.value as number)}
                  label="Access Point"
                  disabled={loading}
                >
                  {loading ? (
                    <MenuItem value="">
                      <Box display="flex" alignItems="center">
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        A carregar...
                      </Box>
                    </MenuItem>
                  ) : (
                    [
                      <MenuItem value="" key="none" disabled>
                        Selecione um Access Point
                      </MenuItem>,
                      ...accessPoints.map(ap => (
                        <MenuItem key={ap.id} value={ap.id}>
                          {`${ap.location_description} (${ap.ip_address})${!ap.is_active ? " - Inativo" : ""}`}
                        </MenuItem>
                      ))
                    ]
                  )}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          disabled={!isSubmitEnabled} 
          onClick={handleSubmit}
        >
          Submeter
        </Button>
      </Box>

      <Dialog open={confirmDialog.open} onClose={confirmDialog.onCancel}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Warning color="warning" />
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmDialog.onCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDialog.onConfirm} color="primary" variant="contained" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CertificatesUpload;
