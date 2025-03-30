import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { url } from '../../App';
import { useNavigate } from "react-router-dom";

const FlyIntroduction: React.FC = () => {
    const map = useMap();

    useEffect(() => {
        map.flyToBounds([[42.154311, -9.526570], [36.96125, -6.189159]], { duration: 1.5 });
    }, [map]);

    return null;
};

const CompaniesMap: React.FC = () => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await fetch(`${url}/companies`);
                const data = await res.json();
                setCompanies(data);
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };
        fetchCompanies();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords: { latitude, longitude } }) => setUserLocation([latitude, longitude]),
                (error) => console.error("Error getting user location:", error)
            );
        } else {
            console.warn("Geolocation is not supported by this browser.");
        }
    }, []);

    return (
        <div style={{ height: "calc(100vh - 120px)", width: "100%", position: "relative" }}>
            <button
                onClick={() => navigate("/companies")}
                style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1000, padding: "10px 15px", backgroundColor: "#5384ED", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)" }}>
                    Voltar
            </button>
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
                {userLocation && (
                    <Marker
                        position={userLocation}
                        icon={new L.DivIcon({
                            className: "custom-marker",
                            html: `<div style="width: 20px; height: 20px; background-color: #5384ED; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);"></div>`,
                            iconSize: [25, 25],
                        })}
                    >
                    </Marker>
                )}
                {companies.filter(c => c.lat && c.lon).map(c => (
                    <Marker
                        key={c.id}
                        position={[c.lat, c.lon]}
                        icon={new L.Icon({
                            iconUrl: '/src/assets/map/warehouse.png',
                            iconSize: [25, 25],
                            iconAnchor: [12.5, 25] })}
                    >
                        <Popup>
                            <h3>{c.name}</h3>
                            <p><strong>Location:</strong> {c.city}, {c.district}</p>
                            <p><strong>Country:</strong> {c.country_id}</p>
                            <p><strong>Zip Code:</strong> {c.zip_code}</p>
                            {c.phone && <p><strong>Phone:</strong> {c.phone}</p>}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default CompaniesMap;