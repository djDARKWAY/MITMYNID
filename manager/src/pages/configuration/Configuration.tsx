import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Box, Typography } from "@mui/material";
import { useTranslate, useLocaleState, Title, useAuthenticated } from 'react-admin';

const Configuration = () => {

    useAuthenticated();

    const translate = useTranslate();
    const [locale, setLocale] = useLocaleState();

    return (
        <Card
        sx={{
            padding: '20px',
            marginTop: 2,
            marginBottom: '1em',
        }}>
            <Title title={translate('pos.menu.config')} />
            <CardContent>
                <Box sx={{width: '10em', display: 'inline-block', fontSize: '19px', fontWeight: 'bold'}}>
                    <Typography sx={{fontWeight: 'bold'}}>{translate('pos.language')}</Typography>
                </Box>
                <Button
                    variant="contained"
                    sx={{margin: '1em'}}
                    color={locale === 'en' ? 'primary' : 'secondary'}
                    onClick={() => {setLocale('en')}}
                >
                    en
                </Button>
                <Button
                    variant="contained"
                    sx={{margin: '1em'}}
                    color={locale === 'pt' ? 'primary' : 'secondary'}
                    onClick={() => {setLocale('pt')}}
                >
                    pt
                </Button>
                <Button
                    variant="contained"
                    sx={{margin: '1em'}}
                    color={locale === 'fr' ? 'primary' : 'secondary'}
                    onClick={() => {setLocale('fr')}}
                >
                    fr
                </Button>
                <Button
                    variant="contained"
                    sx={{margin: '1em'}}
                    color={locale === 'es' ? 'primary' : 'secondary'}
                    onClick={() => {setLocale('es')}}
                >
                    es
                </Button>
            </CardContent>
        </Card>
    );
};

export default Configuration;
