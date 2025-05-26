import { Create, SimpleForm, TextInput, ReferenceInput, SelectInput, Toolbar, SaveButton, required } from "react-admin";
import { Typography, Divider, Box, Button } from "@mui/material";
import { Home, ContactMail, Language, Person, DoDisturb } from "@mui/icons-material";
import { Link } from "react-router-dom";

const FLAG_BASE_URL = import.meta.env.VITE_FLAG_BASE_URL;

export const WarehousesCreate = () => (
    <Create transform={(data) => ({
        ...data,
    })}>
        <SimpleForm toolbar={<CustomToolbar />} warnWhenUnsavedChanges>
            {/* Identificação */}
            <Box display="flex" alignItems="center">
                <Person />
                <Typography variant="h6" sx={{ ml: 1 }}>Identificação</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TextInput 
                source="name" 
                label="show.warehouses.name" 
                fullWidth 
                validate={[
                    value => value && value.length <= 255 ? undefined : "O nome deve ter no máximo 255 caracteres"
                ]}
            />

            {/* Localização */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <Home />
                <Typography variant="h6" sx={{ ml: 1 }}>Localização</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TextInput 
                source="address" 
                label="show.warehouses.address" 
                fullWidth 
                validate={[
                    value => value && value.length <= 255 ? undefined : "O endereço deve ter no máximo 255 caracteres"
                ]}
            />
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} sx={{ width: "100%" }}>
                <TextInput 
                    source="city" 
                    label="show.warehouses.city"
                    validate={[
                        value => value && value.length <= 100 ? undefined : "A cidade deve ter no máximo 100 caracteres"
                    ]}
                />
                <TextInput 
                    source="district" 
                    label="show.warehouses.district" 
                    validate={[
                        value => value && value.length <= 100 ? undefined : "O distrito deve ter no máximo 100 caracteres"
                    ]}
                />
                <TextInput 
                    source="zip_code" 
                    label="show.warehouses.zip_code" 
                    validate={[
                        value => value && value.length <= 20 ? undefined : "O código postal deve ter no máximo 20 caracteres"
                    ]}
                />
            </Box>
            <Box display="grid" gridTemplateColumns="2fr 1fr 1fr" gap={2} sx={{ width: "100%", alignItems: "center" }}>
                <ReferenceInput source="country_id" reference="countries" label="show.warehouses.country" perPage={180} sort={{ field: 'name', order: 'ASC' }}>
                    <SelectInput 
                        optionText={record => (
                            <Box display="flex" alignItems="center">
                                {record.flag_url && (
                                    <img src={`${FLAG_BASE_URL}/${record.flag_url}`} alt={record.name} width={20} height={15} style={{ borderRadius: "3px", marginRight: 8 }} />
                                )}
                                {record.name}
                            </Box>
                        )}
                        fullWidth 
                        sx={{ mt: 0, mb: 0 }}
                    />
                </ReferenceInput>
                <TextInput 
                    source="lat" 
                    label="show.warehouses.latitude" 
                    fullWidth
                    sx={{ mt: 0, mb: 0 }}
                    validate={[
                        value => (value >= -90 && value <= 90) ? undefined : "A latitude deve estar entre -90 e 90"
                    ]} 
                />
                <TextInput 
                    source="lon" 
                    label="show.warehouses.longitude" 
                    fullWidth
                    sx={{ mt: 0, mb: 0 }}
                    validate={[
                        value => (value >= -180 && value <= 180) ? undefined : "A longitude deve estar entre -180 e 180"
                    ]} 
                />
            </Box>

            {/* Contactos */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <ContactMail />
                <Typography variant="h6" sx={{ ml: 1 }}>Contactos</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TextInput 
                source="email" 
                label="show.warehouses.email" 
                fullWidth 
                validate={[
                    value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "O email deve ser válido"
                ]}
            />
            <TextInput 
                source="contact" 
                label="show.warehouses.contact" 
                fullWidth 
                validate={[
                    value => !value || /^[a-zA-Z\s]+$/.test(value) ? undefined : "O contacto deve conter apenas letras e espaços",
                    value => !value || value.length <= 255 ? undefined : "O contacto deve ter no máximo 255 caracteres"
                ]}
            />
            <TextInput 
                source="phone" 
                label="show.warehouses.phone" 
                fullWidth 
                validate={[
                    value => !value || value.length <= 20 ? undefined : "O telefone deve ter no máximo 20 caracteres"
                ]}
            />

            {/* Website */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <Language />
                <Typography variant="h6" sx={{ ml: 1 }}>Website</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TextInput 
                source="website" 
                label="show.warehouses.website" 
                fullWidth 
                validate={[
                    value => !value || /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/.test(value) ? undefined : "O website deve ser um URL válido",
                    value => !value || value.length <= 255 ? undefined : "O website deve ter no máximo 255 caracteres"
                ]}
            />
        </SimpleForm>
    </Create>
);

const CustomToolbar = () => (
    <Toolbar>
        <SaveButton />
        <Button component={Link} to="/warehouses" startIcon={<DoDisturb />} color="primary" size="small" sx={{ ml: 2 }}>Cancelar</Button>
    </Toolbar>
);
