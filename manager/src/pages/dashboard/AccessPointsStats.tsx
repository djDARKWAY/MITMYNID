import { useGetList } from "react-admin";
import { Card, CardContent, Typography, Box, Grid, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { CellTower, CheckCircle, Cancel } from '@mui/icons-material';
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

const DashboardStats = () => {
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
                    'rgba(46, 125, 50, 0.6)',
                    'rgba(211, 47, 47, 0.6)',
                ],
                borderColor: [
                    'rgba(46, 125, 50, 1)',
                    'rgba(211, 47, 47, 1)',
                ],
                hoverBackgroundColor: [
                    'rgba(46, 125, 50, 0.9)',
                    'rgba(211, 47, 47, 0.9)',
                ],
                hoverBorderColor: [
                    'rgba(46, 125, 50, 1)',
                    'rgba(211, 47, 47, 1)',
                ],
                borderWidth: 1,
                hoverBorderWidth: 3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        let totalValue = 0;
                        chartData.datasets[0].data.forEach((value: number) => {
                            totalValue += value;
                        });
                        let percentage = (tooltipItem.raw / totalValue) * 100;
                        return ` ${tooltipItem.label}: ${percentage.toFixed(2)}%`;
                    },
                },
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: {
                    weight: 'bold' as const,
                    size: 14,
                },
                bodyFont: {
                    size: 12,
                },
            },
            legend: {
                position: 'bottom' as const,
                labels: {
                    fontColor: '#666',
                    boxWidth: 12,
                    padding: 20,
                },
            },
            title: {
                display: true,
                text: 'Access Points Status',
                fontSize: 16,
                fontColor: '#333',
                fontStyle: 'bold',
            },
        },
        animation: {
            animateRotate: true,
            animateScale: true,
        },
        cutout: '70%',
    };

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12} md={8.5}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                icon={<CellTower color="primary" fontSize="large" />}
                                title="Total"
                                value={<Typography variant="subtitle1">{total}</Typography>}
                                color="#1976d2"
                                onClick={() => setFilter('all')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                icon={<CheckCircle color="success" fontSize="large" />}
                                title="Active"
                                value={<Typography variant="subtitle1">{active}</Typography>}
                                color="#2e7d32"
                                onClick={() => setFilter('active')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                icon={<Cancel color="error" fontSize="large" />}
                                title="Inactive"
                                value={<Typography variant="subtitle1">{inactive}</Typography>}
                                color="#d32f2f"
                                onClick={() => setFilter('inactive')}
                            />
                        </Grid>

                        <Grid item xs={12}>
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
                                            <Typography variant="body2" sx={{ flex: 4 }}>{ap.warehouse?.name || '-'}</Typography>
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
        </>
    );
};

export default DashboardStats;
