import { Edit, TabbedForm, ReferenceInput, SelectInput, TextInput, Toolbar, SaveButton } from "react-admin";
import { Typography, Divider, Box, Button } from "@mui/material";
import { Home, ContactMail, Language, Person, DoDisturb } from "@mui/icons-material";
import { Link } from "react-router-dom";

const FLAG_BASE_URL = import.meta.env.REACT_APP_FLAG_BASE_URL;

export const CompaniesEdit = () => (
    <Edit>
        <TabbedForm toolbar={<CustomToolbar />}>
            {/* Identificação */}
            <TabbedForm.Tab label="Identificação">
                <Box display="flex" alignItems="center">
                    <Person />
                    <Typography variant="h6" sx={{ ml: 1 }}>Identificação</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <TextInput source="name" label="show.companies.name" fullWidth />
            </TabbedForm.Tab>

            {/* Localização */}
            <TabbedForm.Tab label="Localização">
                <Box display="flex" alignItems="center">
                    <Home />
                    <Typography variant="h6" sx={{ ml: 1 }}>Localização</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <TextInput source="address" label="show.companies.address" fullWidth />

                <Box display="flex" gap={2} width="100%" alignItems="center">
                    <Box sx={{ width: "50%" }}>
                        <ReferenceInput source="country_id" reference="countries" label="show.companies.country" perPage={180} sort={{ field: 'name', order: 'ASC' }}>
                            <SelectInput optionText={record => (<Box display="flex" alignItems="center">{record.flag_url && (<img src={`${FLAG_BASE_URL}/${record.flag_url}`} alt={record.name} width={20} height={15} style={{ borderRadius: "3px", marginRight: 8 }} />)}{record.name}</Box>)} fullWidth />
                        </ReferenceInput>
                    </Box>
                    <TextInput source="city" label="show.companies.city" sx={{ width: "50%" }} />
                </Box>
                <TextInput source="zip_code" label="show.companies.zip_code" fullWidth />
            </TabbedForm.Tab>

            {/* Contactos */}
            <TabbedForm.Tab label="Contactos">
                <Box display="flex" alignItems="center">
                    <ContactMail />
                    <Typography variant="h6" sx={{ ml: 1 }}>Contactos</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <TextInput source="email" label="show.companies.email" fullWidth />
                <TextInput source="contact" label="show.companies.contact" fullWidth />
                <TextInput source="phone" label="show.companies.phone" fullWidth />
            </TabbedForm.Tab>

            {/* Website */}
            <TabbedForm.Tab label="Website">
                <Box display="flex" alignItems="center">
                    <Language />
                    <Typography variant="h6" sx={{ ml: 1 }}>Website</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <TextInput source="website" label="show.companies.website" fullWidth />
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);

const CustomToolbar = () => (
    <Toolbar>
        <SaveButton />
        <Button component={Link} to="/companies" startIcon={<DoDisturb />} color="primary" size="small" sx={{ ml: 2 }}>Cancelar</Button>
    </Toolbar>
);