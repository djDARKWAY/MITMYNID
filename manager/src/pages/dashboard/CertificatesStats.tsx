import { useGetList, useTranslate } from "react-admin";
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
            <CardContent sx={{ height: "110%" }}>
                <Box display="flex" alignItems="center" gap={1}>
                    {icon}
                    <Box>
                        <Typography variant="h6">{value}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const CertificatesStats = () => {
    const theme = useTheme();
    const translate = useTranslate();
    const { data, isLoading, isError } = useGetList("certificates");
    const [filter, setFilter] = useState<string | null>(null);

    if (isLoading) return <CircularProgress />;
    if (isError || !data) return <Typography color="error">{translate('show.dashboard.error_loading_statistics')}</Typography>;

    const stats = {
        total: data.length,
        active: data.filter(cert => cert.is_active).length,
        expiring: data.filter(cert =>
            new Date(cert.expiration_date) <= new Date(new Date().setDate(new Date().getDate() + 30)) &&
            cert.is_active
        ).length,
        expired: data.filter(cert =>
            new Date(cert.expiration_date) < new Date() && !cert.is_active
        ).length,
        filteredData: filter === "active"
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
                    : data
    };

    return (
        <Box sx={{ borderRadius: 2, p: 2, backgroundColor: "rgba(255, 255, 255, 0.1)", boxShadow: 3, borderTop: "5px solid #5384ED" }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CardMembership color="primary" sx={{ color: "#5384ED" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{translate('show.dashboard.certificates_title')}</Typography>
            </Box>

            <Grid container spacing={1}>
                {[
                    { icon: <CardMembership sx={{ color: "#00B3E6" }} fontSize="medium" />, title: translate('show.dashboard.certificates_total'), value: stats.total, color: "#00B3E6", filterKey: null },
                    { icon: <CheckCircle color="success" fontSize="medium" />, title: translate('show.dashboard.status_active'), value: stats.active, color: "#2e7d32", filterKey: "active" },
                    { icon: <Cancel color="error" fontSize="medium" />, title: translate('show.dashboard.status_expired'), value: stats.expired, color: "#d32f2f", filterKey: "expired" },
                    { icon: <Warning color="warning" fontSize="medium" />, title: translate('show.dashboard.status_expiring'), value: stats.expiring, color: "#ff9800", filterKey: "expiring" }
                ].map((stat, index) => (
                    <Grid item xs={3} key={index}>
                        <StatCard
                            {...stat}
                            onClick={() => setFilter(stat.filterKey)}
                            isSelected={filter === stat.filterKey}
                        />
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ p: 2, height: 120, overflowY: 'auto', border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', backgroundColor: theme.palette.background.paper, mt: 1 }}>
                {stats.filteredData.length > 0 ? (
                    stats.filteredData.map((cert) => {
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
                    <Typography variant="body2">{translate('show.dashboard.certificates_no_found')}</Typography>
                )}
            </Box>
        </Box>
    );
};

export default CertificatesStats;
