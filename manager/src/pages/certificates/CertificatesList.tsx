import { List, Datagrid, TextField, FunctionField, SimpleList, usePermissions, DateField, WithRecord, TopToolbar, FilterButton, useTranslate, useListContext, useDataProvider } from "react-admin";
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button } from '@mui/material';
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { CertificatesFilters } from "./CertificatesFilter";
import { Edit, Delete } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import CustomButtonToolTip, { commonListCSS } from "../../components/general/CustomButtonToolTip";
import CustomConfirmButtonToolTip from "../../components/general/CustomConfirmButtonToolTip";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportToPDF = (data: any[], translate: (key: string) => string, hasFilters: boolean = false) => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-PT').replace(/\//g, '-');
    const formattedTime = currentDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const title = translate("show.certificates.pdf.title");
    const subtitle = `${formattedDate} ${formattedTime}`;

    doc.addImage('/MMN_V_RGB_PNG.png', 'SVG', pageWidth - 29, 10, 19, 15);
    doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 25);
    doc.setFontSize(10).setTextColor(150).text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 31);

    autoTable(doc, {
        startY: 41,
        head: [[
            translate("show.certificates.pdf.name"),
            translate("show.certificates.pdf.issuer"),
            translate("show.certificates.pdf.issueDate"),
            translate("show.certificates.pdf.expirationDate"),
            translate("show.certificates.pdf.inactive")
        ]],
        body: data.map(item => {
            const issueDate = item.issue_date ? new Date(item.issue_date).toLocaleDateString('pt-PT') : "—";
            const expirationDate = item.expiration_date ? new Date(item.expiration_date).toLocaleDateString('pt-PT') : "—";
            
            return [
                item.name || "—",
                item.issuer_name || "—",
                issueDate,
                expirationDate,
                item.is_active ? "" : "X",
            ];
        }),
        headStyles: { fillColor: [83, 132, 237] },
        columnStyles: { 4: { halign: 'center' } },
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

    doc.save(`certificates${hasFilters ? '-filtered' : ''}-${formattedDate}.pdf`);
};

const ListActions = () => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const { filterValues } = useListContext();
    
    const handleExportPDF = async () => {
        const hasActiveFilters = Object.keys(filterValues).length > 0;
        
        const { data } = await dataProvider.getList('certificates', {
            pagination: { page: 1, perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
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
                {translate("show.certificates.pdf.export")}
            </Button>
        </TopToolbar>
    );
};

export const CertificatesList = () => {
    const { permissions } = usePermissions();
    const isSmall = useMediaQuery(useTheme().breakpoints.down('lg'));

    return (
        <List
            resource="certificates"
            filters={CertificatesFilters(permissions)}
            queryOptions={{ refetchOnWindowFocus: false }}
            pagination={<CustomPagination />}
            perPage={perPageDefault}
            empty={<CustomEmptyPage />}
            exporter={false}
            title="resources.certificates.name"
            actions={<ListActions />}
            sx={{ paddingLeft: '10px' }}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => record.id}
                    linkType={"edit"}
                />
            ) : (
                <Datagrid rowClick="show">
                    <TextField source="name" label="resources.certificates.fields.name" />
                    <TextField source="file_path" label="resources.certificates.fields.file_path" />
                    <TextField source="issuer_name" label="resources.certificates.fields.issuer_name" />
                    <DateField source="issue_date" label="resources.certificates.fields.issue_date" />
                    <DateField source="expiration_date" label="resources.certificates.fields.expiration_date" />
                    <FunctionField source="is_active" label="resources.certificates.fields.is_active" render={record => record.is_active ? '🟢' : '🔴'} />
                    <WithRecord render={(record) => (
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                            <span onClick={(event) => event.stopPropagation()}>
                                <CustomButtonToolTip
                                    id={record.id}
                                    resource={"certificates"}
                                    action={"redirect"}
                                    label={"ra.action.edit"}
                                    icon={<Edit />}
                                    sx={commonListCSS}
                                />
                                <CustomConfirmButtonToolTip
                                    id={record.id}
                                    resource={"certificates"}
                                    label={"ra.action.delete"}
                                    icon={<Delete />}
                                    color="error"
                                    sx={commonListCSS}
                                />
                            </span>
                        </div>
                    )} />
                </Datagrid>
            )}
        </List>
    );
};