import { Title, useAuthenticated, usePermissions } from 'react-admin';
import { Box } from "@mui/material";
import AccessPointsStats from './AccessPointsStats';

const Dashboard = () => {

    useAuthenticated();
    usePermissions();

    return (
        <Box sx={{ marginTop: '10px' }}>
            <Title title="ra.page.dashboard" />
            <Box sx={{ marginTop: '20px' }}>
                <AccessPointsStats />
            </Box>
        </Box>
    );
};

export default Dashboard;