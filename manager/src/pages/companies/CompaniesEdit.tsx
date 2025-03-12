import { Edit, SimpleForm, ReferenceInput, SelectInput, TextInput } from "react-admin";
import { Typography, Divider, Box } from "@mui/material";
import { Home, ContactMail, Language, Person } from "@mui/icons-material";

export const CompaniesEdit = () => (
    <Edit>
        <SimpleForm>
            {/* Identificação */}
            <Box display="flex" alignItems="center">
                <Person />
                <Typography variant="h6" sx={{ ml: 1 }}> Identificação </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextInput source="name" label="show.companies.name" fullWidth />

            {/* Localização */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <Home />
                <Typography variant="h6" sx={{ ml: 1 }}> Localização </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextInput source="address" label="show.companies.address" fullWidth />
            <TextInput source="city" label="show.companies.city" fullWidth />
            <ReferenceInput source="country_id" reference="countries" label="show.companies.country" perPage={200} sort={{ field: 'name', order: 'ASC' }}>
                <SelectInput optionText="name" fullWidth />
            </ReferenceInput>
            <TextInput source="zip_code" label="show.companies.zip_code" fullWidth />

            {/* Contactos */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <ContactMail />
                <Typography variant="h6" sx={{ ml: 1 }}> Contactos </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextInput source="email" label="show.companies.email" fullWidth />
            <TextInput source="contact" label="show.companies.contact" fullWidth />
            <TextInput source="phone" label="show.companies.phone" fullWidth />

            {/* Website */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <Language />
                <Typography variant="h6" sx={{ ml: 1 }}> Website </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextInput source="website" label="show.companies.website" fullWidth />
        </SimpleForm>
    </Edit>
);