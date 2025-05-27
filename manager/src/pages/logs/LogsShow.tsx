import { Show, TextField, DateField, useTranslate, useRecordContext } from "react-admin";
import { Typography, Divider, Box, Card, CardContent, Grid, Paper, Stack } from "@mui/material";
import { ListAlt, AccessTimeFilled, Info } from "@mui/icons-material";
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

const JsonField = ({ source }: { source: string }) => {
    const record = useRecordContext();
    const translate = useTranslate();
    if (!record || !record[source]) return null;

    const metadata = record[source];
    if (typeof metadata !== "object" || metadata === null) return null;

    return (
        <Card variant="outlined" sx={{ my: 1, p: 2, bgcolor: "background.default", maxWidth: "100%", overflowX: "auto" }}>
            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                <Box component="thead">
                    <Box component="tr" sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                        <Box component="th" sx={{ textAlign: "left", fontWeight: "bold", padding: "8px" }}>
                            {translate("show.logs.metadata.key")}
                        </Box>
                        <Box component="th" sx={{ textAlign: "left", fontWeight: "bold", padding: "8px" }}>
                            {translate("show.logs.metadata.value")}
                        </Box>
                    </Box>
                </Box>
                <Box component="tbody">
                    {Object.entries(metadata).map(([key, value]) => (
                        <Box component="tr" key={key} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                            <Box component="td" sx={{ padding: "8px", fontWeight: "bold", color: "text.secondary" }}>
                                {translate(`show.logs.metadata.${key}`, { _: key })}
                            </Box>
                            <Box component="td" sx={{ padding: "8px", color: "text.primary" }}>
                                {typeof value === "object" ? JSON.stringify(value) : value?.toString() ?? ""}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Card>
    );
};

export const LogsShow = () => (
    <Show>
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 1, backgroundColor: "background.paper" }}>
            <Grid container marginBottom={-2}>
                <Grid item xs={12} md={6} sx={{ pr: { md: 2, xs: 0 }, mb: { xs: 2, md: 0 } }}>
                    {/* Log Details */}
                    <Section title="show.logs.details" icon={<Info />}>
                        <Box display="flex" gap={2} flexWrap="wrap">
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray" }}>
                                    {useTranslate()("show.logs.type")}
                                </Typography>
                                <TextField source="type.type" emptyText="N/A" />
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray" }}>
                                    {useTranslate()("show.logs.message")}
                                </Typography>
                                <TextField source="message" emptyText="N/A" />
                            </Box>
                        </Box>
                    </Section>
                </Grid>

                <Grid item xs={12} md={6}>
                    {/* Timestamp */}
                    <Section title="show.logs.timestamp" icon={<AccessTimeFilled />}>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray" }}>
                                {useTranslate()("show.logs.timestamp")}
                            </Typography>
                            <DateField source="timestamp" showTime emptyText="N/A" />
                        </Box>
                    </Section>
                </Grid>

                <Grid item xs={12}>
                    {/* Metadata */}
                    <Section title="show.logs.data" icon={<ListAlt />}>
                        <JsonField source="metadata" />
                    </Section>
                </Grid>
            </Grid>
        </Paper>
    </Show>
);
