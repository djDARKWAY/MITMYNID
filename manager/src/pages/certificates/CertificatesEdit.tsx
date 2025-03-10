import { Edit, SimpleForm, TextInput, DateInput } from "react-admin";
import { Card, Typography, Divider, Box } from "@mui/material";
import Person from '@mui/icons-material/Person';
import FeedOutlined from '@mui/icons-material/FeedOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export const CertificatesEdit = () => (
    <Edit>
        <SimpleForm>
            {/* Identificação */}
            <Box display="flex" alignItems="center">
                <Person />
                <Typography variant="h6" sx={{ ml: 1 }}>Identificação</Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextInput source="name" label="show.certificates.name" fullWidth />
            <TextInput source="file_path" label="show.certificates.file_path" fullWidth />

            {/* Detalhes do certificado */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <CalendarTodayIcon />
                <Typography variant="h6" sx={{ ml: 1 }}>Detalhes</Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextInput source="issuer_name" label="show.certificates.issuer_name" fullWidth />
            <TextInput source="issuer_url" label="show.certificates.issuer_url" fullWidth />
            <DateInput source="issue_date" label="show.certificates.issue_date" fullWidth />
            <DateInput source="expiration_date" label="show.certificates.expiration_date" fullWidth />

            {/* Seção do Certificado
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <FeedOutlined />
                <Typography variant="h6" sx={{ ml: 1 }}>Conteúdo</Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <Card variant="outlined" sx={{ p: 1, bgcolor: "InfoBackground", maxHeight: "300px", overflow: "auto" }}>
                <TextInput source="certificate_text" label="show.certificates.certificate_text" sx={{ 
                    whiteSpace: "pre-wrap", 
                    fontFamily: "monospace",
                    '& .RaTextField-input': { display: 'block' } 
                }} />
            </Card>
            <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}></Typography>
            <TextInput source="certificate_data" label="show.certificates.certificate_data" multiline fullWidth />            
            */}            
        </SimpleForm>
    </Edit>
);
