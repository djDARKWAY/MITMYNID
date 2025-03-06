import { Show, SimpleShowLayout, TextField, DateField, BooleanField, ReferenceField, useRecordContext } from "react-admin";
import { Card, Typography, Divider, Button, Box } from "@mui/material";
import Person from '@mui/icons-material/Person';
import FeedOutlined from '@mui/icons-material/FeedOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { AccessTimeFilled } from "@mui/icons-material";

const JsonField = ({ source }: { source: string }) => {
    const record = useRecordContext();
    if (!record || !record[source]) return null;

    return (
        <Card variant="outlined" sx={{ my: 1, p: 1, bgcolor: "InfoBackground" }}>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                {JSON.stringify(record[source], null, 2)}
            </Typography>
        </Card>
    );
};

export const CertificatesShow = () => (
    <Show>
        <SimpleShowLayout>
            {/* Identificação */}
            <Box display="flex" alignItems="center">
                <Person />
                <Typography variant="h6" sx={{ ml: 1 }}>Identificação</Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextField source="id" label="ID" />
            <TextField source="name" label="show.certificates.name" />
            <TextField source="file_path" label="show.certificates.file_path" />

            {/* Detalhes do certificado */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <CalendarTodayIcon />
                <Typography variant="h6" sx={{ ml: 1 }}>Detalhes</Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextField source="issuer_name" label="show.certificates.issuer_name" />
            <TextField source="issuer_url" label="show.certificates.issuer_url" />
            <DateField source="issue_date" label="show.certificates.issue_date" />
            <DateField source="expiration_date" label="show.certificates.expiration_date" />
            <BooleanField source="is_expired" label="show.certificates.is_expired" />

            {/* Seção do Certificado */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <FeedOutlined />
                <Typography variant="h6" sx={{ ml: 1 }}>Conteúdo</Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>Texto</Typography>
            <Card variant="outlined" sx={{ p: 1, bgcolor: "InfoBackground", maxHeight: "300px", overflow: "auto" }}>
                <TextField source="certificate_text" label="show.certificates.certificate_text" sx={{ 
                    whiteSpace: "pre-wrap", 
                    fontFamily: "monospace",
                    '& .RaTextField-input': { display: 'block' } 
                }} />
            </Card>

            <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>Dados</Typography>
            <JsonField source="certificate_data" />

            {/* Última Modificação */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <AccessTimeFilled />
                <Typography variant="h6" sx={{ ml: 1 }}>Logs</Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <DateField source="last_modified" label="Última Modificação" showTime />
            <ReferenceField source="last_modified_user_id" reference="users" label="show.certificates.modified_by">
                <TextField source="username" />
            </ReferenceField>

            {/* Ações */}
            <Box display="flex" justifyContent="left" mt={2}>
                <Button variant="contained" color="primary" sx={{ mr: 1 }}>Editar</Button>
                <Button variant="contained" color="secondary">Eliminar</Button>
            </Box>
        </SimpleShowLayout>
    </Show>
);
