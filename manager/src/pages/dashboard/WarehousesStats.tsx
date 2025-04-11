import { useGetList } from "react-admin";
import { Box, Grid, Typography, CardContent, Card, CircularProgress, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Warehouse, LocationCity, Public, HomeWork } from "@mui/icons-material";

const formatDate = (dateString?: string): Date => new Date(dateString || Date.now());

const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: any, color?: string }) => {
    const theme = useTheme();
    return (
        <Card sx={{
            height: 60,
            display: "flex",
            alignItems: "center",
            border: `1px solid ${theme.palette.divider}`,
            borderLeft: `5px solid ${color || theme.palette.primary.main}`,
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

const RecentWarehouseCard = ({ warehouse }: { warehouse: any }) => (
    <Card sx={{ height: "37px", display: "flex", border: "1px solid #E0E0E0", borderRadius: 2 }}>
        <CardContent sx={{ marginTop: "2px", display: "flex", alignItems: "center", justifyContent: "flex-start", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            <Typography variant="subtitle1" fontWeight={500} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{warehouse.name}</Typography>
        </CardContent>
    </Card>
);

const WarehousesStats = () => {
    const { data, isLoading, isError } = useGetList("warehouses");

    if (isLoading) return <CircularProgress />;
    if (isError || !data) return <Typography color="error">Erro ao carregar os dados.</Typography>;

    const stats = {
        total: data.length,
        countries: new Set(data.map(w => w.country?.name).filter(Boolean)).size,
        recent: [...data]
            .sort((a, b) => formatDate(b.last_modified || b.created_date).getTime() - formatDate(a.last_modified || a.created_date).getTime())
            .slice(0, 6)
    };

    return (
        <Box sx={{ borderRadius: 2, p: 2, backgroundColor: "rgba(255, 255, 255, 0.1)", boxShadow: 3, borderTop: "5px solid #5384ED" }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Warehouse color="primary" sx={{ color: "#5384ED" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Armazéns</Typography>
            </Box>

            <Grid container spacing={1}>
                {[
                    { icon: <LocationCity sx={{ color: "#00B3E6" }} fontSize="large" />, title: "Armazéns", value: stats.total, color: "#00B3E6" },
                    { icon: <Public sx={{ color: "#FF9800" }} fontSize="large" />, title: "Países", value: stats.countries, color: "#FF9800" }
                ].map((stat, index) => (
                    <Grid item xs={6} key={index}>
                        <StatCard {...stat} />
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight={600} mb={1} sx={{ marginTop: "-1px" }}> Últimas atualizações: </Typography>
            <Grid container spacing={1}>
                {stats.recent.map((warehouse) => (
                    <Grid item xs={12} sm={6} md={6} key={warehouse.id}>
                        <RecentWarehouseCard warehouse={warehouse} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default WarehousesStats;
