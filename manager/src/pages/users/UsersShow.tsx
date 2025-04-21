import { Show, TextField, BooleanField, DateField, useTranslate, useRecordContext, ReferenceField } from "react-admin";
import { Typography, Divider, Box, Card, CardContent, Grid, Paper, Stack } from "@mui/material";
import { PersonOutlined, PhoneIphone, Warehouse, AccountBox, CalendarToday } from "@mui/icons-material";
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
        <Show>
            <UserDetails />
        </Show>
    );
};

const UserDetails = () => {
    const record = useRecordContext();

    return (
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 1, backgroundColor: "background.paper" }}>
            <Grid container spacing={2.5}>
                <Grid item xs={12} md={4}>
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
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {record?.person_name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "gray" }}>
                                    {record?.username}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    <Section title="show.users.personal_info" icon={<PersonOutlined />}>
                        <FieldTitleLabel label="show.users.nif">
                            <TextField source="nif" />
                        </FieldTitleLabel>
                        <Box display="flex" gap={2}>
                            <FieldTitleLabel label="show.users.cc">
                                <TextField source="nic" />{" "}<TextField source="cc_num" />
                            </FieldTitleLabel>
                        </Box>
                        <Box display="flex" gap={2}>
                            <FieldTitleLabel label="show.users.address">
                                <TextField source="address" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.users.post_code">
                                <TextField source="post_code" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} />
                            </FieldTitleLabel>
                        </Box>
                    </Section>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Section title="show.users.contacts" icon={<PhoneIphone />}>
                        <Box display="flex" gap={2}>
                            <FieldTitleLabel label="show.users.phone">
                                <TextField source="phone" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.users.mobile">
                                <TextField source="mobile" />
                            </FieldTitleLabel>
                        </Box>
                        <FieldTitleLabel label="show.users.email">
                            <TextField source="email" />
                        </FieldTitleLabel>
                    </Section>

                    <Section title="show.users.status" icon={<AccountBox />}>
                        <Box display="flex" gap={2}>
                            <FieldTitleLabel label="show.users.active">
                                <BooleanField source="active" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.users.blocked">
                                <BooleanField source="blocked" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.users.deleted">
                                <BooleanField source="deleted" />
                            </FieldTitleLabel>
                        </Box>
                    </Section>

                    <Section title="show.users.logs" icon={<CalendarToday />}>
                        <Box display="flex" gap={2} flexWrap="wrap">
                            <FieldTitleLabel label="show.users.validation_date">
                                <DateField source="validation_date" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.users.last_access">
                                <DateField source="last_access" />
                            </FieldTitleLabel>
                        </Box>
                    </Section>
                </Grid>
            </Grid>
        </Paper>
    );
};
