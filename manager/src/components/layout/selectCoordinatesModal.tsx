import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import warehousePin from "../../assets/map/warehouse.png";

interface SelectCoordinatesMapModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (lat: number, lon: number) => void;
  initialLat?: number;
  initialLon?: number;
}

const markerIcon = new L.Icon({
  iconUrl: warehousePin,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const LocationSelector = ({ onSelect, position, setPosition }: any) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} icon={markerIcon} /> : null;
};

const SelectCoordinatesMapModal: React.FC<SelectCoordinatesMapModalProps> = ({
  open,
  onClose,
  onSelect,
  initialLat,
  initialLon,
}) => {
  const theme = useTheme();
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLon ? [initialLat, initialLon] : null
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
      }}
    >
      <DialogTitle>Selecionar localização no mapa</DialogTitle>
      <DialogContent>
        <div style={{ height: 550, width: "100%", position: "relative" }}>
          {" "}
          <MapContainer
            center={[39.5, -8.0]} 
            zoom={5} 
            minZoom={2} 
            style={{ height: "100%", width: "100%" }}
            maxBounds={[[85, -180], [-85, 180]]}
            maxBoundsViscosity={1}
            preferCanvas
            zoomSnap={0.2} 
            zoomDelta={1}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationSelector
              onSelect={onSelect}
              position={position}
              setPosition={setPosition}
            />
          </MapContainer>
          {position && (
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: "50%",
                transform: "translateX(-50%)",
                background: theme.palette.background.paper,
                padding: theme.spacing(0.5, 1),
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[2],
                zIndex: 1000,
                border: `1px solid ${theme.palette.divider}`,
                textAlign: "center",
                display: "flex",
                gap: theme.spacing(3),
              }}
            >
              <span>
                <strong>Lat:</strong> {position[0].toFixed(6)}
              </span>
              <span>
                <strong>Lon:</strong> {position[1].toFixed(6)}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions sx={{ mt: -1, mr: 2, mb: 0.75 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={() => {
            if (position) onSelect(position[0], position[1]);
          }}
          disabled={!position}
          variant="contained"
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectCoordinatesMapModal;
