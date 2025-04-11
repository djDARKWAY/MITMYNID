import { Title, useAuthenticated, usePermissions } from "react-admin";
import { Box } from "@mui/material";
import AccessPointsStats from "./AccessPointsStats";
import CertificatesStats from "./CertificatesStats";
import WarehousesStats from "./WarehousesStats";
import LogsStats from "./LogsStats";

const Dashboard = () => {
  useAuthenticated();
  usePermissions();

  return (
    <Box sx={{ marginTop: "10px" }}>
      <Title title="ra.page.dashboard" />

      <AccessPointsStats />

      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        <Box sx={{ flex: 1 }}>
          <CertificatesStats />
        </Box>
        <Box sx={{ flex: 1 }}>
          <WarehousesStats />
        </Box>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <LogsStats />
      </Box>
    </Box>
  );
};

export default Dashboard;
