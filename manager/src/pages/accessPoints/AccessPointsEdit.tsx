import { Edit, TabbedForm, ReferenceInput, SelectInput, TextInput, BooleanInput, useEditController } from "react-admin";
import { Typography, Divider, Box } from "@mui/material";
import { Person, Settings, Home } from "@mui/icons-material";

export const AccessPointsEdit = () => {
    const controllerProps = useEditController();

    const sanitizeData = (data: any) => {
        const { pmode, ...sanitizedData } = data;
        return sanitizedData;
    };

    return (
        <Edit {...controllerProps} transform={sanitizeData}>
            <TabbedForm>
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
                    <ReferenceInput source="company_id" reference="companies" label="show.accessPoints.company">
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
                    <TextInput source="ap_software" label="show.accessPoints.software" fullWidth />
                    <TextInput source="software_version" label="show.accessPoints.software_version" fullWidth />
                    <BooleanInput source="is_active" label="show.accessPoints.is_active" />
                </TabbedForm.Tab>
            </TabbedForm>
        </Edit>
    );
};
