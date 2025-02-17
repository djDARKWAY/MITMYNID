import {
    List,
    MenuItem,
    ListItemIcon,
    Collapse,
    Tooltip,
    Box,
    ListItemText,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useTranslate, useSidebarState } from 'react-admin';


const SubMenu = (props : any) => {
    const { handleToggle, isOpen, name, icon, children, dense } = props;
    const translate = useTranslate();
    const [sidebarIsOpen] = useSidebarState();

    const header = (
        <MenuItem dense={dense} onClick={handleToggle} className={"sidebar " + (sidebarIsOpen ? 'open' : 'close')} sx={{color: !sidebarIsOpen ? 'transparent' : 'primary'}}>
            <Box sx={{display: 'flex', alignItems: 'center', marginRight: '6px'}} >
                <Box mr={'0.25em'} mt={'0.25em'} sx={{position: 'relative'}}>
                    <ListItemIcon>
                        {icon}
                    </ListItemIcon>
                    <ListItemIcon sx={{
                    position: 'absolute', 
                    /* property name | duration | timing function | delay */
                    color: theme => !sidebarIsOpen ? theme.palette.primary.main : 'rgba(0,0,0,0)', 
                    transition: 'initial 1.6s ease-in 0s',
                    bottom: '-10%', 
                    right: !sidebarIsOpen ? '-45%' : '150%'
                    }}>
                        {isOpen ? <ExpandMore /> : <ExpandLess />}
                    </ListItemIcon>
                </Box>
                <Box >
                    <ListItemText>
                        {translate(name)}
                    </ListItemText>
                </Box>
                
            </Box>
            <ListItemIcon sx={{color: sidebarIsOpen ? 'default' : 'rgb(0,0,0,0)', transition: 'color 0.2s ease-in-out 0s'}}>
                {isOpen ? <ExpandMore /> : <ExpandLess />}
            </ListItemIcon>
        </MenuItem>
    );

    return (
        <>
            {sidebarIsOpen || isOpen ? (
                header
            ) : (
                <Tooltip title={translate(name)} placement="right">
                    {header}
                </Tooltip>
            )}
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List
                    dense={dense}
                    component="div"
                    disablePadding
                    sx={{
                        '&a': {
                            transition:'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                            paddingLeft: sidebarIsOpen ? 4 : 2,
                        },
                        marginBottom: '10px'
                    }}
                >
                    {children}
                </List>
            </Collapse>
        </>
    );
};



export default SubMenu;