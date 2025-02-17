import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import History from '@mui/icons-material/History';
import { LostState } from "../../assets/icons";
import Typography from '@mui/material/Typography';

import { useAuthenticated, useTranslate } from 'ra-core';

export const Unauthorized = (props:any) => {

    const { className, title, ...rest } = props;

    const translate = useTranslate();
    useAuthenticated();

    return (
        <Root className={className} {...sanitizeRestProps(rest)}>
            <div className={UnauthorizedClasses.message}>
                <LostState/>
                <Typography component={"h1"} sx={{fontSize: '40px', fontWeight: 'bold', color: theme => theme.palette.mode==='dark' ? 'white': 'black'}}>{translate('ra.page.unauthorized')}</Typography>
                <Typography component={"div"} sx={{fontSize: '20px', color: theme => theme.palette.mode==='dark' ? 'white': 'black'}}>{translate('ra.message.unauthorized')}.</Typography>
            </div>
            <div className={UnauthorizedClasses.toolbar}>
                <Button
                    variant="contained"
                    startIcon={<History />}
                    onClick={goBack}
                >
                    {translate('ra.action.back')}
                </Button>
            </div>
        </Root>
    );
};

const sanitizeRestProps = ({
    staticContext,
    history,
    location,
    match,
    ...rest
}: {
    staticContext : any,
    history : any,
    location : any,
    match: any
}) => rest;

Unauthorized.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    location: PropTypes.object,
};

const PREFIX = 'RaUnauthorized';

export const UnauthorizedClasses = {
    icon: `${PREFIX}-icon`,
    message: `${PREFIX}-message`,
    toolbar: `${PREFIX}-toolbar`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
        height: '100%',
    },
    [theme.breakpoints.down('md')]: {
        height: '100vh',
        marginTop: '-3em',
    },

    [`& .${UnauthorizedClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },

    [`& .${UnauthorizedClasses.message}`]: {
        textAlign: 'center',
        fontFamily: 'Roboto, sans-serif',
        // opacity: 0.5,
        margin: '0 1em',
    },

    [`& .${UnauthorizedClasses.toolbar}`]: {
        textAlign: 'center',
        marginTop: '2em',
    },
}));

function goBack() {
    window.history.go(-1);
}
