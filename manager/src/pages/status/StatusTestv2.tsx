import { useState, useEffect } from "react";
import { Container, Typography, Paper, Grid, Chip } from "@mui/material";

const BASE_URL = "http://192.168.1.64:8080/domibus/ext";

const DashboardStatusPage = () => {
  const [services, setServices] = useState<any[]>([]);
  const [counters, setCounters] = useState<any>({});
  const [parties, setParties] = useState<any[]>([]);
  const [truststoreEntries, setTruststoreEntries] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (endpoint: string, setState: (data: any) => void) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa("DomibusAdmin:dF55fKYf7fdF55fKYf7f!")
        },
      });

      if (!response.ok) {
        throw new Error("Erro na resposta da rede");
      }

      const data = await response.json();
      setState(data);
      setError(null);
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError("Falha na requisição.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NORMAL":
        return "success";
      case "WARNING":
        return "warning";
      case "CRITICAL":
        return "error";
      default:
        return "default";
    }
  };

  useEffect(() => {
    fetchData("/monitoring/application/status", (data) => setServices(data.services || []));
    fetchData("/metrics/metrics", (data) => setCounters(data.counters || {}));
    fetchData("/party", setParties);
    fetchData("/truststore/entries", setTruststoreEntries);
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom> Dashboard </Typography>

      {/* Estado da rede */}
      <Typography variant="h5" gutterBottom> Estado da rede </Typography>
      <Grid item xs={12} sm={6} md={4} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
        <Typography variant="subtitle1">
          DOMIBUS: {services.every(service => service.status === "NORMAL") ? "NORMAL" : services.some(service => service.status === "CRITICAL") ? "CRITICAL" : "WARNING"}
        </Typography>
      </Grid>
      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
        <Grid container spacing={3}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Typography variant="h6">{service.name}</Typography>
              <Chip
                label={service.status}
                color={getStatusColor(service.status)}
                style={{ marginTop: "5px" }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Contadores */}
      <Typography variant="h5" gutterBottom> Contadores </Typography>
      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
        <Grid container spacing={3}>
          {Object.entries(counters).map(([key, value]: [string, any], index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Typography variant="body1" style={{ fontWeight: "bold", textTransform: "capitalize" }}>
                {key.split(".").slice(-2, -1)}
              </Typography>
              <Typography variant="body2">Count: {value.count}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Parties */}
      <Typography variant="h5" gutterBottom> Parties </Typography>
      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
        <Grid container spacing={3}>
          {parties.map((party, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Typography variant="h6">{party.name}</Typography>
              <Typography variant="body2"><strong>Endpoint:</strong> {party.endpoint}</Typography>
              {party.identifiers && party.identifiers.length > 0 && (
                <Typography variant="body2"><strong>Party ID:</strong> {party.identifiers[0].partyId}</Typography>
              )}
              <Typography variant="body2">
                <strong>Inicia:</strong> {party.processesWithPartyAsInitiator.map((p: { name: string }) => p.name).join(", ") || "Nenhum"}
              </Typography>
              <Typography variant="body2">
                <strong>Responde:</strong> {party.processesWithPartyAsResponder.map((p: { name: string }) => p.name).join(", ") || "Nenhum"}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Truststore Entries */}
      <Typography variant="h5" gutterBottom> Truststore Entries </Typography>
      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
        <Grid container spacing={3}>
          {truststoreEntries.map((entry, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Typography variant="h6">{entry.name}</Typography>
              <Typography variant="body2"><strong>Subject:</strong> {entry.subject}</Typography>
              <Typography variant="body2"><strong>Issuer:</strong> {entry.issuer}</Typography>
              <Typography variant="body2"><strong>Válido de:</strong> {entry.validFrom}</Typography>
              <Typography variant="body2"><strong>Válido até:</strong> {entry.validUntil}</Typography>
              <Typography variant="body2"><strong>Fingerprint:</strong> {entry.fingerprints}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default DashboardStatusPage;
