import { Title, useAuthenticated, usePermissions } from 'react-admin';
import { Box } from "@mui/material";
import DashboardStats from './DashboardStats';

const Dashboard = () => {

    useAuthenticated();
    usePermissions();

    return (
        <Box sx={{ marginTop: '10px' }}>
            <Title title="ra.page.dashboard" />
            <Box sx={{ marginTop: '20px' }}>
                <DashboardStats />
            </Box>
        </Box>
    );
};

export default Dashboard;