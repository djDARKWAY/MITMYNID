import Box from '@mui/material/Box';
import { useRedirect } from 'react-admin';



const Header = (props: any) => {

    const redirect = useRedirect();


    return (
        <Box width={'100%'} {...props} sx={{ ...props.sx, backgroundColor: '#262f62', padding: '1rem' }} >
            <img src='cologistics_horizontal.svg' height={'75px'} style={{ filter: 'saturate(0) brightness(50%) invert(1)', cursor:'pointer' }} onClick={() => redirect('/')} />
        </Box>
    )

}

export default Header
