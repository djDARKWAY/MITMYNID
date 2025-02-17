import { styled } from "@mui/material";

const CustomInputLabel : any = styled("span", {name: 'CustomInputLabel'})(({ theme }) => ({
    fontSize: '0.75em',
    color: theme.palette.mode==='dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', 
    fontFamily: 'Public Sans,sans-serif', 
    position: 'absolute',
    top: -7,
    left: 8,
    //@ts-ignore
    background: theme.components?.MuiCard.styleOverrides?.root.background,
    zIndex: 1,
    padding: '0px 5px 0px 5px'
    //background: 'transparent'
}));

export default CustomInputLabel;