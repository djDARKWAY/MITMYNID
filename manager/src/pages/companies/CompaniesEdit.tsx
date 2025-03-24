import { Edit, TabbedForm, ReferenceInput, SelectInput, TextInput } from "react-admin";
import { Typography, Divider, Box } from "@mui/material";
import { Home, ContactMail, Language, Person } from "@mui/icons-material";

const FLAG_BASE_URL = import.meta.env.REACT_APP_FLAG_BASE_URL || "http://127.0.0.1:13090/files/flags/";

export const CompaniesEdit = () => (
    <Edit>
        <TabbedForm>
            <TabbedForm.Tab label="Identificação">
                <Box display="flex" alignItems="center">
                    <Person />
                    <Typography variant="h6" sx={{ ml: 1 }}>Identificação</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <TextInput source="name" label="show.companies.name" fullWidth />
            </TabbedForm.Tab>
            
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