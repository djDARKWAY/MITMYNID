import { Create, SimpleForm, TextInput, ReferenceInput, SelectInput, Toolbar, SaveButton } from "react-admin";
import { Typography, Divider, Box, Button } from "@mui/material";
import { Home, ContactMail, Language, Person, DoDisturb, Room } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState } from "react";
import SelectCoordinatesMapModal from "../../components/layout/selectCoordinatesModal";
import { useFormContext } from 'react-hook-form';

const FLAG_BASE_URL = import.meta.env.VITE_FLAG_BASE_URL;

const CoordinatesModalHandler = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const { setValue, getValues } = useFormContext();
    const latValue = getValues('lat');
    const lonValue = getValues('lon');

    const fetchCountryCode = async (lat: number, lon: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            if (data.address) {
                if (data.address.country_code) {
                    setValue('country_id', data.address.country_code.toUpperCase());
                }
                if (data.address.city || data.address.town || data.address.village) {
                    setValue('city', data.address.city || data.address.town || data.address.village);
                }
                if (data.address.state || data.address.region || data.address.county || data.address.district) {
                    setValue('district', data.address.state || data.address.region || data.address.county || data.address.district);
                }
                if (data.address.postcode) {
                    setValue('zip_code', data.address.postcode);
                }
                if (data.address.road) {
                    setValue('address', data.address.road);
                }
            }
        } catch (e) {
            console.error("Erro ao obter o código do país e outros dados:", e);
        }
    };

    return (
        <SelectCoordinatesMapModal
            open={open}
            onClose={onClose}
            onSelect={async (lat, lon) => {
                setValue('lat', parseFloat(lat.toFixed(6)));
                setValue('lon', parseFloat(lon.toFixed(6)));
                await fetchCountryCode(lat, lon);
                onClose();
            }}
            initialLat={latValue ? parseFloat(latValue) : undefined}
            initialLon={lonValue ? parseFloat(lonValue) : undefined}
        />
    );
};

export const WarehousesCreate = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <Create>
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
                <Box display="grid" gridTemplateColumns="4fr 3fr" gap={2} sx={{ width: "100%", alignItems: "stretch" }}>
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
                    <Box display="grid" gridTemplateColumns="1fr 1fr auto" gap={2} sx={{ height: '100%', alignItems: 'stretch' }}>
                        <TextInput 
                            source="lat" 
                            label="show.warehouses.latitude" 
                            fullWidth
                            sx={{ mt: 0, mb: 0, height: '100%' }}
                            validate={[
                                value => (value >= -90 && value <= 90) ? undefined : "A latitude deve estar entre -90 e 90"
                            ]} 
                        />
                        <TextInput 
                            source="lon" 
                            label="show.warehouses.longitude" 
                            fullWidth
                            sx={{ mt: 0, mb: 0, height: '100%' }}
                            validate={[
                                value => (value >= -180 && value <= 180) ? undefined : "A longitude deve estar entre -180 e 180"
                            ]} 
                        />
                        <Button 
                            variant="outlined"
                            onClick={() => setModalOpen(true)}
                            sx={{ 
                                minWidth: "56px",
                                minHeight: "56px",
                                maxWidth: "56px",
                                maxHeight: "56px",
                                borderRadius: "8px",
                                alignSelf: 'stretch'
                            }}
                        >
                            <Room sx={{ fontSize: 32 }} />
                        </Button>
                    </Box>
                </Box>
                <CoordinatesModalHandler open={modalOpen} onClose={() => setModalOpen(false)} />

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
};

const CustomToolbar = () => (
    <Toolbar>
        <SaveButton />
        <Button component={Link} to="/warehouses" startIcon={<DoDisturb />} color="primary" size="small" sx={{ ml: 2 }}>Cancelar</Button>
    </Toolbar>
);
