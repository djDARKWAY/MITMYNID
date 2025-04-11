import { useGetList } from "react-admin";
import { Box, Grid, Typography, CardContent, Card, CircularProgress } from "@mui/material";
import { Warehouse, LocationCity, Public } from "@mui/icons-material";

const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: any, color?: string }) => (
    <Card sx={{ height: 128, display: "flex", alignItems: "center", borderLeft: `5px solid ${color || "#5384ED"}` }}>
        <CardContent sx={{ height: "100%", width: "100%", p: 1.5 }}>
            <Box display="flex" alignItems="center" gap={2}>
                {icon}
                <Box>
                    <Typography variant="subtitle2" color="text.secondary">{title}:</Typography>
                    <Typography variant="h6">{value}</Typography>
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const WarehousesStats = () => {
    const { data, isLoading, isError } = useGetList("warehouses");

    if (isLoading) return <CircularProgress />;
    if (isError || !data) return <Typography color="error">Erro ao carregar os dados.</Typography>;

    const total = data.length;
    const countriesWithWarehouses = new Set(data.map(warehouse => warehouse.country?.name).filter(Boolean)).size;

    return (
        <Box sx={{ borderRadius: 2, p: 2, backgroundColor: "rgba(255, 255, 255, 0.1)", boxShadow: 3, borderTop: "5px solid #5384ED"}}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Warehouse color="primary" sx={{ color: "#5384ED" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Armazéns</Typography>
            </Box>

            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <StatCard
                        icon={<LocationCity sx={{ color: "#00B3E6" }} fontSize="large" />}
                        title="Total de Armazéns"
                        value={total}
                        color="#00B3E6"
                    />
                </Grid>
                <Grid item xs={6}>
                    <StatCard
                        icon={<Public sx={{ color: "#FF9800" }} fontSize="large" />}
                        title="Países"
                        value={countriesWithWarehouses}
                        color="#FF9800"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default WarehousesStats;
