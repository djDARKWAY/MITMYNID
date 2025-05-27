import { Show, TextField, BooleanField, DateField, useTranslate, useRecordContext } from "react-admin";
import { Typography, Divider, Box, Card, CardContent, Grid, Paper, Stack } from "@mui/material";
import { PersonOutlined, PhoneIphone, AccountBox, CalendarToday, CheckCircle, Cancel } from "@mui/icons-material";
import { ReactNode } from "react";
import { url } from "../../App";

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

export const UsersShow = () => {
    return (
        <Show title={<UserShowTitle />}>
            <UserDetails />
        </Show>
    );
};

const UserShowTitle = () => {
    const record = useRecordContext();
    return <span>{record?.person_name || "Utilizador"}</span>;
};

const UserDetails = () => {
    const record = useRecordContext();

    return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 1, bgcolor: "background.paper", mb: -2.7 }}>
            <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box
                    sx={{
                        width: 145,
                        height: 145,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '2px solid #ccc',
                    }}
                    >
                    <img
                        src={record?.photo ? `${url}/${record.photo}` : "default-user.svg"}
                        alt="User Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    </Box>
                    <Box textAlign="center">
                    <Typography variant="h6" fontWeight="bold">
                        <TextField source="person_name" record={record} emptyText="N/A" />
                    </Typography>
                    <Typography variant="body2" color="gray"></Typography>
                                <Typography variant="body2" sx={{ color: "gray" }}>
                                    <TextField source="username" record={record} emptyText="N/A" />
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    <Section title="show.users.personal_info" icon={<PersonOutlined />}>
                        <FieldTitleLabel label="show.users.nif">
                            <TextField source="nif" record={record} emptyText="N/A" />
                        </FieldTitleLabel>
                        <Box display="flex" gap={2}>
                            <FieldTitleLabel label="show.users.cc">
                                <TextField source="nic" record={record} emptyText="N/A" />{" "}
                                <TextField source="cc_num" record={record} emptyText="N/A" />
                            </FieldTitleLabel>
                        </Box>
                        <Box display="flex" gap={2}>
                            <FieldTitleLabel label="show.users.address">
                                <TextField source="address" record={record} emptyText="N/A" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.users.post_code">
                                <TextField source="post_code" record={record} emptyText="N/A" />
                            </FieldTitleLabel>
                        </Box>
                    </Section>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Section title="show.users.contacts" icon={<PhoneIphone />}>
                        <Box display="flex" gap={2}>
                            <FieldTitleLabel label="show.users.phone">
                                <TextField source="phone" record={record} emptyText="N/A" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.users.mobile">
                                <TextField source="mobile" record={record} emptyText="N/A" />
                            </FieldTitleLabel>
                        </Box>
                        <FieldTitleLabel label="show.users.email">
                            <TextField source="email" record={record} emptyText="N/A" />
                        </FieldTitleLabel>
                    </Section>

                    <Section title="show.users.status" icon={<AccountBox />}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <FieldTitleLabel label="show.users.active">
                                    <ColoredBoolean source="active" record={record} emptyText="N/A" />
                                </FieldTitleLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FieldTitleLabel label="show.users.blocked">
                                    <ColoredBoolean source="blocked" record={record} emptyText="N/A" />
                                </FieldTitleLabel>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FieldTitleLabel label="show.users.deleted">
                                    <ColoredBoolean source="deleted" record={record} emptyText="N/A" />
                                </FieldTitleLabel>
                            </Grid>
                        </Grid>
                    </Section>

                    <Section title="show.users.logs" icon={<CalendarToday />}>
                        <Box display="flex" gap={2} flexWrap="wrap" sx={{ height: "45px" }}>
                            <FieldTitleLabel label="show.users.validation_date">
                                <DateField source="validation_date" record={record} emptyText="N/A" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.users.last_access">
                                <DateField source="last_access" record={record} emptyText="N/A" />
                            </FieldTitleLabel>
                        </Box>
                    </Section>
                </Grid>
            </Grid>
        </Paper>
    );
};

// Componente auxiliar (Copilot)
const ColoredBoolean = ({ source, record, emptyText }: { source: string; record: any; emptyText?: string }) => {
    const value = record?.[source];
    if (value === true) {
        return <CheckCircle sx={{ color: 'green' }} />;
    } else if (value === false) {
        return <Cancel sx={{ color: 'red' }} />;
    } else {
        return <span style={{ color: 'gray' }}>{emptyText || 'N/A'}</span>;
    }
};
