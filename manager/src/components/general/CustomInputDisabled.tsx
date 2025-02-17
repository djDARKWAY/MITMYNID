import { styled, Box } from "@mui/material";

const CustomInputDisabled : any = styled(Box, {name: 'CustomInputDisabled'})(({ theme }) => ({
    border: '1px solid rgb(145, 158, 171, 0.4)', 
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: '7px 13px 7px 13px',
    color: theme.palette.mode==='dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', 
    //background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    flex: 'auto'
}));

export default CustomInputDisabled;