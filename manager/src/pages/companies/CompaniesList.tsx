import { List, Datagrid, TextField, SimpleList, usePermissions, ReferenceField } from "react-admin";
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { CompaniesFilters } from "./CompaniesFilter";

export const CompaniesList = () => {
    const { permissions } = usePermissions();
    const isSmall = useMediaQuery(useTheme().breakpoints.down('lg'));

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
            sx={{ paddingLeft: '10px' }}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => record.city}
                    linkType={"edit"}
                />
            ) : (
                <Datagrid rowClick="show">
                    <TextField source="name" label="resources.companies.fields.name" />
                    <TextField source="zip_code" label="resources.companies.fields.zip_code" />
                    <TextField source="city" label="resources.companies.fields.city" />
                    <ReferenceField source="country_id" reference="countries" label="resources.companies.fields.country_id">
                        <TextField source="name" />
                    </ReferenceField>
                </Datagrid>
            )}
        </List>
    );
};
