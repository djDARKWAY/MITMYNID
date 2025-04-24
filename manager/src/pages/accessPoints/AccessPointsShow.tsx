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
    if (!record || !record[source]) return <Typography variant="body2">N/A</Typography>;

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
                        <FieldTitleLabel label="show.accessPoints.location_description">
                            <TextField source="location_description" emptyText="N/A" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.accessPoints.ip_address">
                            <TextField source="ip_address" emptyText="N/A" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.accessPoints.is_active">
                            <BooleanField source="is_active" emptyText="N/A" />
                        </FieldTitleLabel>
                    </Section>

                    {/* Certificado */}
                    <Section title="show.accessPoints.certificates" icon={<CardMembership />}>
                        <FieldTitleLabel label="show.accessPoints.certificates">
                            <ReferenceField source="certificate_id" reference="certificates" emptyText="N/A">
                                <TextField source="name" />
                            </ReferenceField>
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.accessPoints.warehouse">
                            <ReferenceField source="warehouse_id" reference="warehouses" emptyText="N/A">
                                <TextField source="name" />
                            </ReferenceField>
                        </FieldTitleLabel>
                    </Section>
                </Grid>

                <Grid item xs={12} md={6}>
                    {/* Configuração Técnica */}
                    <Section title="show.accessPoints.configuration" icon={<SettingsIcon />}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <FieldTitleLabel label="show.accessPoints.software">
                                <TextField source="ap_software" emptyText="N/A" /> (v. <TextField source="software_version" emptyText="N/A" />)
                            </FieldTitleLabel>
                            <FieldTitleLabel label="PMode">
                                <Card variant="outlined" sx={{ p: 1, bgcolor: "InfoBackground", maxHeight: 277, overflow: "auto" }}>
                                    <XmlField source="pmode" />
                                </Card>
                            </FieldTitleLabel>
                        </Box>
                    </Section>
                </Grid>

                {/* Logs */}
                <Grid item xs={12} sx={{ marginBottom: "-20px", marginTop: "-20px" }}>
                    <Section title="show.accessPoints.logs" icon={<AccessTimeFilled />}>
                        <Box display="flex" gap={2} flexWrap="wrap">
                            <FieldTitleLabel label="show.accessPoints.created_date">
                                <DateField source="created_date" showTime emptyText="N/A" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.accessPoints.last_modified">
                                <DateField source="last_modified" showTime emptyText="N/A" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.accessPoints.last_modified_user">
                                <ReferenceField source="last_modified_user_id" reference="users" emptyText="N/A">
                                    <TextField source="username" />
                                </ReferenceField>
                            </FieldTitleLabel>
                        </Box>
                    </Section>
                </Grid>
            </Grid>
        </Paper>
    </Show>
);
