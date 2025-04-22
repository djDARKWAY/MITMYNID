import PropTypes from 'prop-types';
import { Box, styled, useTheme, useMediaQuery } from '@mui/material';
import {
    useGetIdentity,
    useLocaleState,
    useSidebarState,
    useTheme as useThemeRA
} from 'react-admin';

import MyAppBar from './appbar';
import MyMenu from './menu';
import MySidebar from './sidebar';
import { useEffect, useRef } from 'react';

const Root : any = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    zIndex: 1,
    minHeight: "100vh",
    backgroundColor: theme.palette.background.default,
    position: "relative",
}));

const AppFrame : any = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    overflowX: "auto",
}));

const ContentWithSidebar : any = styled("main")(({ theme }) => ({
    display: "flex",
    flexGrow: 1,
    marginTop: '10px'
}));

const Content : any = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    flexGrow: 2,
    padding: theme.spacing(3),
    marginTop: "4em",
    paddingLeft: 5,
    background: theme.sidebar?.background,
    zIndex: 3
}));

const MyLayout = ({
    children,
    title,
} : any) => {

    const initialLoad = useRef<boolean>(false);

    const [open] = useSidebarState();
    const MUITheme = useTheme();
    const isSmall = useMediaQuery(MUITheme.breakpoints.down('sm'));
    const [theme, setTheme] = useThemeRA();
    const [locale, setLocale] = useLocaleState();
    const { data: identity, isLoading } = useGetIdentity();

    useEffect(() => {
        if (isLoading || !identity || initialLoad.current) return;

        initialLoad.current = true;

        if (identity.theme) {
            setTheme(identity.theme);
        }

        if (!locale && identity.favLang) {
            switch (identity.favLang) {
                case 'pt':
                    setLocale('pt');
                    break;
                case 'en':
                    setLocale('en');
                    break;
                case 'fr':
                    setLocale('fr');
                    break;
            }
        }
    }, [isLoading]);

    return (
        <Root>
            <AppFrame sx={{height: '100vh'}}>
                <ContentWithSidebar sx={{marginTop: '0px', marginBottom: '0px'}}>
                    <MySidebar >
                        <MyMenu />
                    </MySidebar>
                    <Content sx={{marginTop: '0px', padding: '0px 0px 30px 0px'}}>
                        <MyAppBar title={title} open={open}/>
                        <Box sx={{
                            paddingTop: '10px',
                            paddingRight: '40px',
                            paddingBottom: isSmall ? '75px' : '0px',
                            paddingLeft: '40px'
                        }}>
                            {children}
                        </Box>
                    </Content>
                </ContentWithSidebar>
            </AppFrame>
        </Root>
    );
};

MyLayout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    dashboard: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
    ]),
    title: PropTypes.string.isRequired,
};

export default MyLayout;