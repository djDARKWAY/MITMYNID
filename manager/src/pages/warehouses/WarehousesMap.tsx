import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { url } from '../../App';
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const FlyIntroduction: React.FC = () => {
    const map = useMap();

    useEffect(() => {
        map.flyToBounds([[43.154311, -10.526570], [35.96125, -5.189159]], { duration: 1 });
    }, [map]);

    return null;
};

const MapEvents: React.FC<{
    setLineCoordinates: React.Dispatch<React.SetStateAction<[number, number][]>>;
    setSelectedWarehouse: React.Dispatch<React.SetStateAction<any | null>>;
}> = ({ setLineCoordinates, setSelectedWarehouse }) => {
    useMap().on('popupclose', () => {
        setLineCoordinates([]);
        setSelectedWarehouse(null);
    });
    return null;
};

const WarehousesMap: React.FC = () => {
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(null);
    const [lineCoordinates, setLineCoordinates] = useState<[number, number][]>([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [userIcon, setUserIcon] = useState<L.DivIcon | null>(null);
    const [warehouseIcon, setWarehouseIcon] = useState<L.Icon | null>(null);
    const navigate = useNavigate();
    const theme = useTheme();
    const [popupOpenState, setPopupOpenState] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const res = await fetch(`${url}/warehouses`);
                setWarehouses(await res.json());
            } catch (error) {
                console.error("Erro ao procurar entidades:", error);
            }
        };

        fetchWarehouses();
        navigator.geolocation?.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => setUserLocation([latitude, longitude]),
            (error) => console.error("Erro ao obter localização do usuário:", error)
        );
    }, []);

    useEffect(() => {
        setUserIcon(new L.DivIcon({
            className: "google-marker",
            html: `<div style="width: 15px; height: 15px; background-color: #5384ED; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);"></div>`,
        }));

        setWarehouseIcon(new L.Icon({
            iconUrl: '/src/assets/map/warehouse.png',
            iconSize: [20, 20],
            iconAnchor: [10, 20],
        }));
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleDistanceFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDistanceFilter(value ? parseFloat(value) : null);
    };

    const filteredWarehouses = useMemo(() => {
        return warehouses.filter((c) => {
            if (!c.lat || !c.lon) return false;
    
            const distance = userLocation
                ? calculateDistance(userLocation[0], userLocation[1], c.lat, c.lon)
                : Infinity;
            const matchesSearch = !debouncedSearchTerm || c.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            const matchesDistance = distanceFilter === null || distance <= distanceFilter;

            return matchesSearch && matchesDistance;
        });
    }, [warehouses, debouncedSearchTerm, userLocation, distanceFilter]);

    const handleMarkerClick = (warehouse: any) => {
        if (userLocation) {
            const distance = calculateDistance(userLocation[0], userLocation[1], warehouse.lat, warehouse.lon);
            setSelectedWarehouse({ ...warehouse, distance });
            setLineCoordinates([]);            
            setPopupOpenState({});
        }
    };

    useEffect(() => {
        if (selectedWarehouse && userLocation) {
            const start = userLocation;
            const end = [selectedWarehouse.lat, selectedWarehouse.lon] as [number, number];
            const steps = 20;
            const latStep = (end[0] - start[0]) / steps;
            const lonStep = (end[1] - start[1]) / steps;

            let currentStep = 0;
            const interval = setInterval(() => {
                setLineCoordinates([start, [start[0] + latStep * currentStep, start[1] + lonStep * currentStep]]);
                if (++currentStep > steps) {
                    clearInterval(interval);
                    setPopupOpenState((prev) => ({ ...prev, [selectedWarehouse.id]: true }));
                }
            }, 8);

            return () => clearInterval(interval);
        }
    }, [selectedWarehouse, userLocation]);

    return (
        <div style={{ height: "calc(100vh - 120px)", width: "100%", position: "relative" }}>
            <button
                onClick={() => navigate("/warehouses")}
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
                    width: "auto",
                    padding: "5px",
                    gap: "5px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >
                <TextField
                    label="Entidade"
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
                <TextField
                    label="Km"
                    value={distanceFilter !== null ? distanceFilter : ""}
                    onChange={handleDistanceFilterChange}
                    size="small"
                    inputProps={{
                        maxLength: 5,
                    }}
                    InputProps={{
                        style: { color: theme.palette.text.primary },
                    }}
                    InputLabelProps={{
                        style: { color: theme.palette.text.secondary },
                    }}
                    style={{ width: "120px" }}
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
                <MapEvents setLineCoordinates={setLineCoordinates} setSelectedWarehouse={setSelectedWarehouse} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Localização do utilizador */}
                {userLocation && userIcon && <Marker position={userLocation} icon={userIcon} />}
                
                {/* Desenhando a linha */}
                {lineCoordinates.length === 2 && (
                    <Polyline positions={lineCoordinates} color="#5384ED" weight={3} />
                )}

                {/* Localização dos entidades */}
                {filteredWarehouses.filter(c => c.lat && c.lon).map(c => (
                    warehouseIcon && (
                        <Marker key={c.id} position={[c.lat, c.lon]} icon={warehouseIcon} eventHandlers={{
                            click: () => handleMarkerClick(c)
                        }}>
                            <Popup>
                                <h3>{c.name}</h3>
                                <p style={{ margin: "0.5em 0" }}><strong>Localização:</strong> {c.city}, {c.district}</p>
                                <p style={{ margin: "0.5em 0" }}><strong>Código Postal:</strong> {c.zip_code}</p>
                                {selectedWarehouse && selectedWarehouse.id === c.id && userLocation && (
                                    <p><strong>Distância:</strong> {Math.round(selectedWarehouse.distance)} km</p>
                                )}
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
};

export default WarehousesMap;
