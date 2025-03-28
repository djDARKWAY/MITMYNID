import { Show, SimpleShowLayout, TextField, DateField, ReferenceField } from "react-admin";
import { Typography, Divider, Box } from "@mui/material";
import { Home, ContactMail, Language, AccessTimeFilled, Person } from "@mui/icons-material";

export const CompaniesShow = () => (
    <Show>
        <SimpleShowLayout>
            {/* Identificação */}
            <Box display="flex" alignItems="center">
                <Person />
                <Typography variant="h6" sx={{ ml: 1 }}> Identificação </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextField source="id" label="ID" />
            <TextField source="name" label="show.companies.name" />

            {/* Localização */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <Home />
                <Typography variant="h6" sx={{ ml: 1 }}> Localização </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextField source="address" label="show.companies.address" />
            <TextField source="city" label="show.companies.city" />
            <TextField source="district" label="show.companies.district" />
            <ReferenceField source="country_id" reference="countries" label="show.companies.country">
                <TextField source="name" />
            </ReferenceField>
            <TextField source="zip_code" label="show.companies.zip_code" />

            {/* Contactos */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <ContactMail />
                <Typography variant="h6" sx={{ ml: 1 }}> Contactos </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextField source="email" label="show.companies.email" />
            <TextField source="contact" label="show.companies.contact" />
            <TextField source="phone" label="show.companies.phone" />

            {/* Website */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <Language />
                <Typography variant="h6" sx={{ ml: 1 }}> Website </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextField source="website" label="show.companies.website" />

            {/* Logs */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <AccessTimeFilled />
                <Typography variant="h6" sx={{ ml: 1 }}> Logs </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <DateField source="created_date" label="show.companies.created_date" showTime />
            <DateField source="last_modified" label="show.companies.last_modified" showTime />
            <ReferenceField source="last_modified_user_id" reference="users" label="show.companies.last_modified_user">
                <TextField source="username" />
            </ReferenceField>
        </SimpleShowLayout>
    </Show>
);
