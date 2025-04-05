import { Show, TextField, DateField, BooleanField, ReferenceField, useTranslate, useRecordContext } from "react-admin";
import { Typography, Divider, Box, Card, CardContent, Grid, Paper, Stack } from "@mui/material";
import { Person, Settings as SettingsIcon, AccessTimeFilled, CardMembership } from "@mui/icons-material";
import { ReactNode } from "react";

const Section = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => {
    const translate = useTranslate();
    return (
        <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
                <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    {icon}
                    <Typography variant="h6" sx={{ ml: 1, fontWeight: "bold" }}>
                        {translate(title)}
                    </Typography>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <Stack>{children}</Stack>
            </CardContent>
        </Card>
    );
};

const FieldTitleLabel = ({ label, children }: { label: string; children: ReactNode }) => {
    const translate = useTranslate();
    return (
        <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray" }}>
                {translate(label)}
            </Typography>
            {children}
        </Box>
    );
};

const XmlField = ({ source }: { source: string }) => {
    const record = useRecordContext();
    if (!record || !record[source]) return null;

    return (
        <Card variant="outlined" sx={{ my: 1, p: 1, bgcolor: "InfoBackground", maxWidth: "100%", overflowX: "auto" }}>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace", wordBreak: "break-word" }}>
                {record[source]}
            </Typography>
        </Card>
    );
};

export const AccessPointsShow = () => (
    <Show>
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 1, backgroundColor: "background.paper" }}>
            <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                    {/* Identificação */}
                    <Section title="show.accessPoints.identification" icon={<Person />}>
                        <FieldTitleLabel label="ID">
                            <TextField source="id" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.accessPoints.location_description">
                            <TextField source="location_description" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.accessPoints.ip_address">
                            <TextField source="ip_address" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.accessPoints.is_active">
                            <BooleanField source="is_active" />
                        </FieldTitleLabel>
                    </Section>

                    {/* Certificado */}
                    <Section title="show.accessPoints.certificates" icon={<CardMembership />}>
                        <FieldTitleLabel label="show.accessPoints.certificates">
                            <ReferenceField source="certificate_id" reference="certificates">
                                <TextField source="name" />
                            </ReferenceField>
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.accessPoints.warehouse">
                            <ReferenceField source="company_id" reference="warehouses">
                                <TextField source="name" />
                            </ReferenceField>
                        </FieldTitleLabel>
                    </Section>
                </Grid>

                <Grid item xs={12} md={6}>
                    {/* Configuração Técnica */}
                    <Section title="show.accessPoints.configuration" icon={<SettingsIcon />}>
                        <Box sx={{ height: 425, flexDirection: "column", overflow: "auto"}}>
                            <FieldTitleLabel label="show.accessPoints.software">
                                <TextField source="ap_software" /> (v. <TextField source="software_version" />)
                            </FieldTitleLabel>
                            <FieldTitleLabel label="PMode">
                                <Card variant="outlined" sx={{ p: 1, bgcolor: "InfoBackground", overflow: "auto" }}>
                                    <XmlField source="pmode" />
                                </Card>
                            </FieldTitleLabel>
                        </Box>
                    </Section>
                </Grid>

                {/* Logs */}
                <Grid item xs={12} sx={{ marginBottom: "-20px", marginTop: "-20px" }}>
                    <Section title="show.accessPoints.logs" icon={<AccessTimeFilled />}>
                        <FieldTitleLabel label="show.accessPoints.created_date">
                            <DateField source="created_date" showTime />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.accessPoints.last_modified">
                            <DateField source="last_modified" showTime />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.accessPoints.last_modified_user">
                            <ReferenceField source="last_modified_user_id" reference="users">
                                <TextField source="username" />
                            </ReferenceField>
                        </FieldTitleLabel>
                    </Section>
                </Grid>
            </Grid>
        </Paper>
    </Show>
);
