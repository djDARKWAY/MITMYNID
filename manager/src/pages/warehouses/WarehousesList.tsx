import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { TopToolbar, ListButton, FilterButton } from "react-admin";
import { List, useListContext, usePermissions, useDataProvider } from "react-admin";
import { Card, CardContent, Typography, Grid, Paper, useTheme, Checkbox, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { WarehousesFilters } from "./WarehousesFilter";
import { Delete } from "@mui/icons-material";
import CustomConfirmButtonToolTip from "../../components/general/CustomConfirmButtonToolTip";

const FLAG_BASE_URL = import.meta.env.VITE_FLAG_BASE_URL;

const WarehouseCard = ({ record, selected, onToggle, showCheckboxes }: { 
    record?: { id: number | string; name: string; city: string; district?: string; zip_code: string; country?: { name: string; flag_url?: string } }; 
    selected: boolean; 
    onToggle: (id: number | string) => void;
    showCheckboxes: boolean;
}) => {
    if (!record) return null;

    const location = `${record.city}${record.district ? `, ${record.district}` : ''}`;

    return (
        <Paper elevation={3} sx={{ height: "100%", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "4px", right: "4px", zIndex: 2, display: "flex", gap: "4px" }}>
                {showCheckboxes && (
                    <Checkbox 
                      checked={selected} 
                      onChange={() => onToggle(record.id)} />
                )}
                <CustomConfirmButtonToolTip label={"ra.action.delete"} color="error" icon={<Delete />} id={String(record.id)} resource={"warehouses"} />
            </div>
            <Card sx={{ textDecoration: "none", padding: "4px 4px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }} component={Link} to={`/warehouses/${record.id}/show`}>
                <CardContent sx={{ color: "#ffffff" }}>
                    <Typography variant="h6" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
                        {record.name}
                    </Typography>
                    <Typography variant="body2" color="inherit" sx={{ marginBottom: "4px" }}>
                        {location}
                    </Typography>
                    <Typography variant="body2" color="inherit" sx={{ marginBottom: "4px" }}>
                        {record.zip_code}
                    </Typography>
                </CardContent>
            </Card>
            {record.country?.flag_url && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "69px",
                        height: "52px",
                        backgroundImage: `url(${FLAG_BASE_URL}${record.country.flag_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: 0.6,
                        maskImage: 'linear-gradient(to top left, black 15%, transparent 52%)',
                        WebkitMaskImage: 'linear-gradient(to top left, black 10%, transparent 52%)'
                    }}
                />
            )}
        </Paper>
    );
};

const WarehousesCardList = ({ showCheckboxes, setShowCheckboxes }: { showCheckboxes: boolean; setShowCheckboxes: (value: boolean) => void }) => {
    const { data } = useListContext<{ id: number | string; name: string; city: string; zip_code: string; country?: { name: string } }>();
    const dataProvider = useDataProvider();
    const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);

    const handleToggle = (id: number | string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleBulkDelete = async () => {
        if(window.confirm("Tem certeza que deseja eliminar os registos selecionados?")){
            try {
                await dataProvider.deleteMany("warehouses", { ids: selectedIds });
                setSelectedIds([]);
            } catch (error) {
                console.error("Erro ao eliminar em massa:", error);
            }
        }
    };

    return (
        <>
            <Grid container spacing={2} sx={{ padding: '20px' }}>
                {data?.map(record => (
                    <Grid item key={record.id} xs={12} sm={6} md={4} lg={3}>
                        <WarehouseCard 
                          record={record} 
                          selected={selectedIds.includes(record.id)} 
                          onToggle={handleToggle} 
                          showCheckboxes={showCheckboxes} />
                    </Grid>
                ))}
            </Grid>
            {showCheckboxes && selectedIds.length > 0 && (
                <Button variant="contained" color="error" sx={{ margin: "20px" }} onClick={handleBulkDelete}>
                    Delete Selected
                </Button>
            )}
        </>
    );
};

export const WarehousesList = () => {
    const { permissions } = usePermissions();
    const theme = useTheme();
    const navigate = useNavigate();
    const [showCheckboxes, setShowCheckboxes] = useState(false);

    return (
        <List
            resource="warehouses"
            filters={WarehousesFilters(permissions)}
            queryOptions={{ refetchOnWindowFocus: false }}
            pagination={<CustomPagination />}
            perPage={perPageDefault}
            empty={<CustomEmptyPage />}
            exporter={false}
            title="resources.warehouses.name"
            sx={{ paddingLeft: "10px" }}
            actions={
                <TopToolbar>
                    <Button 
                        onClick={() => setShowCheckboxes(!showCheckboxes)}
                        sx={{ 
                            textTransform: "none", 
                            marginLeft: "10px", 
                            color: theme.palette.primary.main, 
                            backgroundColor: "transparent", 
                            "&:hover": { backgroundColor: "transparent" } 
                        }}
                    >
                        {showCheckboxes ? "Desativar seleção múltipla" : "Ativar seleção múltipla"}
                    </Button>
                    <FilterButton />
                    <ListButton label="Criar" icon={<AddIcon />} />
                    <Button 
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/warehouses-map")}
                        sx={{ textTransform: "none", marginLeft: "10px" }}
                    >
                        Ver Mapa
                    </Button>
                </TopToolbar>
            }
        >
            <WarehousesCardList showCheckboxes={showCheckboxes} setShowCheckboxes={setShowCheckboxes} />
        </List>
    );
};