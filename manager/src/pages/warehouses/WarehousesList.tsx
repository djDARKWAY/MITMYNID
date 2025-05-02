import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { TopToolbar, CreateButton, FilterButton, useTranslate, useListContext, usePermissions, useDataProvider } from "react-admin";
import { List } from "react-admin";
import { Card, CardContent, Typography, Grid, Paper, useTheme, Checkbox, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { WarehousesFilters } from "./WarehousesFilter";
import { Delete } from "@mui/icons-material";
import CustomConfirmButtonToolTip from "../../components/general/CustomConfirmButtonToolTip";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DownloadIcon from '@mui/icons-material/Download';

const FLAG_BASE_URL = import.meta.env.VITE_FLAG_BASE_URL;

const exportToPDF = (data: any[], translate: (key: string) => string, hasFilters: boolean = false) => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-PT').replace(/\//g, '-');
    const formattedTime = currentDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const title = translate("show.warehouses.pdf.title");
    const subtitle = `${formattedDate} ${formattedTime}`;

    doc.addImage('/MMN_V_RGB_PNG.png', 'SVG', pageWidth - 29, 10, 19, 15);
    doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 25);
    doc.setFontSize(10).setTextColor(150).text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 31);

    console.log(data);
    
    autoTable(doc, {
        startY: 41,
        head: [[
            translate("show.warehouses.pdf.name"),
            translate("show.warehouses.pdf.address"),
            translate("show.warehouses.pdf.country")
        ]],
        body: data.map(item => [
            item.name,
            `${item.address || "—"}, ${item.city}${item.district ? `, ${item.district}` : ""}`,
            item.country?.name || "—",
        ]),
        headStyles: { fillColor: [83, 132, 237] },
        styles: { fontSize: 9, cellPadding: 2 },
        didDrawPage: () => {
            doc.setFontSize(10).setTextColor(150).text(
                `${doc.getCurrentPageInfo().pageNumber}`,
                pageWidth - 20,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'right' }
            );
        }
    });

    doc.save(`warehouses${hasFilters ? '-filtered' : ''}-${formattedDate}.pdf`);
};

const ListActions = () => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const { filterValues } = useListContext();
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const theme = useTheme();
    
    const handleExportPDF = async () => {
        const hasActiveFilters = Object.keys(filterValues).length > 0;
        
        const { data } = await dataProvider.getList('warehouses', {
            pagination: { page: 1, perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: filterValues,
        });
        
        exportToPDF(data, translate, hasActiveFilters);
    };

    return (
        <TopToolbar>
            <Button 
                onClick={() => {
                    setShowCheckboxes(!showCheckboxes);
                }}
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
            <CreateButton label="Criar" icon={<AddIcon />} />
            <Button
                startIcon={<DownloadIcon />}
                onClick={handleExportPDF}
                color="primary"
                variant="text"
                sx={{
                    textTransform: 'none', fontWeight: 'bold', fontSize: '14px', color: '#90CAF9', '&:hover': { backgroundColor: 'rgba(144, 202, 249, 0.04)' },
                }}
            >
                {translate("show.warehouses.pdf.export")}
            </Button>
        </TopToolbar>
    );
};

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
                <Link
                    to={`/warehouses/${record.id}/show`}
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
                        WebkitMaskImage: 'linear-gradient(to top left, black 10%, transparent 52%)',
                        display: "block",
                    }}
                />
            )}
        </Paper>
    );
};

const WarehousesCardList = ({ 
    showCheckboxes, 
    selectedIds, 
    setSelectedIds 
}: { 
    showCheckboxes: boolean; 
    selectedIds: (number | string)[];
    setSelectedIds: React.Dispatch<React.SetStateAction<(number | string)[]>>;
}) => {
    const { data } = useListContext<{ id: number | string; name: string; city: string; zip_code: string; country?: { name: string } }>();

    const handleToggle = (id: number | string) => {
        setSelectedIds((prev: (number | string)[]) => prev.includes(id) ? prev.filter((x: number | string) => x !== id) : [...prev, id]);
    };

    return (
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
    );
};

export const WarehousesList = () => {
    const { permissions } = usePermissions();
    const theme = useTheme();
    const navigate = useNavigate();
    const dataProvider = useDataProvider();
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);

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
        <Box sx={{ position: 'relative', minHeight: '100%' }}>
            <List
                resource="warehouses"
                filters={WarehousesFilters(permissions)}
                queryOptions={{ refetchOnWindowFocus: false }}
                pagination={<CustomPagination />}
                perPage={perPageDefault}
                empty={<CustomEmptyPage />}
                exporter={false}
                title="resources.warehouses.name"
                sx={{ paddingLeft: "10px", paddingBottom: showCheckboxes && selectedIds.length > 0 ? '70px' : '0' }}
                actions={<ListActions />}
            >
                <WarehousesCardList 
                    showCheckboxes={showCheckboxes} 
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                />
            </List>
            
            {showCheckboxes && selectedIds.length > 0 && (
                <Box 
                    sx={{ 
                        position: 'fixed', 
                        bottom: 0, 
                        left: 0, 
                        right: 0, 
                        padding: '16px', 
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: '0px -2px 4px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleBulkDelete}
                    >
                        Delete Selected ({selectedIds.length})
                    </Button>
                </Box>
            )}
        </Box>
    );
};