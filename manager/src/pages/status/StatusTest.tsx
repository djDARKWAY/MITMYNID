import React, { useState } from "react";
import { Button, Container, Typography, Paper, Alert, TextField } from "@mui/material";

const DomibusTestPage = () => {
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");

    const handleRequest = async (url: string) => {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa("DomibusAdmin:dF55fKYf7fdF55fKYf7f!")
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setResponseData(data);
            setError(null);
        } catch (err) {
            console.error("Request failed", err);
            setError("Falha na requisição.");
        }
    };

    const handlePostPmode = async (url: string) => {
        if (!file || !description) {
            setError("É necessário selecionar um ficheiro XML e fornecer uma descrição.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("description", description);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": "Basic " + btoa("DomibusAdmin:dF55fKYf7fdF55fKYf7f!")
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error("Erro ao enviar o PMode.");
            }

            const data = await response.json();
            setResponseData(data);
            setError(null);
        } catch (err) {
            console.error("Erro no envio do PMode:", err);
            setError("Falha ao enviar o PMode.");
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Teste de requisição ao Domibus
            </Typography>

            <Button variant="contained" color="info" onClick={() => handleRequest("http://192.168.1.64:8080/domibus/ext/party")}> GET Parties </Button>
            <Button variant="contained" color="info" onClick={() => handleRequest("http://192.168.1.64:8080/domibus/ext/metrics/metrics")} style={{ marginLeft: "10px" }}> Metrics </Button>
            <Button variant="contained" color="info" onClick={() => handleRequest("http://192.168.1.64:8080/domibus/ext/monitoring/messages/failed")} style={{ marginLeft: "10px" }}> Failed Messages </Button>
            <Button variant="contained" color="info" onClick={() => handleRequest("http://192.168.1.64:8080/domibus/ext/truststore/entries")} style={{ marginLeft: "10px" }}> Truststore Entries </Button>
            <Button variant="contained" color="info" onClick={() => handleRequest("http://192.168.1.64:8080/domibus/ext/party/processes")} style={{ marginLeft: "10px" }}> Party Processes </Button>

            {/* Upload de ficheiro e POST */}
            <Paper elevation={3} style={{ marginTop: "20px", padding: "20px" }}>
                <Typography variant="h6">Enviar PMode</Typography>
                <input
                    type="file"
                    accept=".xml"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    style={{ marginTop: "10px" }}
                />
                <TextField
                    label="Descrição"
                    variant="outlined"
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ marginTop: "10px" }}
                />
                <Button variant="contained" color="info" onClick={() => handlePostPmode("http://192.168.1.64:8080/domibus/ext/pmode")} style={{ marginTop: "10px" }}> Send PMode </Button>
            </Paper>

            {responseData && (
                <Paper elevation={3} style={{ marginTop: "20px", padding: "20px" }}>
                    <Typography variant="h6">Resposta:</Typography>
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </Paper>
            )}

            {error && (
                <Alert severity="error" style={{ marginTop: "20px" }}>
                    Erro: {error}
                </Alert>
            )}
        </Container>
    );
};

export default DomibusTestPage;
