import { Title, useAuthenticated, usePermissions } from 'react-admin';
import { Box } from "@mui/material";
import AccessPointsStats from './AccessPointsStats';
import CertificatesStats from './CertificatesStats';

const Dashboard = () => {

    useAuthenticated();
    usePermissions();

    return (
        <Box sx={{ marginTop: '10px' }}>
            <Title title="ra.page.dashboard" />
                <Box>
                    <AccessPointsStats />
                </Box>
                <Box sx={{ marginTop: '20px' }}>
                    <CertificatesStats />
                </Box>
            </Box>
    );
};

export default Dashboard;