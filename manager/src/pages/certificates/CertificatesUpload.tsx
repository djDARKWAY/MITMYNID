import React, { useState, useEffect } from "react";
import { Alert, Box, Button, Card, CardContent, Grid, Snackbar, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, IconButton, InputLabel, CircularProgress } from "@mui/material";
import { UploadFile, CheckCircle, RadioButtonUnchecked, Warning, Delete } from "@mui/icons-material";
import JSZip from "jszip";
import { useDropzone } from "react-dropzone";
import { useTheme } from "@mui/material/styles";
import { useTranslate } from "react-admin";

const CertificatesUpload: React.FC = () => {
  const theme = useTheme();
  const translate = useTranslate();
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" as "error" | "success" });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: "", message: "", onConfirm: () => {}, onCancel: () => {} });
  const certTypes = ["srv_cert", "priv_key", "int_cert"];
  
  const [accessPoints, setAccessPoints] = useState<{ id: number; location_description: string; ip_address: string; is_active: boolean }[]>([]);
  const [selectedAccessPoint, setSelectedAccessPoint] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccessPoints = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_REST_API}/access-points/no-cert`);
        if (!response.ok) {
          throw new Error(translate("show.certificates.upload.error_fetch_access_points"));
        }
        const data = await response.json();
        setAccessPoints(data);
      } catch (error) {
        showNotification(translate("show.certificates.upload.error_fetch_access_points"), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAccessPoints();
  }, [translate]);

  const showNotification = (message: string, severity: "error" | "success") =>
    setSnackbar({ open: true, message, severity });

  const showConfirmDialog = (title: string, message: string): Promise<boolean> =>
    new Promise((resolve) => {
      const resolveAndClose = (result: boolean) => {
        setConfirmDialog({ open: false, title: "", message: "", onConfirm: () => {}, onCancel: () => {} });
        resolve(result);
      };

      setConfirmDialog({
        open: true,
        title,
        message,
        onConfirm: () => resolveAndClose(true),
        onCancel: () => resolveAndClose(false),
      });
    });

  const promptReplace = async (key: string): Promise<boolean> => {
    if (!files[key]) return true;
    const fileType = { srv_cert: translate("show.certificates.upload.server_certificate"), priv_key: translate("show.certificates.upload.private_key"), int_cert: translate("show.certificates.upload.intermediate_certificate") }[key];
    return await showConfirmDialog(translate("show.certificates.upload.replace_file"), `${translate("show.certificates.upload.file_exists")} "${fileType}". ${translate("show.certificates.upload.replace_question")}`);
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
            ? await processFile("srv_cert", file) : lower.endsWith(".key")
            ? await processFile("priv_key", file) : lower.endsWith(".ca-bundle")
            ? await processFile("int_cert", file) : false;
          if (accepted) filesProcessed++;
        }

        showNotification(filesProcessed ? translate("show.certificates.upload.file_uploaded_success", { count: filesProcessed }) : translate("show.certificates.upload.invalid_zip_file"), filesProcessed ? "success" : "error");
      } catch {
        showNotification(translate("show.certificates.upload.error_process_zip"), "error");
      }
    } else {
      const fileKey = { crt: "srv_cert", pem: "srv_cert", key: "priv_key", "ca-bundle": "int_cert" }[fileExtension || ""];
      if (fileKey && (await processFile(fileKey, uploadedFile))) showNotification(translate("show.certificates.upload.file_uploaded_success"), "success");
      else showNotification(translate("show.certificates.upload.unsupported_file_format"), "error");
    }

    setFiles(updatedFiles);
    setProgress(updatedProgress);
  };

  const removeFile = (key: string) => {
    setFiles((prev) => ({ ...prev, [key]: null }));
    setProgress((prev) => ({ ...prev, [key]: false }));
  };

  const moveFile = (fromKey: string, toKey: string) => {
    if (files[fromKey] && fromKey !== toKey) {
      setFiles((prev) => ({
        ...prev,
        [toKey]: prev[fromKey],
        [fromKey]: null,
      }));
      setProgress((prev) => ({
        ...prev,
        [toKey]: true,
        [fromKey]: false,
      }));
    }
  };

  const isSubmitEnabled = progress.srv_cert && progress.priv_key && progress.int_cert && selectedAccessPoint !== "";
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => acceptedFiles.forEach(handleFileUpload),
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!files.srv_cert || !files.int_cert || !files.priv_key || !selectedAccessPoint) {
      showNotification(translate("show.certificates.upload.all_fields_required"), "error");
      return;
    }
  
    setLoading(true);
    try {
      const formData = {
        name: files.srv_cert.name,
        srv_cert: await files.srv_cert.text(),
        int_cert: await files.int_cert.text(),
        priv_key: await files.priv_key.text(),
        issue_date: new Date().toISOString(),
        expiration_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        is_active: true,
      };
  
      const certificateResponse = await fetch(`${import.meta.env.VITE_REST_API}/certificates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!certificateResponse.ok) {
        throw new Error(translate("show.certificates.upload.error_send_certificates"));
      }
  
      const newCertificate = await certificateResponse.json();
      const certificateId = newCertificate.id;
  
      const accessPointResponse = await fetch(`${import.meta.env.VITE_REST_API}/access-points/${selectedAccessPoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          certificate_id: certificateId,
        }),
      });
  
      if (!accessPointResponse.ok) {
        throw new Error(translate("show.certificates.upload.error_associate_access_point"));
      }
  
      showNotification(translate("show.certificates.upload.certificates_sent_success"), "success");
      setFiles({ srv_cert: null, int_cert: null, priv_key: null });
      setProgress({ srv_cert: false, int_cert: false, priv_key: false });
      setSelectedAccessPoint("");
    } catch (error) {
      showNotification(error instanceof Error ? error.message : translate("show.certificates.upload.error_process_operation"), "error");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <Box sx={{ width: "100%", mt: 4, paddingLeft: "10px" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        {translate("show.certificates.upload.certificados_ssl")}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {translate("show.certificates.upload.upload_instructions")}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Box
                {...getRootProps()}
                sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "2px dashed #5384ED", textAlign: "center", cursor: "pointer", borderRadius: "8px", transition: "all 0.3s ease", padding: "40px", "&:hover": { backgroundColor: "#f5f5f5" } }}>
                  <input {...getInputProps()} />
                <UploadFile sx={{ fontSize: 50, color: "#5384ED" }} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#5384ED" }}>
                  {translate("show.certificates.upload.drag_drop_text")}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                  {translate("show.certificates.upload.supported_files")}
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
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {translate("show.certificates.upload.uploaded_files")}
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
                          ? translate("show.certificates.upload.server_certificate")
                          : key === "priv_key"
                          ? translate("show.certificates.upload.private_key")
                          : translate("show.certificates.upload.intermediate_certificate")}
                      </Typography>
                        
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary, fontStyle: files[key] ? "normal" : "italic" }}
                      >
                        {files[key]?.name || translate("show.certificates.upload.no_file_uploaded")}
                      </Typography>
                    </Box>
                    {files[key] && (
                      <>
                        <FormControl size="small" sx={{ mr: 1 }}>
                          <Select
                            value=""
                            onChange={(e) => moveFile(key, e.target.value as string)}
                            displayEmpty
                          >
                            {certTypes
                              .filter((type) => type !== key)
                              .map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type === "srv_cert"
                                    ? translate("show.certificates.upload.server_certificate")
                                    : type === "priv_key"
                                    ? translate("show.certificates.upload.private_key")
                                    : translate("show.certificates.upload.intermediate_certificate")}
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
                      </>
                    )}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{ mt: 2 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {translate("show.certificates.upload.access_points")}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
              {translate("show.certificates.upload.access_points_info")}
            </Typography>
            
            <FormControl fullWidth variant="outlined">
              <InputLabel id="access-point-select-label">{translate("show.certificates.upload.access_points")}</InputLabel>
              <Select
                labelId="access-point-select-label"
                id="access-point-select"
                value={selectedAccessPoint}
                onChange={(e) => setSelectedAccessPoint(e.target.value as number)}
                label={translate("show.certificates.upload.access_points")}
                disabled={loading}
              >
                {loading ? (
                  <MenuItem value="">
                    <Box display="flex" alignItems="center">
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      {translate("show.certificates.upload.loading")}
                    </Box>
                  </MenuItem>
                ) : (
                  [
                    <MenuItem value="" key="none" disabled>
                      {translate("show.certificates.upload.select_access_point")}
                    </MenuItem>,
                    ...accessPoints.map(ap => (
                      <MenuItem key={ap.id} value={ap.id}>
                        {`${ap.location_description} (${ap.ip_address})${!ap.is_active ? translate("show.certificates.upload.inactive") : ""}`}
                      </MenuItem>
                    ))
                  ]
                )}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          disabled={!isSubmitEnabled} 
          onClick={handleSubmit}
        >
          {translate("show.certificates.upload.submit")}
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
            {translate("show.certificates.upload.cancel")}
          </Button>
          <Button onClick={confirmDialog.onConfirm} color="primary" variant="contained" autoFocus>
            {translate("show.certificates.upload.confirm")}
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
