import { List, Datagrid, TextField, DateField, SimpleList, useGetList, usePermissions, ReferenceField, FunctionField } from "react-admin";
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { useEffect } from 'react';
import { AccessPointsFilters } from "./AccessPointsFilter";

export const AccessPointsList = () => {
    const { permissions } = usePermissions();
    const isSmall = useMediaQuery(useTheme().breakpoints.down('lg'));
    const { data, isLoading, error } = useGetList('access-points');

    useEffect(() => {
        if (!isLoading && data) {
            console.log('Access Points data:', data);
            console.log('Total access points:', data.length);
        }
        if (error) {
            console.error('Error loading access points:', error);
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
            resource="access-points"
            filters={AccessPointsFilters(permissions)}
            queryOptions={{ refetchOnWindowFocus: false }}
            pagination={<CustomPagination />}
            perPage={perPageDefault}
            empty={<CustomEmptyPage />}
            exporter={false}
            title="resources.accessPoints.name"
            sx={{ paddingLeft: '10px' }}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.location_description}
                    secondaryText={record => record.ip_address}
                    linkType={"edit"}
                />
            ) : (
                <Datagrid>
                    <ReferenceField source="company_id" reference="companies" label="resources.accessPoints.fields.company_id">
                        <TextField source="name" />
                    </ReferenceField>
                    <TextField source="location_description" label="resources.accessPoints.fields.location_description" />
                    <TextField source="ip_address" label="resources.accessPoints.fields.ip_address" />
                    <TextField source="ap_software" label="resources.accessPoints.fields.ap_software" />
                    <TextField source="software_version" label="resources.accessPoints.fields.software_version" />
                    <FunctionField source="is_active" label="resources.accessPoints.fields.is_active" render={record => record.is_active ? '🟢' : '🔴'} />
                </Datagrid>
            )}
        </List>
    );
};