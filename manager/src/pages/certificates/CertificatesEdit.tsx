import { Edit, TabbedForm, TextInput, DateInput } from "react-admin";
import { Typography, Divider, Box } from "@mui/material";
import Person from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export const CertificatesEdit = () => (
    <Edit>
        <TabbedForm>
            <TabbedForm.Tab label="Identificação">
                <Box display="flex" alignItems="center">
                    <Person />
                    <Typography variant="h6" sx={{ ml: 1 }}>Identificação</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <TextInput source="name" label="show.certificates.name" fullWidth />
                <TextInput source="file_path" label="show.certificates.file_path" fullWidth />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="Detalhes">
                <Box display="flex" alignItems="center">
                    <CalendarTodayIcon />
                    <Typography variant="h6" sx={{ ml: 1 }}>Detalhes</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Box display="flex" justifyContent="space-between"></Box>
                <TextInput source="issuer_url" label="show.certificates.issuer_url" fullWidth />
                <DateInput source="issue_date" label="show.certificates.issue_date" fullWidth />
                <DateInput source="expiration_date" label="show.certificates.expiration_date" fullWidth />
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);
