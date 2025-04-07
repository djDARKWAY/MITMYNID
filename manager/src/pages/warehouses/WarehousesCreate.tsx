import { Create, SimpleForm, TextInput, ReferenceInput, SelectInput, Toolbar, SaveButton } from "react-admin";
import { Typography, Divider, Box, Button } from "@mui/material";
import { Home, ContactMail, Language, Person, DoDisturb } from "@mui/icons-material";
import { Link } from "react-router-dom";

const FLAG_BASE_URL = import.meta.env.VITE_FLAG_BASE_URL;

export const WarehousesCreate = () => (
    <Create>
        <SimpleForm toolbar={<CustomToolbar />}>
            {/* Identificação */}
            <Box display="flex" alignItems="center">
                <Person />
                <Typography variant="h6" sx={{ ml: 1 }}>Identificação</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TextInput source="name" label="show.warehouses.name" fullWidth />

            {/* Localização */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <Home />
                <Typography variant="h6" sx={{ ml: 1 }}>Localização</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TextInput source="address" label="show.warehouses.address" fullWidth />
            <Box display="flex" gap={2} width="100%" alignItems="center">
                <Box sx={{ width: "50%" }}>
                    <ReferenceInput source="country_id" reference="countries" label="show.warehouses.country" perPage={180} sort={{ field: 'name', order: 'ASC' }}>
                        <SelectInput optionText={record => (
                            <Box display="flex" alignItems="center">
                                {record.flag_url && (
                                    <img src={`${FLAG_BASE_URL}/${record.flag_url}`} alt={record.name} width={20} height={15} style={{ borderRadius: "3px", marginRight: 8 }} />
                                )}
                                {record.name}
                            </Box>
                        )} fullWidth />
                    </ReferenceInput>
                </Box>
                <TextInput source="city" label="show.warehouses.city" sx={{ width: "50%" }} />
            </Box>
            <TextInput source="district" label="show.warehouses.district" fullWidth />
            <TextInput source="zip_code" label="show.warehouses.zip_code" fullWidth />

            {/* Contactos */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <ContactMail />
                <Typography variant="h6" sx={{ ml: 1 }}>Contactos</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TextInput source="email" label="show.warehouses.email" fullWidth />
            <TextInput source="contact" label="show.warehouses.contact" fullWidth />
            <TextInput source="phone" label="show.warehouses.phone" fullWidth />

            {/* Website */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <Language />
                <Typography variant="h6" sx={{ ml: 1 }}>Website</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TextInput source="website" label="show.warehouses.website" fullWidth />
        </SimpleForm>
    </Create>
);

const CustomToolbar = () => (
    <Toolbar>
        <SaveButton />
        <Button component={Link} to="/warehouses" startIcon={<DoDisturb />} color="primary" size="small" sx={{ ml: 2 }}>Cancelar</Button>
    </Toolbar>
);
