import { Edit, TabbedForm, TextInput, DateInput, Toolbar, SaveButton } from "react-admin";
import { Typography, Divider, Box, Button } from "@mui/material";
import { CalendarToday, Person, DoDisturb } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const CertificatesEdit = () => (
    <Edit>
            <TabbedForm toolbar={<CustomToolbar />}>
                {/* Identificação */}
                <TabbedForm.Tab label="Identificação">
                    <Box display="flex" alignItems="center">
                        <Person />
                        <Typography variant="h6" sx={{ ml: 1 }}>Identificação</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <TextInput source="name" label="show.certificates.name" fullWidth />
                    <TextInput source="file_path" label="show.certificates.file_path" fullWidth />
                </TabbedForm.Tab>

                {/* Detalhes */}
                <TabbedForm.Tab label="Detalhes">
                    <Box display="flex" alignItems="center">
                        <CalendarToday />
                        <Typography variant="h6" sx={{ ml: 1 }}>Detalhes</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <TextInput source="issuer_url" label="show.certificates.issuer_url" fullWidth />
                    <Box display="flex" gap={2} sx={{ width: "100%" }}>
                        <DateInput source="issue_date" label="show.certificates.issue_date" fullWidth />
                        <DateInput source="expiration_date" label="show.certificates.expiration_date" fullWidth />
                    </Box>
                </TabbedForm.Tab>

                {/* Conteúdo */}
                <TabbedForm.Tab label="Conteúdo">
                    <TextInput source="certificate_text" label="show.certificates.certificate_text" fullWidth multiline />
                    <TextInput source="certificate_data" label="show.certificates.certificate_data" fullWidth multiline />
                </TabbedForm.Tab>
            </TabbedForm>
        </Edit>
    );

const CustomToolbar = () => (
    <Toolbar>
        <SaveButton />
        <Button component={Link} to="/certificates" startIcon={<DoDisturb />} color="primary" size="small" sx={{ ml: 2 }}>Cancelar</Button>
    </Toolbar>
);
