import { Sidebar } from 'react-admin';

const MySidebar = (props : any) => {
    return <Sidebar sx={{borderRight: theme => theme.sidebar.borderRight, height: '100%', background: theme => theme.sidebar.background}} {...props}/>;
};

export default MySidebar;