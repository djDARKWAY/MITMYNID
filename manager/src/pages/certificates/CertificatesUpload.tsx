import React, { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Grid, Snackbar, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, IconButton } from "@mui/material";
import { UploadFile, CheckCircle, RadioButtonUnchecked, Warning, Delete } from "@mui/icons-material";
import JSZip from "jszip";
import { useDropzone } from "react-dropzone";
import { useTheme } from "@mui/material/styles";

const CertificatesUpload: React.FC = () => {
  const theme = useTheme();
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" as "error" | "success" });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: "", message: "", onConfirm: () => {}, onCancel: () => {} });
  const certTypes = ["srv_cert", "priv_key", "int_cert"];

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

  const reassignFile = (fromKey: string, toKey: string) => {
    if (fromKey === toKey) return;

    setFiles((prev) => {
      const updated = { ...prev };
      const temp = updated[fromKey];
      updated[fromKey] = updated[toKey];
      updated[toKey] = temp;
      return updated;
    });

    setProgress((prev) => {
      const updated = { ...prev };
      const temp = updated[fromKey];
      updated[fromKey] = updated[toKey];
      updated[toKey] = temp;
      return updated;
    });

    showNotification("Ficheiro reassignado com sucesso.", "success");
  };

  const removeFile = (key: string) => {
    setFiles((prev) => ({ ...prev, [key]: null }));
    setProgress((prev) => ({ ...prev, [key]: false }));
  };

  const isSubmitEnabled = progress.srv_cert && progress.priv_key && progress.int_cert;
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => acceptedFiles.forEach(handleFileUpload),
    multiple: false,
  });

  return (
    <Box sx={{ width: "100%", mt: 4, paddingLeft: "10px" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Carregamento de Certificados SSL
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
                      <Box display="flex">
                        <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
                          <Select
                            value={key}
                            onChange={(e) => reassignFile(key, e.target.value)}
                            variant="outlined"
                            size="small"
                          >
                            {certTypes.map((type) => (
                              <MenuItem key={type} value={type} disabled={type === key}>
                                {type === "srv_cert"
                                  ? "Cert. Servidor"
                                  : type === "priv_key"
                                  ? "Chave Privada"
                                  : "Cert. Interm."}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeFile(key)}
                          sx={{ padding: 1 }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" disabled={!isSubmitEnabled}>
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
