import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Chip } from "@mui/material";
import { WifiTetheringError } from "@mui/icons-material";
import { useTranslate, useDataProvider } from "react-admin";

const DomibusStats = () => {
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const translate = useTranslate();
    const dataProvider = useDataProvider();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "NORMAL":
                return "success";
            case "WARNING":
                return "warning";
            case "CRITICAL":
                return "error";
            case "OFFLINE":
                return "default";
            case "CONNECTING":
                return "info";
            default:
                return "default";
        }
    };

    useEffect(() => {
        const fetchDomibusData = async () => {
            try {
                const data = await dataProvider.fetchDomibus("domibus/ext/monitoring/application/status");
                setServices((data && data.services) ? data.services : []);
                setError(null);
            } catch (error) {
                setError(translate('show.dashboard.error_request_failed'));
                setServices([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDomibusData();
    }, [dataProvider, translate]);

    const displayServices = isLoading ? 
        [
            { name: "Domibus", status: "CONNECTING" },
            { name: "JMS", status: "CONNECTING" },
            { name: "Database", status: "CONNECTING" }
        ] : 
        error ? 
        [
            { name: "Domibus", status: "OFFLINE" },
            { name: "JMS", status: "OFFLINE" },
            { name: "Database", status: "OFFLINE" }
        ] : 
        services;

    const overallStatus = isLoading ? 
        "CONNECTING" : 
        error ? 
        "OFFLINE" : 
        displayServices.reduce((status, service) => {
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
                <Typography variant="h6" fontWeight={700}>
                    {translate('show.dashboard.status_title')}
                </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
                {isLoading ? (
                    <CircularProgress size={16} />
                ) : (
                    <Chip 
                        label={translate(
                            error ? 'show.dashboard.status_offline' : 
                            `show.dashboard.status_${overallStatus.toLowerCase()}`
                        )} 
                        color={getStatusColor(overallStatus)} 
                    />
                )}
            </Box>

            <Box display="flex" ml="auto" gap={2}>
                {displayServices.map((service, index) => (
                    <Box key={index} display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {service.name}:
                        </Typography>
                        {service.status === "CONNECTING" ? (
                            <CircularProgress size={16} />
                        ) : (
                            <Chip 
                                label={translate(`show.dashboard.status_${service.status.toLowerCase()}`)} 
                                color={getStatusColor(service.status)}
                            />
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default DomibusStats;
