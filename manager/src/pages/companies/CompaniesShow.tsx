import { Show, TextField, DateField, ReferenceField, useTranslate, useRecordContext } from "react-admin";
import { Typography, Divider, Box, Card, CardContent, Grid, Paper, Stack } from "@mui/material";
import { Home, ContactMail, AccessTimeFilled, Person, Map } from "@mui/icons-material";
import { ReactNode, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
        <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray" }}>
                {translate(label)}
            </Typography>
            {children}
        </Box>
    );
};

const MapUpdater = ({ position, zoomLevel }: { position: [number, number] | null, zoomLevel: number }) => {
    const map = useMap();

    useEffect(() => {
        map.setZoom(zoomLevel);
    }, [map, zoomLevel]);
    
    useEffect(() => {
        if (position) {
            map.setView(position, zoomLevel);
        }
    }, [position, map, zoomLevel]);
    
    return null;
};

const CompanyMap = () => {
    const record = useRecordContext();
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [markerIcon, setMarkerIcon] = useState<L.Icon | null>(null);
    const zoomLevel = 15;
    
    useEffect(() => {
        if (record && record.lat && record.lon) {
            console.log("lat:", record.lat, "lon:", record.lon);
            setPosition([record.lat, record.lon]);
        }
    }, [record]);
    
    useEffect(() => {
        const warehouseIconInstance = new L.Icon({
            iconUrl: "/src/assets/map/warehouse.png",
            iconSize: [25, 25],
            iconAnchor: [12.5, 25],
        });
        setMarkerIcon(warehouseIconInstance);
    }, []);
    
    const defaultPosition: [number, number] = [0, 0];
    
    if (!markerIcon) return null;
    
    return (
        <MapContainer 
            center={defaultPosition} 
            zoom={zoomLevel}
            style={{ height: "710px", width: "100%" }}
            dragging={false}
            doubleClickZoom={false}
            scrollWheelZoom={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapUpdater position={position} zoomLevel={zoomLevel} />
            {position && <Marker position={position} icon={markerIcon}></Marker>}
        </MapContainer>
    );
};

export const CompaniesShow = () => (
    <Show>
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 1, backgroundColor: "background.paper"}}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    {/* Identificação */}
                    <Section title="show.companies.identification" icon={<Person />}>
                        <FieldTitleLabel label="ID">
                            <TextField source="id" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.companies.name">
                            <TextField source="name" />
                        </FieldTitleLabel>
                    </Section>
                    {/* Localização */}
                    <Section title="show.companies.location" icon={<Home />}>
                        <FieldTitleLabel label="show.companies.address">
                            <TextField source="address" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.companies.city">
                            <TextField source="city" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.companies.district">
                            <TextField source="district" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.companies.country">
                            <ReferenceField source="country_id" reference="countries">
                                <TextField source="name" />
                            </ReferenceField>
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.companies.zip_code">
                            <TextField source="zip_code" />
                        </FieldTitleLabel>
                    </Section>
                    {/* Contactos */}
                    <Section title="show.companies.contacts" icon={<ContactMail />}>
                        <FieldTitleLabel label="show.companies.email">
                            <TextField source="email" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.companies.contact">
                            <TextField source="contact" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.companies.phone">
                            <TextField source="phone" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.companies.website">
                            <TextField source="website" />
                        </FieldTitleLabel>
                    </Section>
                </Grid>

                {/* Mapa */}
                <Grid item xs={12} md={6} sx={{ height: "100%" }}>
                    <Section title="Mapa" icon={<Map />}>
                        <CompanyMap />
                    </Section>
                </Grid>

                {/* Logs */}
                <Grid item xs={12} sx={{ marginBottom: "-20px", marginTop: "-20px" }}>
                    <Section title="show.companies.logs" icon={<AccessTimeFilled />}>
                        <FieldTitleLabel label="show.companies.created_date">
                            <DateField source="created_date" showTime />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.companies.last_modified">
                            <DateField source="last_modified" showTime />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.companies.last_modified_user">
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