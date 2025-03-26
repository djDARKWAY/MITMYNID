import { List, useListContext, usePermissions } from "react-admin";
import { Card, CardContent, Typography, Grid, Paper, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { CompaniesFilters } from "./CompaniesFilter";
const FLAG_BASE_URL = import.meta.env.REACT_APP_FLAG_BASE_URL || "http://127.0.0.1:13090/files/flags/";

const CompanyCard = ({ record }: { record?: { id: number | string; name: string; city: string; zip_code: string; country?: { name: string, flag_url?: string } } }) => {
    if (!record) return null;

    const location = record.country ? `${record.city}, ${record.country.name}` : record.city;

    return (
        <Paper elevation={3} sx={{ height: "100%", position: "relative", overflow: "hidden" }}>
            <Card
                sx={{ 
                    textDecoration: "none", 
                    padding: "4px 4px", 
                    height: "100%", 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "center",
                    position: "relative"
                }}
                component={Link}
                to={`/companies/${record.id}/show`}
            >
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
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "53px",
                    height: "40px",
                    backgroundImage: `url(${FLAG_BASE_URL}${record.country.flag_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.6,
                    maskImage: 'linear-gradient(to top left, black 15%, transparent 52%)',
                    WebkitMaskImage: 'linear-gradient(to top left, black 10%, transparent 52%)'}}
            />
        )}
        </Paper>
    );
};

const CompaniesCardList = () => {
    const { data } = useListContext<{ id: number | string; name: string; city: string; zip_code: string; country?: { name: string } }>();
    return (
        <Grid container spacing={2} sx={{ padding: '20px' }}>
            {data?.map(record => (
                <Grid item key={record.id} xs={12} sm={6} md={4} lg={3}>
                    <CompanyCard record={record} />
                </Grid>
            ))}
        </Grid>
    );
};

export const CompaniesList = () => {
    const { permissions } = usePermissions();
    const theme = useTheme();

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
            sx={{ paddingLeft: "10px" }}
        >
            <CompaniesCardList />
        </List>
    );
};