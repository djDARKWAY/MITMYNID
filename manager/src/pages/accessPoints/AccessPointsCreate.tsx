import { Create, SimpleForm, TextInput, ReferenceInput, SelectInput, Toolbar, SaveButton, BooleanInput, required } from "react-admin";
import { Typography, Divider, Box, Button } from "@mui/material";
import { Person, Settings, Home, DoDisturb, CardMembership, AccessTimeFilled } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const AccessPointsCreate = () => (
    <Create transform={(data) => ({ ...data })}>
        <SimpleForm toolbar={<CustomToolbar />}>
            {/* Identificação */}
            <Box display="flex" alignItems="center">
                <Person />
                <Typography variant="h6" sx={{ ml: 1 }}>Identificação</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TextInput source="location_description" label="show.accessPoints.location_description" fullWidth validate={[required()]} />
            <TextInput source="ip_address" label="show.accessPoints.ip_address" fullWidth validate={[required()]} />

            {/* Localização */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <Home />
                <Typography variant="h6" sx={{ ml: 1 }}>Localização</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <ReferenceInput source="warehouse_id" reference="warehouses" label="show.accessPoints.warehouse">
                <SelectInput optionText="name" fullWidth validate={[required()]} />
            </ReferenceInput>

            {/* Configuração */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <Settings />
                <Typography variant="h6" sx={{ ml: 1 }}>Configuração</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box display="flex" gap={2} sx={{ width: "100%" }}>
                <TextInput source="ap_software" label="show.accessPoints.software" fullWidth />
                <TextInput source="software_version" label="show.accessPoints.software_version" fullWidth sx={{ width: "25%" }} />
            </Box>
            
            {/* Certificado */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <CardMembership />
                <Typography variant="h6" sx={{ ml: 1 }}>Certificado</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <ReferenceInput source="certificate_id" reference="certificates" label="show.accessPoints.certificate">
                <SelectInput optionText="name" fullWidth />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);

const CustomToolbar = () => (
    <Toolbar>
        <SaveButton />
        <Button component={Link} to="/access-points" startIcon={<DoDisturb />} color="primary" size="small" sx={{ ml: 2 }}>Cancelar</Button>
    </Toolbar>
);
