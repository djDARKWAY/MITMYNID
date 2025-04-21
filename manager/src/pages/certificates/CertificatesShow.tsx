import { Show, TextField, DateField, BooleanField, ReferenceField, useTranslate, useRecordContext } from "react-admin";
import { Typography, Divider, Box, Card, CardContent, Grid, Paper, Stack } from "@mui/material";
import { FeedOutlined, AccessTimeFilled, CardMembership, CalendarToday } from "@mui/icons-material";
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

export const CertificatesShow = () => (
    <Show>
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 1, backgroundColor: "background.paper" }}>
            <Grid container spacing={2.5}>
                <Grid item xs={12} md={4}>
                    {/* Identificação */}
                    <Section title="show.certificates.identification" icon={<CardMembership />}>
                        <FieldTitleLabel label="show.certificates.name">
                            <TextField source="name" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.certificates.file_path">
                            <TextField source="file_path" />
                        </FieldTitleLabel>
                    </Section>

                    {/* Detalhes */}
                    <Section title="show.certificates.details" icon={<CalendarToday />}>
                        <FieldTitleLabel label="show.certificates.issuer_name">
                            <TextField source="issuer_name" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.certificates.issuer_url">
                            <TextField source="issuer_url" />
                        </FieldTitleLabel>
                        <Box display="flex" gap={2}>
                            <FieldTitleLabel label="show.certificates.issue_date">
                                <DateField source="issue_date" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.certificates.expiration_date">
                                <DateField source="expiration_date" />
                            </FieldTitleLabel>
                        </Box>
                        <FieldTitleLabel label="show.certificates.is_active">
                            <BooleanField source="is_active" />
                        </FieldTitleLabel>
                    </Section>
                </Grid>

                <Grid item xs={12} md={8} sx={{ height: "100%" }}>
                    {/* Conteúdo */}
                    <Section title="show.certificates.content" icon={<FeedOutlined />}>
                        <Box sx={{ height: 425, flexDirection: "column", overflow: "auto" }}>
                            <Card variant="outlined" sx={{ p: 1, bgcolor: "InfoBackground" }}>
                                <Box display="flex" gap={2} flexWrap="wrap" sx={{ mt: 1 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray", mb: 1 }}>
                                            {useTranslate()("show.certificates.srv_cert")}
                                        </Typography>
                                        <TextField 
                                            source="srv_cert" 
                                            sx={{
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-word",
                                                fontFamily: "monospace",
                                                maxWidth: "100%",
                                            }} 
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray", mb: 1 }}>
                                            {useTranslate()("show.certificates.int_cert")}
                                        </Typography>
                                        <TextField 
                                            source="int_cert" 
                                            sx={{
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-word",
                                                fontFamily: "monospace",
                                                maxWidth: "100%",
                                            }} 
                                        />
                                    </Box>
                                </Box>
                            </Card>
                        </Box>
                    </Section>
                </Grid>

                {/* Logs */}
                <Grid item xs={12} sx={{ marginBottom: "-20px", marginTop: "-20px" }}>
                    <Section title="show.warehouses.logs" icon={<AccessTimeFilled />}>
                        <Box display="flex" gap={2} flexWrap="wrap">
                            <FieldTitleLabel label="show.warehouses.created_date">
                                <DateField source="issue_date" showTime />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.warehouses.last_modified">
                                <DateField source="last_modified" showTime />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.warehouses.last_modified_user">
                                <ReferenceField source="last_modified_user_id" reference="users">
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
