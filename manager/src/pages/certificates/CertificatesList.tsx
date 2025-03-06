import { List, Datagrid, TextField, FunctionField, SimpleList, usePermissions, DateField } from "react-admin";
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { CertificatesFilters } from "./CertificatesFilter";

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
                <Datagrid rowClick="show">
                    <TextField source="name" label="resources.certificates.fields.name" />
                    <TextField source="file_path" label="resources.certificates.fields.file_path" />
                    <DateField source="issue_date" label="resources.certificates.fields.issue_date" />
                    <DateField source="expiration_date" label="resources.certificates.fields.expiration_date" />
                    <TextField source="issuer_name" label="resources.certificates.fields.issuer_name" />
                    <FunctionField source="is_expired" label="resources.certificates.fields.is_expired" render={record => record.is_expired ? '🔴' : '🟢'} />
                </Datagrid>
            )}
        </List>
    );
};