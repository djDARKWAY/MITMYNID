import { Title, useAuthenticated, usePermissions } from 'react-admin';
import { Box} from "@mui/material";

const Dashboard = () => {

    useAuthenticated();
    usePermissions();

    return (
    <Box sx={{marginTop: '10px'}}>
        <Title title="ra.page.dashboard" />
        <Box>
            Painel de controlo
        </Box>
    </Box>
    );
};

export default Dashboard;