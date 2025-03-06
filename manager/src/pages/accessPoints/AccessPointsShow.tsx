import { Show, SimpleShowLayout, TextField, DateField, BooleanField, ReferenceField, useRecordContext } from "react-admin";
import { Card, Typography, Divider, Button, Box } from "@mui/material";
import IdentificationIcon from '@mui/icons-material/PermIdentity';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkIcon from '@mui/icons-material/Link';

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

export const AccessPointsShow = () => (
    <Show>
        <SimpleShowLayout>
            {/* Identificação */}
            <Box display="flex" alignItems="center">
                <IdentificationIcon />
                <Typography variant="h6" sx={{ ml: 1 }}>Identificação</Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextField source="id" label="ID" />
            <TextField source="location_description" label="Localização" />
            <TextField source="ip_address" label="Endereço IP" />

            {/* Software */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <SettingsIcon />
                <Typography variant="h6" sx={{ ml: 1 }}>Software</Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextField source="ap_software" label="Software" />
            <TextField source="software_version" label="Versão do software" />

            {/* Estado */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <CalendarTodayIcon />
                <Typography variant="h6" sx={{ ml: 1 }}>Estado</Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <BooleanField source="is_active" label="Ativo" />
            <DateField source="created_date" label="Data de criação" showTime />
            <DateField source="last_modified" label="Última modificação" showTime />

            {/* Associações */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <LinkIcon />
                <Typography variant="h6" sx={{ ml: 1 }}>Associações</Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <ReferenceField source="certificate_id" reference="certificates" label="Certificado">
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField source="company_id" reference="companies" label="Empresa">
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField source="last_modified_user_id" reference="users" label="Último modificador">
                <TextField source="username" />
            </ReferenceField>
            <Box display="flex" justifyContent="left" mt={2}>
                <Button variant="contained" color="primary" sx={{ mr: 1 }}>Editar</Button>
                <Button variant="contained" color="secondary">Eliminar</Button>
            </Box>
        </SimpleShowLayout>
    </Show>
);
