import { useGetList } from "react-admin";
import { Box, Grid, Typography, CardContent, Card, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CheckCircle, Warning, Cancel, CardMembership } from '@mui/icons-material';
import { useState } from "react";

const StatCard = ({ icon, title, value, color, onClick, isSelected }: { icon: React.ReactNode, title: string, value: any, color?: string, onClick?: () => void, isSelected?: boolean }) => {
    const theme = useTheme();
    return (
        <Card onClick={onClick} sx={{
            height: 60, display: "flex", alignItems: "center",
            border: `1px solid ${theme.palette.divider}`,
            borderLeft: `5px solid ${color || theme.palette.primary.main}`,
            cursor: "pointer", "&:hover": { boxShadow: theme.shadows[2], backgroundColor: theme.palette.action.hover }
        }}>
            <CardContent sx={{ height: "100%", width: "100%", p: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <Box display="flex" alignItems="center" justifyContent="flex-start" gap={2}>
                    {icon}
                    <Box display="flex" flexDirection="row" alignItems="center" gap={1} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}:</Typography>
                        <Typography variant="h6" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const CertificatesStats = () => {
    const theme = useTheme();
    const { data, isLoading, isError } = useGetList("certificates");
    const [filter, setFilter] = useState<string | null>(null);

    if (isLoading) return <CircularProgress />;
    if (isError || !data) return <Typography color="error">Erro ao carregar os dados.</Typography>;

    const total = data.length;
    const active = data.filter(cert => cert.is_active).length;
    const expiring = data.filter(cert =>
        new Date(cert.expiration_date) <= new Date(new Date().setDate(new Date().getDate() + 30)) &&
        cert.is_active
    ).length;
    const expired = data.filter(cert =>
        new Date(cert.expiration_date) < new Date() && !cert.is_active
    ).length;

    const filteredData = filter === "active"
        ? data.filter(cert => cert.is_active)
        : filter === "expiring"
        ? data.filter(cert =>
            new Date(cert.expiration_date) <= new Date(new Date().setDate(new Date().getDate() + 30)) &&
            cert.is_active
        )
        : filter === "expired"
        ? data.filter(cert =>
            new Date(cert.expiration_date) < new Date() && !cert.is_active
        )
        : data;

    return (
        <Box
            sx={{
                borderRadius: 2,
                p: 2,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                boxShadow: 3,
                borderTop: "5px solid #5384ED",
                maxWidth: "100%",
            }}
        >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CardMembership color="primary" sx={{ color: "#5384ED" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Certificados
                </Typography>
            </Box>

            <Grid container spacing={1}>
                {[
                    { icon: <CardMembership sx={{ color: "#00B3E6" }} fontSize="large" />, title: "Total", value: total, color: "#00B3E6", filterKey: null },
                    { icon: <CheckCircle color="success" fontSize="large" />, title: "Ativos", value: active, color: "#2e7d32", filterKey: "active" },
                    { icon: <Cancel color="error" fontSize="large" />, title: "Expirados", value: expired, color: "#d32f2f", filterKey: "expired" },
                    { icon: <Warning color="warning" fontSize="large" />, title: "A expirar", value: expiring, color: "#ff9800", filterKey: "expiring" }
                ].map((stat, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <StatCard
                            {...stat}
                            onClick={() => setFilter(stat.filterKey)}
                            isSelected={filter === stat.filterKey}
                        />
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Box
                        sx={{
                            p: 2,
                            height: 120,
                            overflowY: 'auto',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: '8px',
                            backgroundColor: theme.palette.background.paper
                        }}
                    >
                        {filteredData.length > 0 ? (
                            filteredData.map((cert) => {
                                const isExpiring = cert.is_active && new Date(cert.expiration_date) <= new Date(new Date().setDate(new Date().getDate() + 30));
                                return (
                                    <Box
                                        key={cert.id}
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        borderBottom={`1px solid ${theme.palette.divider}`}
                                        py={0.8}
                                    >
                                        <Typography variant="body2" sx={{ flex: 3 }}>{cert.name || '-'}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ flex: 1, textAlign: 'left' }}>
                                            {new Date(cert.expiration_date).toLocaleDateString() || '-'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ flex: 1, textAlign: 'right' }}>
                                            {isExpiring ? '🟠' : cert.is_active ? '🟢' : '🔴'}
                                        </Typography>
                                    </Box>
                                );
                            })
                        ) : (
                            <Typography variant="body2">No Certificates found.</Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CertificatesStats;
