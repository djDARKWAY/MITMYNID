import { useGetList } from "react-admin";
import { Card, CardContent, Typography, Box, Grid, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { CellTower, CheckCircle, Cancel, Hub } from '@mui/icons-material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatCard = ({ icon, title, value, color, onClick }: { icon: React.ReactNode, title: string, value: any, color?: string, onClick: () => void }) => {
    const theme = useTheme();
    return (
        <Card onClick={onClick} sx={{
            height: 60, display: "flex", alignItems: "center",
            border: `1px solid ${theme.palette.divider}`,
            borderLeft: `5px solid ${color || theme.palette.primary.main}`,
            cursor: "pointer", "&:hover": { boxShadow: theme.shadows[2], backgroundColor: theme.palette.action.hover }
        }}>
            <CardContent sx={{ height: "140%" }}>
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

const AccessPointsStats = () => {
    const { data, isLoading, isError } = useGetList("access-points");
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const theme = useTheme();

    if (isLoading) return <CircularProgress />;
    if (isError || !data) return <Typography color="error">Error loading statistics.</Typography>;

    const total = data.length;
    const active = data.filter(ap => ap.is_active).length;
    const inactive = total - active;

    const filteredData = filter === 'all' ? data : data.filter(ap => (filter === 'active' ? ap.is_active : !ap.is_active));

    const chartData = {
        labels: ['Active', 'Inactive'],
        datasets: [
            {
                label: 'Access Points',
                data: [active, inactive],
                backgroundColor: [
                    'rgba(102, 187, 106, 0.6)',
                    'rgba(211, 47, 47, 0.6)',
                ],
                borderColor: [
                    'rgba(102, 187, 106, 1)',
                    'rgba(211, 47, 47, 1)',
                ],
                hoverBackgroundColor: [
                    'rgba(102, 187, 106, 1)',
                    'rgba(211, 47, 47, 1)',
                ],
                hoverBorderColor: [
                    'rgba(102, 187, 106, 1)',
                    'rgba(211, 47, 47, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: ({ raw, label }: any) => {
                        const total = chartData.datasets[0].data.reduce((sum, val) => sum + val, 0);
                        return ` ${label}: ${(raw / total * 100).toFixed(2)}%`;
                    },
                },
                bodyFont: { size: 12 },
            },
            legend: {
                position: 'bottom' as const,
                labels: { boxWidth: 12, padding: 20, color: theme.palette.text.primary },
            },
            title: {
                display: true,
                font: { size: 16, weight: 700 },
                color: theme.palette.text.primary,
            },
        },
        animation: { animateRotate: true, animateScale: true },
        cutout: '70%',
    };

    return (
        <Box
            sx={{
                borderRadius: 2,
                p: 2,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                boxShadow: 3,
                borderTop: "5px solid #5384ED"
            }}
        >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CellTower color="primary" sx={{ color: "#5384ED"}} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Pontos de Acesso
                </Typography>
            </Box>

            <Grid container spacing={1}>
                <Grid item xs={12} md={8.5}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={4}><StatCard icon={<Hub color="primary" fontSize="large" sx={{ color: "#00B3E6"}} />} title="Total" value={<Typography variant="subtitle1">{total}</Typography>} color="#00B3E6" onClick={() => setFilter('all')} /></Grid>
                        <Grid item xs={12} md={4}><StatCard icon={<CheckCircle color="success" fontSize="large" />} title="Active" value={<Typography variant="subtitle1">{active}</Typography>} color="#2e7d32" onClick={() => setFilter('active')} /></Grid>
                        <Grid item xs={12} md={4}><StatCard icon={<Cancel color="error" fontSize="large" />} title="Inactive" value={<Typography variant="subtitle1">{inactive}</Typography>} color="#d32f2f" onClick={() => setFilter('inactive')} /></Grid>

                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    p: 2,
                                    height: 185,
                                    overflowY: 'auto',
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '8px',
                                    backgroundColor: theme.palette.background.paper
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
                                            <Typography variant="body2" sx={{ flex: 3 }}>{ap.warehouse?.name || '-'}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ flex: 1, textAlign: 'left' }}>{ap.ip_address || '-'}</Typography>
                                            <Typography variant="body2" sx={{ flex: 1, textAlign: 'right' }}>{ap.is_active ? '🟢' : '🔴'}</Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2">No Access Points found.</Typography>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={3.5} sx={{ height: '100%' }}>
                    <Card sx={{ height: '100%', border: `1px solid ${theme.palette.divider}`, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ height: 221, width: '100%' }}>
                            <Doughnut data={chartData} options={chartOptions} />
                        </div>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AccessPointsStats;
