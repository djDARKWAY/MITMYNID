import { Edit, TabbedForm, ReferenceInput, SelectInput, TextInput, BooleanInput, useEditController, Toolbar, SaveButton } from "react-admin";
import { Typography, Divider, Box, Button } from "@mui/material";
import { Person, Settings, Home, DoDisturb } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const AccessPointsEdit = () => {
    const controllerProps = useEditController();

    const sanitizeData = (data: any) => {
        const { pmode, ...sanitizedData } = data;
        return sanitizedData;
    };

    return (
        <Edit {...controllerProps} transform={sanitizeData}>
            <TabbedForm toolbar={<CustomToolbar />}>
                {/* Identificação */}
                <TabbedForm.Tab label="Identificação">
                    <Box display="flex" alignItems="center">
                        <Person />
                        <Typography variant="h6" sx={{ ml: 1 }}>Identificação</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <TextInput source="location_description" label="show.accessPoints.location_description" fullWidth />
                    <TextInput source="ip_address" label="show.accessPoints.ip_address" fullWidth />
                </TabbedForm.Tab>

                {/* Localização */}
                <TabbedForm.Tab label="Localização">
                    <Box display="flex" alignItems="center">
                        <Home />
                        <Typography variant="h6" sx={{ ml: 1 }}>Localização</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <ReferenceInput source="company_id" reference="warehouses" label="show.accessPoints.warehouse">
                        <SelectInput optionText="name" fullWidth />
                    </ReferenceInput>
                </TabbedForm.Tab>

                {/* Configuração */}
                <TabbedForm.Tab label="Configuração">
                    <Box display="flex" alignItems="center">
                        <Settings />
                        <Typography variant="h6" sx={{ ml: 1 }}>Configuração</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <Box display="flex" gap={2} sx={{ width: "100%" }}>
                        <TextInput source="ap_softwa</Box>re" label="show.accessPoints.software" fullWidth />
                        <TextInput source="software_version" label="show.accessPoints.software_version" fullWidth sx={{ width: "25%" }} />
                    </Box>
                    <BooleanInput source="is_active" label="show.accessPoints.is_active" />
                </TabbedForm.Tab>
            </TabbedForm>
        </Edit>
    );
};

const CustomToolbar = () => (
    <Toolbar>
        <SaveButton />
        <Button component={Link} to="/access-points" startIcon={<DoDisturb />} color="primary" size="small" sx={{ ml: 2 }}>Cancelar</Button>
    </Toolbar>
);
