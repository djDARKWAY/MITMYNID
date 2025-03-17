import React, { useState } from "react";
import { Button, Container, Typography, Paper, Alert } from "@mui/material";

const DomibusTestPage = () => {
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);

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
        }
    };

    const getParties = () => handleRequest("http://192.168.1.64:8080/domibus/ext/party");
    const getMetrics = () => handleRequest("http://192.168.1.64:8080/domibus/ext/metrics/metrics");
    const getFailedMessages = () => handleRequest("http://192.168.1.64:8080/domibus/ext/monitoring/messages/failed");
    const getTruststoreEntries = () => handleRequest("http://192.168.1.64:8080/domibus/ext/truststore/entries");
    const getPartyProcesses = () => handleRequest("http://192.168.1.64:8080/domibus/ext/party/processes");
    const getApplicationStatus = () => handleRequest("http://192.168.1.64:8080/domibus/ext/monitoring/application/status");

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Teste de requisição ao Domibus
            </Typography>

            <Button variant="contained" color="info" onClick={getParties}> GET Parties </Button>
            <Button variant="contained" color="info" onClick={getMetrics} style={{ marginLeft: "10px" }}> Metrics </Button>
            <Button variant="contained" color="info" onClick={getFailedMessages} style={{ marginLeft: "10px" }}> Failed Messages </Button>
            <Button variant="contained" color="info" onClick={getTruststoreEntries} style={{ marginLeft: "10px" }}> Truststore Entries </Button>
            <Button variant="contained" color="info" onClick={getPartyProcesses} style={{ marginLeft: "10px" }}> Party Processes </Button>
            <Button variant="contained" color="info" onClick={getApplicationStatus} style={{ marginLeft: "10px" }}> Application Status </Button>

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
