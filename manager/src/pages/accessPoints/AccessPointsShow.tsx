import { Show, SimpleShowLayout, TextField, DateField, BooleanField, ReferenceField, useRecordContext } from "react-admin";
import { Card, Typography, Divider, Button, Box } from "@mui/material";
import Person from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { AccessTimeFilled, CardMembership } from "@mui/icons-material";

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
                <Person />
                <Typography variant="h6" sx={{ ml: 1 }}> Identificação </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextField source="id" label="ID" />
            <TextField source="location_description" label="show.accessPoints.location_description" />
            <TextField source="ip_address" label="show.accessPoints.ip_address" />

            {/* Configuração Técnica */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <SettingsIcon />
                <Typography variant="h6" sx={{ ml: 1 }}> Configuração </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <TextField source="ap_software" label="show.accessPoints.software" />
            <TextField source="software_version" label="show.accessPoints.software_version" />
            <BooleanField source="is_active" label="show.accessPoints.is_active" />
            <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>PMode</Typography>
            <Card variant="outlined" sx={{ p: 1, bgcolor: "InfoBackground", maxHeight: "300px", overflow: "auto" }}>
                <TextField source="pmode" label="PMode XML" sx={{ 
                    whiteSpace: "pre-wrap", 
                    fontFamily: "monospace",
                    '& .RaTextField-input': { display: 'block' } 
                }} />
            </Card>

            {/* Certificado */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <CardMembership />
                <Typography variant="h6" sx={{ ml: 1 }}> Certificado </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <ReferenceField source="certificate_id" reference="certificates" label="show.accessPoints.certificates">
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField source="company_id" reference="companies" label="show.accessPoints.company">
                <TextField source="name" />
            </ReferenceField>

            {/* Última Modificação */}
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <AccessTimeFilled />
                <Typography variant="h6" sx={{ ml: 1 }}> Logs </Typography>
            </Box>
            <DateField source="created_date" label="show.accessPoints.created_date" showTime />
            <DateField source="last_modified" label="show.accessPoints.last_modified" showTime />
            <ReferenceField source="last_modified_user_id" reference="users" label="show.accessPoints.last_modified_user">
                <TextField source="username" />
            </ReferenceField>
        </SimpleShowLayout>
    </Show>
);
