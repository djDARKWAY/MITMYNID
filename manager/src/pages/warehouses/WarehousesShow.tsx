import { Show, TextField, DateField, ReferenceField, useTranslate, useRecordContext } from "react-admin";
import { Typography, Divider, Box, Card, CardContent, Grid, Paper, Stack } from "@mui/material";
import { Home, ContactMail, AccessTimeFilled, Person, Map } from "@mui/icons-material";
import { ReactNode, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import warehouseIconUrl from "/src/assets/map/warehouse.png";

const Section = React.memo(({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => {
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
});

const FieldTitleLabel = ({ label, children }: { label: string; children: ReactNode }) => {
    const translate = useTranslate();
    return (
        <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray", mt: 2 }}>
                {translate(label)}
            </Typography>
            {children}
        </Box>
    );
};

const MapUpdater = ({ position, zoomLevel }: { position: [number, number] | null, zoomLevel: number }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, zoomLevel);
        } else {
            map.setZoom(zoomLevel);
        }
    }, [position, map, zoomLevel]);

    return null;
};

const WarehouseMap = () => {
    const record = useRecordContext();
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [markerIcon, setMarkerIcon] = useState<L.Icon | null>(null);
    const zoomLevel = 15;
    
    useEffect(() => {
        if (record && typeof record.lat !== "undefined" && typeof record.lon !== "undefined") {
            if (!isNaN(record.lat) && !isNaN(record.lon)) {
                const lat = Number(record.lat);
                const lon = Number(record.lon);
                if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                    setPosition([lat, lon]);
                } else {
                    console.warn("Latitude or longitude out of bounds:", { lat, lon });
                }
            } else {
                console.warn("Invalid latitude or longitude in record:", record);
            }
        }
    }, [record]);
    
    useEffect(() => {
        const warehouseIconInstance = new L.Icon({
            iconUrl: warehouseIconUrl,
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
            minZoom={3}
            maxBounds={[[85, -180], [-85, 180]]}
            maxBoundsViscosity={1}
            style={{ height: "607px", width: "100%" }}
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

export const WarehousesShow = () => (
    <Show>
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 1, backgroundColor: "background.paper"}}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    {/* Identificação */}
                    <Section title="show.warehouses.identification" icon={<Person />}>
                        <TextField source="name" sx={{ fontSize: "1.08rem"}} />
                    </Section>

                    {/* Localização */}
                    <Section title="show.warehouses.location" icon={<Home />}>
                        <FieldTitleLabel label="show.warehouses.address">
                            <TextField source="address" />
                        </FieldTitleLabel>
                        <Box display="flex" gap={2} flexWrap="wrap">
                            <FieldTitleLabel label="show.warehouses.city">
                                <TextField source="city" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.warehouses.district">
                                <TextField source="district" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.warehouses.country">
                                <ReferenceField source="country_id" reference="countries">
                                    <TextField source="name" />
                                </ReferenceField>
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.warehouses.zip_code">
                                <TextField source="zip_code" />
                            </FieldTitleLabel>
                        </Box>
                        <Box display="flex" gap={2}>
                            <FieldTitleLabel label="show.warehouses.latitude">
                                <TextField source="lat" />
                            </FieldTitleLabel>
                            <FieldTitleLabel label="show.warehouses.longitude">
                                <TextField source="lon" />
                            </FieldTitleLabel>
                        </Box>
                    </Section>

                    {/* Contactos */}
                    <Section title="show.warehouses.contacts" icon={<ContactMail />}>
                        <FieldTitleLabel label="show.warehouses.email">
                            <TextField source="email" />
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.warehouses.contact">
                            <Box display="flex" gap={2}>
                                <TextField source="contact" />
                                <TextField source="phone" />
                            </Box>
                        </FieldTitleLabel>
                        <FieldTitleLabel label="show.warehouses.website">
                            <TextField source="website" />
                        </FieldTitleLabel>
                    </Section>
                </Grid>

                {/* Mapa */}
                <Grid item xs={12} md={6}>
                    <Section title={useTranslate()("show.warehouses.map")} icon={<Map />}>
                        <WarehouseMap />
                    </Section>
                </Grid>

                {/* Logs */}
                <Grid item xs={12} sx={{ marginBottom: "-20px", marginTop: "-20px" }}>
                    <Section title="show.warehouses.logs" icon={<AccessTimeFilled />}>
                        <Box display="flex" gap={2} flexWrap="wrap">
                            <FieldTitleLabel label="show.warehouses.created_date">
                                <DateField source="created_date" showTime />
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