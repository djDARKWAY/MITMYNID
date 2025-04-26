import { Show, TextField, DateField, BooleanField, ReferenceField, useTranslate } from "react-admin";
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
                            <TextField source="name" emptyText="N/A" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.certificates.file_path">
                            <TextField source="file_path" emptyText="N/A" />
                        </FieldTitleLabel>
                    </Section>

                    {/* Detalhes */}
                    <Section title="show.certificates.details" icon={<CalendarToday />}>
                        <FieldTitleLabel label="show.certificates.issuer_name">
                            <TextField source="issuer_name" emptyText="N/A" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.certificates.issuer_url">
                            <TextField source="issuer_url" emptyText="N/A" />
                        </FieldTitleLabel>
                        <Box display="flex" gap={2}>
                            <FieldTitleLabel label="show.certificates.issue_date">
                                <DateField source="issue_date" emptyText="N/A" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.certificates.expiration_date">
                                <DateField source="expiration_date" emptyText="N/A" />
                            </FieldTitleLabel>
                        </Box>
                        <FieldTitleLabel label="show.certificates.is_active">
                            <BooleanField source="is_active" emptyText="N/A" />
                        </FieldTitleLabel>
                    </Section>
                </Grid>

                <Grid item xs={12} md={8} sx={{ height: "100%" }}>
                    {/* Conteúdo */}
                    <Section title="show.certificates.content" icon={<FeedOutlined />}>
                        <Box sx={{ height: 425, flexDirection: "column", overflow: "auto" }}>
                            <Card variant="outlined" sx={{ p: 2, bgcolor: "InfoBackground" }}>
                                <Box display="flex" gap={2} flexWrap="wrap">
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray", mb: 1 }}>
                                            {useTranslate()("show.certificates.srv_cert")}
                                        </Typography>
                                        <TextField 
                                            source="srv_cert" 
                                            emptyText="N/A"
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
                                            emptyText="N/A"
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
                                <DateField source="issue_date" showTime emptyText="N/A" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.warehouses.last_modified">
                                <DateField source="last_modified" showTime emptyText="N/A" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.warehouses.last_modified_user">
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
