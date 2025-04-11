import { useGetList, useTranslate } from "react-admin";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ListAlt } from "@mui/icons-material";

const LogsStats = () => {
    const theme = useTheme();
    const translate = useTranslate();
    const { data, isLoading, isError } = useGetList("logs", { pagination: { page: 1, perPage: 5 }, sort: { field: "timestamp", order: "DESC" } });

    if (isLoading) return <CircularProgress />;
    if (isError || !data) return <Typography color="error">{translate('show.dashboard.error_loading_logs')}</Typography>;

    const getBackgroundColor = (logType: string) => {
        switch (logType) {
            case "INFO": return "#90A4AE";
            case "ERROR": return "#F44336";
            case "WARNING": return "#FFA500";
            case "DEBUG": return "#505050";
            case "SECURITY": return "#2196F3";
            case "AUDIT": return "#4CAF50";
            default: return "#000000";
        }
    };

    return (
        <Box sx={{ borderRadius: 2, p: 2, backgroundColor: "rgba(255, 255, 255, 0.1)", boxShadow: 3, borderTop: "5px solid #5384ED" }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <ListAlt color="primary" sx={{ color: "#5384ED" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {translate('show.dashboard.logs_title')}
                </Typography>
            </Box>

            <Box sx={{ p: 2, height: 145, border: `1px solid ${theme.palette.divider}`, borderRadius: "8px", backgroundColor: theme.palette.background.paper }}>
                {data.length > 0 ? (
                    data.slice(0, 3).map((log) => (
                        <Box
                            key={log.id}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`1px solid ${theme.palette.divider}`}
                            py={0.8}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "100px",
                                    height: "23px",
                                    borderRadius: "8px",
                                    backgroundColor: getBackgroundColor(log.type?.type || "UNKNOWN"),
                                    color: "#fff",
                                    fontWeight: "bold",
                                    fontSize: "0.7rem",
                                    textTransform: "uppercase",
                                    mr: 1,
                                }}
                            >
                                {translate(`show.dashboard.log_type.${log.type?.type?.toLowerCase() || "unknown"}`)}
                            </Box>
                            <Typography variant="body2" sx={{ flex: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {log.message || "-"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ flex: 1, textAlign: "right" }}>
                                {new Date(log.timestamp).toLocaleString("pt-PT", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })}
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2">{translate('show.dashboard.no_logs_found')}</Typography>
                )}
            </Box>
        </Box>
    );
};

export default LogsStats;
