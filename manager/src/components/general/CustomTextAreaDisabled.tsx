import { styled } from "@mui/material";

const CustomTextAreaDisabled : any = styled("div", {name: 'CustomTextAreaDisabled'})(({ theme }) => ({
    border: '1px solid rgb(145, 158, 171, 0.4)', 
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: '7px 13px 7px 13px',
    height: 'max-content',
    minHeight: '86px',
    color: theme.palette.mode==='dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', 
    //background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    flex: 'auto'
}));

export default CustomTextAreaDisabled;