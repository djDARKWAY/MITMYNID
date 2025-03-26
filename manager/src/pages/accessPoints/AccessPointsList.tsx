import { List, Datagrid, TextField, FunctionField, SimpleList, usePermissions, ReferenceField, WithRecord } from "react-admin";
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { AccessPointsFilters } from "./AccessPointsFilter";
import { Edit, Delete } from '@mui/icons-material';
import CustomButtonToolTip, { commonListCSS } from "../../components/general/CustomButtonToolTip";
import CustomConfirmButtonToolTip from "../../components/general/CustomConfirmButtonToolTip";

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
            sx={{ paddingLeft: '10px' }}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.location_description}
                    secondaryText={record => record.ip_address}
                    linkType={"edit"}
                />
            ) : (
                <Datagrid rowClick={false}>
                    <ReferenceField source="company_id" reference="companies" label="resources.accessPoints.fields.company_id" link={false}>
                        <TextField source="name" />
                    </ReferenceField>
                    <TextField source="location_description" label="resources.accessPoints.fields.location_description" />
                    <TextField source="ip_address" label="resources.accessPoints.fields.ip_address" />
                    <TextField source="ap_software" label="resources.accessPoints.fields.ap_software" />
                    <FunctionField source="is_active" label="resources.accessPoints.fields.is_active" render={record => record.is_active ? '🟢' : '🔴'} />
                    <WithRecord render={(record) => (
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                            <CustomButtonToolTip
                                icon={<Edit />}
                                label={"ra.action.edit"}
                                action={"redirect"}
                                id={record.id}
                                resource={"access-points"}
                                sx={commonListCSS}
                            />
                            <CustomConfirmButtonToolTip
                                sx={commonListCSS}
                                label={"ra.action.delete"}
                                color="error"
                                icon={<Delete />}
                                id={record.id}
                                resource={"access-points"}
                            />
                        </div>
                    )} />
                </Datagrid>
            )}
        </List>
    );
};
