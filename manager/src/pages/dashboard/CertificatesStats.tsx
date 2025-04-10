import { useGetList } from "react-admin";
import { Box, Grid, Typography, CardContent, Card, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CheckCircle, Warning, Cancel, CardMembership } from '@mui/icons-material';

const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: any, color?: string, onClick?: () => void }) => {
    const theme = useTheme();
    return (
        <Card sx={{
            height: 80, display: "flex", alignItems: "center",
            border: `1px solid ${theme.palette.divider}`,
            borderLeft: `5px solid ${color || theme.palette.primary.main}`
        }}>
            <CardContent sx={{ height: "100%" }}>
                <Box display="flex" alignItems="center" gap={2}>
                    {icon}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
                        <Typography variant="h6">{value}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const CertificatesStats = () => {
    const { data, isLoading, isError } = useGetList("certificates");

    if (isLoading) return <CircularProgress />;
    if (isError || !data) return <Typography color="error">Erro ao carregar os dados.</Typography>;

    const active = data.filter(cert => cert.is_active).length;
    const expiring = data.filter(cert =>
        new Date(cert.expiration_date) <= new Date(new Date().setDate(new Date().getDate() + 30)) &&
        cert.is_active
    ).length;
    const expired = data.filter(cert =>
        new Date(cert.expiration_date) < new Date() && !cert.is_active
    ).length;

    return (
        <Box
            sx={{
                borderRadius: 2,
                p: 2,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                boxShadow: 3,
                borderTop: "5px solid #5384ED",
                maxWidth: "50%",
            }}
        >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CardMembership color="primary" sx={{ color: "#5384ED"}} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Certificados
                </Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <StatCard
                        icon={<CheckCircle color="success" fontSize="large" />}
                        title="Ativos"
                        value={active}
                        color="#2e7d32"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        icon={<Warning color="warning" fontSize="large" />}
                        title="A expirar"
                        value={expiring}
                        color="#ff9800"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        icon={<Cancel color="error" fontSize="large" />}
                        title="Expirados"
                        value={expired}
                        color="#d32f2f"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default CertificatesStats;
