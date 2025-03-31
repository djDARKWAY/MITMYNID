import { List, Datagrid, TextField, FunctionField, SimpleList, usePermissions, DateField, WithRecord } from "react-admin";
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { CertificatesFilters } from "./CertificatesFilter";
import { Edit, Delete } from '@mui/icons-material';
import CustomButtonToolTip, { commonListCSS } from "../../components/general/CustomButtonToolTip";
import CustomConfirmButtonToolTip from "../../components/general/CustomConfirmButtonToolTip";

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
            sx={{ paddingLeft: '10px' }}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => record.id}
                    linkType={"edit"}
                />
            ) : (
                <Datagrid rowClick={false}>
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