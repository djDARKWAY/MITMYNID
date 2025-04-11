import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Grid, Chip } from "@mui/material";
import { WifiTetheringError } from "@mui/icons-material";

const DomibusStats = () => {
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const username = import.meta.env.VITE_AUTH_USERNAME;
            const password = import.meta.env.VITE_AUTH_PASSWORD;

            const response = await fetch(`http://192.168.1.64:8080/domibus/ext/monitoring/application/status`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa(`${username}:${password}`)
                },
            });

            if (!response.ok) {
                throw new Error("Erro na resposta da rede");
            }

            const data = await response.json();
            setServices(data.services || []);
            setError(null);
        } catch {
            setError("Falha na requisição.");
        } finally {
            setIsLoading(false);
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
        fetchData();
    }, []);

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    const overallStatus = services.reduce((status, service) => {
        if (service.status === "CRITICAL") return "CRITICAL";
        if (service.status === "WARNING" && status !== "CRITICAL") return "WARNING";
        return status;
    }, "NORMAL");

    return (
        <Box
            sx={{
            display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2,
            borderRadius: 2, p: 2, backgroundColor: "rgba(255, 255, 255, 0.1)",
            boxShadow: 3, borderTop: "5px solid #5384ED"
            }}
        >
            <Box display="flex" alignItems="center" gap={1}>
            <WifiTetheringError sx={{ color: "#5384ED" }} />
            <Typography variant="h6" fontWeight={700}>Estado</Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
            <Chip label={overallStatus} color={getStatusColor(overallStatus)} />
            </Box>

            <Box display="flex" ml="auto" gap={2}>
            {services.map((service, index) => (
                <Box key={index} display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle1" fontWeight={600}>{service.name}:</Typography>
                <Chip label={service.status} color={getStatusColor(service.status)} />
                </Box>
            ))}
            </Box>
        </Box>
    );
};

export default DomibusStats;
