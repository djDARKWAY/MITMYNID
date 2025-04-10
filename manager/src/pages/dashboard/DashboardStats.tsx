import { useGetList, useRedirect } from "react-admin";
import { Card, CardContent, Typography, Box, Grid, CircularProgress, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { CellTower, CheckCircle, Cancel } from '@mui/icons-material';

const StatCard = ({ icon, title, value, color, onClick }: { icon: React.ReactNode, title: string, value: any, color?: string, onClick: () => void }) => {
    const theme = useTheme();

    return (
    <Card
        onClick={onClick}
        sx={{
            height: 70,
            display: "flex",
            alignItems: "center",
            border: `1px solid ${theme.palette.divider}`,
            borderLeft: `5px solid ${color || theme.palette.primary.main}`,
            cursor: "pointer",
            "&:hover": {
                boxShadow: theme.shadows[2],
                backgroundColor: theme.palette.action.hover,
          },
        }}
    >
        <CardContent sx={{ height: "125%" }}>
            <Box display="flex" alignItems="center" gap={2}>
                {icon}
                <Box>
                    <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
                    <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>{value}</Typography>
                </Box>
            </Box>
        </CardContent>
    </Card>
    );
};

const DashboardStats = () => {
    const { data, isLoading, isError } = useGetList("access-points", {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: "id", order: "ASC" },
        filter: {}
    });

    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const theme = useTheme();
    const redirect = useRedirect();

    if (isLoading) return <CircularProgress />;
    if (isError || !data) return <Typography color="error">Erro ao carregar estatísticas dos Access Points.</Typography>;

    const total = data.length;
    const ativos = data.filter(ap => ap.is_active).length;
    const inativos = total - ativos;

    const filteredData = 
        filter === 'active' ? data.filter(ap => ap.is_active) :
        filter === 'inactive' ? data.filter(ap => !ap.is_active) :
        data;

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <StatCard
                        icon={<CellTower color="primary" fontSize="large" />}
                        title="Total"
                        value={total}
                        color="#1976d2"
                        onClick={() => setFilter('all')}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        icon={<CheckCircle color="success" fontSize="large" />}
                        title="Ativos"
                        value={`${ativos} (${total > 0 ? ((ativos / total) * 100).toFixed(1) : "0"}%)`}
                        color="#2e7d32"
                        onClick={() => setFilter('active')}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        icon={<Cancel color="error" fontSize="large" />}
                        title="Inativos"
                        value={`${inativos} (${total > 0 ? ((inativos / total) * 100).toFixed(1) : "0"}%)`}
                        color="#d32f2f"
                        onClick={() => setFilter('inactive')}
                    />
                </Grid>
            </Grid>

            <Box mt={2}>
                <Box
                    sx={{
                        p: 2,
                        maxHeight: 186,
                        overflowY: 'auto',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '8px',
                        backgroundColor: theme.palette.background.default
                    }}
                >
                    {filteredData.length > 0 ? (
                        filteredData.map((ap) => (
                            <Box
                                key={ap.id}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                borderBottom={`1px solid ${theme.palette.divider}`}
                                py={0.8}
                            >
                                <Typography variant="body2">{ap.location_description}</Typography>
                                <Typography variant="body2">{ap.is_active ? '🟢' : '🔴'}</Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2">Nenhum access point encontrado.</Typography>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default DashboardStats;
