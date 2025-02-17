import { CreateButton, useListContext, useResourceDefinition, useTranslate } from "react-admin";
import { Box, Typography } from "@mui/material";
import EmptyImg from "../../assets/EmptyImg";

const CustomEmptyPage = ({
    hasCreate
}: {
    hasCreate?: boolean
}) => {

    const {resource} = useListContext();
    const translate = useTranslate();
    const resourceDef = useResourceDefinition();
    
    return (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%'}}>
            <Box textAlign="center" m={1}>
                <EmptyImg/>
                <Typography variant="h4" paragraph color={theme => theme.palette.mode==='dark' ? 'white' : 'black'}>
                    {translate('ra.page.empty', {name: resource})}
                </Typography>
                {hasCreate || (hasCreate===undefined && resourceDef && resourceDef.hasCreate) ? <CreateButton variant="contained"/> : <></>}
            </Box>
        </Box>
    );
};

export default CustomEmptyPage;