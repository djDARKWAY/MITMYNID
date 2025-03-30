import { Show, TextField, DateField, ReferenceField, useTranslate } from "react-admin";
import { Typography, Divider, Box, Card, CardContent, Grid, Paper, Stack } from "@mui/material";
import { Home, ContactMail, Language, AccessTimeFilled, Person } from "@mui/icons-material";
import { ReactNode } from "react";

const Section = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => {
    const translate = useTranslate();
    return (
        <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    {icon}
                    <Typography variant="h6" sx={{ ml: 1, fontWeight: "bold" }}>
                        {translate(title)}
                    </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>{children}</Stack>
            </CardContent>
        </Card>
    );
};

const FieldWithLabel = ({ label, children }: { label: string; children: ReactNode }) => {
    const translate = useTranslate();
    return (
        <Box>
            {/* A tradução teve de ser adicionada manualmente*/}
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray" }}>
                {translate(label)}
            </Typography>
            {children}
        </Box>
    );
};

export const CompaniesShow = () => (
    <Show>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    {/* Identificação */}
                    <Section title="show.companies.identification" icon={<Person />}>
                        <FieldWithLabel label="ID"><TextField source="id" /></FieldWithLabel>
                        <FieldWithLabel label="show.companies.name"><TextField source="name" /></FieldWithLabel>
                    </Section>
                    {/* Localização */}
                    <Section title="show.companies.location" icon={<Home />}>
                        <FieldWithLabel label="show.companies.address"><TextField source="address" /></FieldWithLabel>
                        <FieldWithLabel label="show.companies.city"><TextField source="city" /></FieldWithLabel>
                        <FieldWithLabel label="show.companies.district"><TextField source="district" /></FieldWithLabel>
                        <FieldWithLabel label="show.companies.country">
                            <ReferenceField source="country_id" reference="countries">
                                <TextField source="name" />
                            </ReferenceField>
                        </FieldWithLabel>
                        <FieldWithLabel label="show.companies.zip_code"><TextField source="zip_code" /></FieldWithLabel>
                    </Section>
                    {/* Contactos */}
                    <Section title="show.companies.contacts" icon={<ContactMail />}>
                        <FieldWithLabel label="show.companies.email"><TextField source="email" /></FieldWithLabel>
                        <FieldWithLabel label="show.companies.contact"><TextField source="contact" /></FieldWithLabel>
                        <FieldWithLabel label="show.companies.phone"><TextField source="phone" /></FieldWithLabel>
                        <FieldWithLabel label="show.companies.website"><TextField source="website" /></FieldWithLabel>
                    </Section>
                </Grid>

                {/* Mapa */}
                <Grid item xs={12} md={6}></Grid>

                {/* Logs */}
                <Grid item xs={12}>
                    <Section title="show.companies.logs" icon={<AccessTimeFilled />}>
                        <FieldWithLabel label="show.companies.created_date">
                            <DateField source="created_date" showTime />
                        </FieldWithLabel>
                        <FieldWithLabel label="show.companies.last_modified">
                            <DateField source="last_modified" showTime />
                        </FieldWithLabel>
                        <FieldWithLabel label="show.companies.last_modified_user">
                            <ReferenceField source="last_modified_user_id" reference="users">
                                <TextField source="username" />
                            </ReferenceField>
                        </FieldWithLabel>
                    </Section>
                </Grid>
            </Grid>
        </Paper>
    </Show>
);
