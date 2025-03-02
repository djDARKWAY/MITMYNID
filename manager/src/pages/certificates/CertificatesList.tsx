import { List, Datagrid, TextField, DateField, SimpleList, useGetList, usePermissions, FunctionField } from "react-admin";
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { useEffect } from 'react';
import { CertificatesFilters } from "./CertificatesFilter";

export const CertificatesList = () => {
    const { permissions } = usePermissions();
    const isSmall = useMediaQuery(useTheme().breakpoints.down('lg'));
    const { data, isLoading, error } = useGetList('certificates');

    useEffect(() => {
        if (!isLoading && data) {
            console.log('Certificates data:', data);
            console.log('Total certificates:', data.length);
        }
        if (error) {
            console.error('Error loading certificates:', error);
        }
    }, [data, isLoading, error]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    console.log('Data passed to Datagrid:', data);

    return (
        <List
            resource="certificates"
            filters={CertificatesFilters(permissions)}
            queryOptions={{ refetchOnWindowFocus: false }}
            pagination={<CustomPagination />}
            perPage={perPageDefault}
            empty={<CustomEmptyPage />}
            exporter={false}
            title="resources.certificados.name"
            sx={{ paddingLeft: '10px' }}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => record.id}
                    linkType={"edit"}
                />
            ) : (
                <Datagrid>
                    <TextField source="id" label="resources.certificados.fields.id" />
                    <TextField source="name" label="resources.certificados.fields.name" />
                </Datagrid>
            )}
        </List>
    );
};