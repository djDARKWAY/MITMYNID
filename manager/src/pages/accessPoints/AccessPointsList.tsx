import { List, Datagrid, TextField, FunctionField, SimpleList, usePermissions, ReferenceField, WithRecord, CreateButton, TopToolbar, useDataProvider, useTranslate, FilterButton, useListContext } from "react-admin";
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { AccessPointsFilters } from "./AccessPointsFilter";
import { Edit, Delete } from '@mui/icons-material';
import CustomButtonToolTip, { commonListCSS } from "../../components/general/CustomButtonToolTip";
import CustomConfirmButtonToolTip from "../../components/general/CustomConfirmButtonToolTip";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const exportToPDF = (data: any[], translate: (key: string) => string, hasFilters: boolean = false) => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-PT').replace(/\//g, '-');
    const formattedTime = currentDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const title = translate("show.accessPoints.pdf.title");
    const subtitle = `${formattedDate} ${formattedTime}`;

    doc.addImage('/MMN_V_RGB_PNG.png', 'SVG', pageWidth - 29, 10, 19, 15);
    doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 25);
    doc.setFontSize(10).setTextColor(150).text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 31);

    autoTable(doc, {
        startY: 41,
        head: [[
            translate("show.accessPoints.pdf.warehouse"),
            translate("show.accessPoints.pdf.location"),
            "IPv4",
            translate("show.accessPoints.pdf.inactive")
        ]],
        body: data.map(item => [
            item.warehouse?.name || "—",
            item.location_description,
            item.ip_address,
            item.is_active ? "" : "X",
        ]),
        headStyles: { fillColor: [83, 132, 237] },
        columnStyles: { 3: { halign: 'center' } },
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

    doc.save(`access-points${hasFilters ? '-filtered' : ''}-${formattedDate}.pdf`);
};

const ListActions = () => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const { filterValues } = useListContext();
    
    const handleExportPDF = async () => {
        const hasActiveFilters = Object.keys(filterValues).length > 0;
        
        const { data } = await dataProvider.getList('access-points', {
            pagination: { page: 1, perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: filterValues,
        });
        
        exportToPDF(data, translate, hasActiveFilters);
    };

    return (
        <TopToolbar>
            <CreateButton />
            <FilterButton />
            <Button
                startIcon={<DownloadIcon />}
                onClick={handleExportPDF}
                color="primary"
                variant="text"
                sx={{
                    textTransform: 'none', fontWeight: 'bold', fontSize: '14px', color: '#90CAF9', '&:hover': { backgroundColor: 'rgba(144, 202, 249, 0.04)' },
                }}
            >
                {translate("show.accessPoints.pdf.export")}
            </Button>
        </TopToolbar>
    );
};

export const AccessPointsList = () => {
    const { permissions } = usePermissions();
    const isSmall = useMediaQuery(useTheme().breakpoints.down('lg'));

    return (
        <List
            resource="access-points"
            filters={AccessPointsFilters(permissions)}
            queryOptions={{ refetchOnWindowFocus: false }}
            pagination={<CustomPagination />}
            perPage={perPageDefault}
            empty={<CustomEmptyPage />}
            exporter={false}
            title="resources.accessPoints.name"
            actions={<ListActions />}
            sx={{ paddingLeft: '10px' }}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.location_description}
                    secondaryText={record => record.ip_address}
                    linkType={"edit"}
                />
            ) : (
                <Datagrid rowClick={"show"}>
                    <ReferenceField source="warehouse_id" reference="warehouses" label="resources.accessPoints.fields.warehouse_id" link={false}>
                        <TextField source="name" />
                    </ReferenceField>
                    <TextField source="location_description" label="resources.accessPoints.fields.location_description" />
                    <TextField source="ip_address" label="resources.accessPoints.fields.ip_address" />
                    <TextField source="ap_software" label="resources.accessPoints.fields.ap_software" />
                    <FunctionField source="is_active" label="resources.accessPoints.fields.is_active" render={record => record.is_active ? '🟢' : '🔴'} />
                    <WithRecord render={(record) => (
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                            <span onClick={(event) => event.stopPropagation()}>
                                <CustomButtonToolTip
                                    id={record.id}
                                    resource={"access-points"}
                                    action={"redirect"}
                                    label={"ra.action.edit"}
                                    icon={<Edit />}
                                    sx={commonListCSS}
                                />
                                <CustomConfirmButtonToolTip
                                    id={record.id}
                                    resource={"access-points"}
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
