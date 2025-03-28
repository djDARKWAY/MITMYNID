import React, { useState } from "react";
import { List, useListContext, usePermissions, useDataProvider } from "react-admin";
import { Card, CardContent, Typography, Grid, Paper, useTheme, Checkbox, Button } from "@mui/material";
import { Link } from "react-router-dom";
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { CompaniesFilters } from "./CompaniesFilter";
import { Delete } from "@mui/icons-material";
import CustomConfirmButtonToolTip from "../../components/general/CustomConfirmButtonToolTip";

const FLAG_BASE_URL = import.meta.env.VITE_FLAG_BASE_URL;

const CompanyCard = ({ record, selected, onToggle }: { 
    record?: { id: number | string; name: string; city: string; district?: string; zip_code: string; country?: { name: string; flag_url?: string } }; 
    selected: boolean; 
    onToggle: (id: number | string) => void;
}) => {
    if (!record) return null;

    const location = `${record.city}${record.district ? `, ${record.district}` : ''}`;

    return (
        <Paper elevation={3} sx={{ height: "100%", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "4px", right: "4px", zIndex: 2, display: "flex", gap: "4px" }}>
                <Checkbox 
                  checked={selected} 
                  onChange={() => onToggle(record.id)} 
                  sx={{ backgroundColor: "rgba(255,255,255,0.8)", borderRadius: "4px" }} />
                <CustomConfirmButtonToolTip label={"ra.action.delete"} color="error" icon={<Delete />} id={String(record.id)} resource={"companies"} />
            </div>
            <Card sx={{ textDecoration: "none", padding: "4px 4px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }} component={Link} to={`/companies/${record.id}/show`}>
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

const CompaniesCardList = () => {
    const { data } = useListContext<{ id: number | string; name: string; city: string; zip_code: string; country?: { name: string } }>();
    const dataProvider = useDataProvider();
    const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);

    const handleToggle = (id: number | string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleBulkDelete = async () => {
        if(window.confirm("Tem certeza que deseja eliminar os registos selecionados?")){
            try {
                await dataProvider.deleteMany("companies", { ids: selectedIds });
                setSelectedIds([]);
                // ...opcional: refazer a consulta ou atualizar a lista...
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
                        <CompanyCard 
                          record={record} 
                          selected={selectedIds.includes(record.id)} 
                          onToggle={handleToggle} />
                    </Grid>
                ))}
            </Grid>
            {selectedIds.length > 0 && (
                <Button variant="contained" color="error" sx={{ margin: "20px" }} onClick={handleBulkDelete}>
                    Delete Selected
                </Button>
            )}
        </>
    );
};

export const CompaniesList = () => {
    const { permissions } = usePermissions();
    const theme = useTheme();

    return (
        <List
            resource="companies"
            filters={CompaniesFilters(permissions)}
            queryOptions={{ refetchOnWindowFocus: false }}
            pagination={<CustomPagination />}
            perPage={perPageDefault}
            empty={<CustomEmptyPage />}
            exporter={false}
            title="resources.companies.name"
            sx={{ paddingLeft: "10px" }}
        >
            <CompaniesCardList />
        </List>
    );
};