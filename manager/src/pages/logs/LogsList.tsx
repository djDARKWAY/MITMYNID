import { List, DatagridConfigurable, TextField, FunctionField, SimpleList, usePermissions, useTranslate, TopToolbar, FilterButton, useDataProvider, useListContext } from "react-admin";
import { useTheme, Button } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { LogsFilters } from "./LogsFilter";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DownloadIcon from '@mui/icons-material/Download';

const getBackgroundColor = (logType: string) => {
    switch (logType) {
        case "INFO": return "#90A4AE";
        case "ERROR": return "#F44336";
        case "WARNING": return "#FFA500";
        case "DEBUG": return "#505050";
        case "SECURITY": return "#2196F3";
        case "AUDIT": return "#4CAF50";
        default: return "#000000";
    }
};

const exportToPDF = (data: any[], translate: (key: string) => string, hasFilters: boolean = false) => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-PT').replace(/\//g, '-');
    const formattedTime = currentDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const title = translate("show.logs.pdf.title");
    const subtitle = `${formattedDate} ${formattedTime}`;

    doc.addImage('/MMN_V_RGB_PNG.png', 'SVG', pageWidth - 29, 10, 19, 15);
    doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 25);
    doc.setFontSize(10).setTextColor(150).text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 31);

    autoTable(doc, {
        startY: 41,
        head: [[
            translate("show.logs.pdf.category"),
            translate("show.logs.pdf.timestamp"),
            translate("show.logs.pdf.message")
        ]],
        body: data.map(item => {
            const logType = item.type?.type?.toLowerCase() || "unknown";
            const translatedLogType = translate(`show.dashboard.log_type.${logType}`);
            const formattedTimestamp = new Date(item.timestamp).toLocaleString('pt-PT', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
            
            return [
                translatedLogType,
                formattedTimestamp,
                item.message || "—",
            ];
        }),
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

    doc.save(`logs${hasFilters ? '-filtered' : ''}-${formattedDate}.pdf`);
};

const ListActions = () => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const { filterValues } = useListContext();
    
    const handleExportPDF = async () => {
        const hasActiveFilters = Object.keys(filterValues).length > 0;
        
        const { data } = await dataProvider.getList('logs', {
            pagination: { page: 1, perPage: 1000 },
            sort: { field: 'timestamp', order: 'DESC' },
            filter: filterValues,
        });
        
        exportToPDF(data, translate, hasActiveFilters);
    };

    return (
        <TopToolbar>
            <FilterButton />
            <Button
                startIcon={<DownloadIcon />}
                onClick={handleExportPDF}
                color="primary"
                variant="text"
                sx={{
                    textTransform: 'none', 
                    fontWeight: 'bold', 
                    fontSize: '14px', 
                    color: '#90CAF9', 
                    '&:hover': { backgroundColor: 'rgba(144, 202, 249, 0.04)' },
                }}
            >
                {translate("show.logs.pdf.export")}
            </Button>
        </TopToolbar>
    );
};

export const LogsList = () => {
    const { permissions } = usePermissions();
    const translate = useTranslate();
    const isSmall = useMediaQuery(useTheme().breakpoints.down('lg'));
    
    return (
        <List
            resource="logs"
            filters={LogsFilters(permissions)}
            queryOptions={{ refetchOnWindowFocus: false }}
            pagination={<CustomPagination />}
            perPage={perPageDefault}
            empty={<CustomEmptyPage />}
            exporter={false}
            title="resources.logs.name"
            sx={{ paddingLeft: '10px' }}
            sort={{ field: 'timestamp', order: 'DESC' }}
            actions={<ListActions />}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={record => translate(`show.dashboard.log_type.${record.type?.type?.toLowerCase() || "unknown"}`)}
                    secondaryText={record => record.message}
                    tertiaryText={record => new Date(record.timestamp).toLocaleString()}
                    linkType="show"
                />
            ) : (
                <DatagridConfigurable rowClick="show" bulkActionButtons={false}>
                    <FunctionField
                        label="resources.logs.fields.category" 
                        render={record => {
                            const logType = record.type?.type?.toLowerCase() || "unknown"; 
                            const translatedLogType = translate(`show.dashboard.log_type.${logType}`);

                            return (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100px', height: '23px', borderRadius: '8px', backgroundColor: getBackgroundColor(logType.toUpperCase()), color: '#fff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                                    {translatedLogType}
                                </div>
                            );
                        }}
                    />
                    <FunctionField 
                        label="resources.logs.fields.timestamp"  
                        render={record => (
                            <div>
                                {new Date(record.timestamp).toLocaleString('pt-PT', { 
                                    day: '2-digit', month: '2-digit', year: 'numeric', 
                                    hour: '2-digit', minute: '2-digit', second: '2-digit', 
                                    fractionalSecondDigits: 3 
                                })}
                            </div>
                        )}
                    />
                    <TextField source="message" label="resources.logs.fields.message" />
                </DatagridConfigurable>
            )}
        </List>
    );
};
