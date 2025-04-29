import { Create, SimpleForm, TextInput, ReferenceInput, SelectInput, Toolbar, SaveButton, required } from "react-admin";
import { Typography, Divider, Box, Button } from "@mui/material";
import { Person, Settings, Home, DoDisturb } from "@mui/icons-material";
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
            <TextInput
                source="location_description"
                label="show.accessPoints.location_description"
                fullWidth
                validate={[
                    required(),
                    value =>
                        value && value.length <= 255
                            ? undefined
                            : "A descrição da localização deve ter no máximo 255 caracteres"
                ]}
            />
            <TextInput
                source="ip_address"
                label="show.accessPoints.ip_address"
                fullWidth
                validate={[
                    required(),
                    value => {
                        if (!value) return "O endereço IP é obrigatório";
                        const ipv4Regex = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)(\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/;
                        const ipv6Regex = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/;
                        return ipv4Regex.test(value) || ipv6Regex.test(value)
                            ? undefined
                            : "O endereço IP deve ser válido";
                    }
                ]}
            />

            {/* Localização */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <Home />
                <Typography variant="h6" sx={{ ml: 1 }}>Localização</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <ReferenceInput
                source="warehouse_id"
                reference="warehouses"
                label="show.accessPoints.warehouse"
            >
                <SelectInput optionText="name" fullWidth validate={[required()]} />
            </ReferenceInput>

            {/* Configuração */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <Settings />
                <Typography variant="h6" sx={{ ml: 1 }}>Configuração</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box display="flex" gap={2} sx={{ width: "100%" }}>
                <TextInput
                    source="ap_software"
                    label="show.accessPoints.software"
                    fullWidth
                    validate={[
                        value =>
                            value && value.length <= 255
                                ? undefined
                                : "O software utilizado deve ter no máximo 255 caracteres"
                    ]}
                />
                <TextInput
                    source="software_version"
                    label="show.accessPoints.software_version"
                    fullWidth
                    sx={{ width: "25%" }}
                    validate={[
                        value =>
                            value && value.length <= 255
                                ? undefined
                                : "A versão do software deve ter no máximo 255 caracteres"
                    ]}
                />
            </Box>
        </SimpleForm>
    </Create>
);

const CustomToolbar = () => (
    <Toolbar>
        <SaveButton />
        <Button
            component={Link}
            to="/access-points"
            startIcon={<DoDisturb />}
            color="primary"
            size="small"
            sx={{ ml: 2 }}
        >
            Cancelar
        </Button>
    </Toolbar>
);
