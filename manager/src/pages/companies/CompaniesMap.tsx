import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { url } from '../../App';
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const FlyIntroduction: React.FC = () => {
    const map = useMap();

    useEffect(() => {
        map.flyToBounds([[43.154311, -10.526570], [35.96125, -5.189159]], { duration: 1 });
    }, [map]);

    return null;
};

const CompaniesMap: React.FC = () => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [userIcon, setUserIcon] = useState<L.DivIcon | null>(null);
    const [warehouseIcon, setWarehouseIcon] = useState<L.Icon | null>(null);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await fetch(`${url}/companies`);
                const data = await res.json();
                setCompanies(data);
            } catch (error) {
                console.error("Erro ao buscar armazéns:", error);
            }
        };
        fetchCompanies();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords: { latitude, longitude } }) => setUserLocation([latitude, longitude]),
                (error) => console.error("Erro ao obter localização do usuário:", error)
            );
        } else {
            console.warn("Geolocalização não é suportada pelo navegador.");
        }
    }, []);

    useEffect(() => {
        const userIconInstance = new L.DivIcon({
            className: "google-marker",
            html: `<div style="width: 20px; height: 20px; background-color: #5384ED; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); cursor: default;"></div>`,
            iconSize: [25, 25],
        });
        setUserIcon(userIconInstance);

        const warehouseIconInstance = new L.Icon({
            iconUrl: '/src/assets/map/warehouse.png',
            iconSize: [25, 25],
            iconAnchor: [12.5, 25],
        });
        setWarehouseIcon(warehouseIconInstance);
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredCompanies = useMemo(() => 
        companies.filter((c) => 
            !debouncedSearchTerm || c.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        ),
        [companies, debouncedSearchTerm]
    );

    return (
        <div style={{ height: "calc(100vh - 120px)", width: "100%", position: "relative" }}>
            <button
                onClick={() => navigate("/companies")}
                style={{
                    position: "absolute", top: "10px", right: "10px", zIndex: 1000, 
                    padding: "10px 15px", backgroundColor: "#5384ED", color: "#fff", 
                    border: "none", borderRadius: "5px", cursor: "pointer", 
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)"
                }}
            >
                Voltar
            </button>

            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: "10px",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.4)",
                    width: "300px",
                }}
            >
                <TextField
                    label="Armazém"
                    name="name"
                    value={searchTerm}
                    onChange={handleFilterChange}
                    fullWidth
                    size="small"
                    InputProps={{
                        style: { color: theme.palette.text.primary },
                    }}
                    InputLabelProps={{
                        style: { color: theme.palette.text.secondary },
                    }}
                />
            </div>

            <MapContainer 
                center={[39.5, -8.0]} 
                zoom={3} 
                minZoom={3} 
                style={{ height: "100%", width: "100%" }}
                maxBounds={[[85, -180], [-85, 180]]}
                maxBoundsViscosity={1}
                preferCanvas
                zoomSnap={0.2} 
                zoomDelta={1}
            >
                <FlyIntroduction />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Localização do utilizador */}
                {userLocation && userIcon && <Marker position={userLocation} icon={userIcon} />}
                {/* Localização dos armazéns */}
                {filteredCompanies.filter(c => c.lat && c.lon).map(c => (
                    warehouseIcon && (
                        <Marker key={c.id} position={[c.lat, c.lon]} icon={warehouseIcon}>
                            <Popup>
                                <h3>{c.name}</h3>
                                <p style={{ margin: "0.5em 0" }}><strong>Localização:</strong> {c.city}, {c.district}</p>
                                <p style={{ margin: "0.5em 0" }}><strong>Código Postal:</strong> {c.zip_code}</p>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
};

export default CompaniesMap;
