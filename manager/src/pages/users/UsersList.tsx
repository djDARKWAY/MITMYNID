import { List, Datagrid, usePermissions, TextField, ArrayField, BooleanField, Loading, SimpleList, WithRecord, FunctionField } from "react-admin";
import { userFilters } from "./UsersFilter";
import { Box, useTheme, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import RolesField from "./RolesFields";
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import { Users } from "../../utils/types";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { url } from "../../App";
import adjustDateWithoutTime from "../../components/general/adjustDateWTime";
import { Edit, Delete } from '@mui/icons-material';
import CustomButtonToolTip, { commonListCSS } from "../../components/general/CustomButtonToolTip";
import CustomConfirmButtonToolTip from "../../components/general/CustomConfirmButtonToolTip";
import { responsiveListFilter } from "../../components/general/customCSS";

export const UsersList = () => {

    const {permissions, isLoading} = usePermissions();

    const theme = useTheme();

    const isSmall = useMediaQuery(theme.breakpoints.down('lg'));

    return !isLoading ? (
    <List  
    queryOptions={{ 
        refetchOnWindowFocus: false,
        meta: {
            include: [
                {
                    relation: 'roles'
                }
            ]
        }
    }} 
    pagination={<CustomPagination/>} 
    perPage={perPageDefault} 
    filters={userFilters(permissions)} 
    empty={<CustomEmptyPage/>}  
    exporter={false} 
    title="resources.utilizadores.name" 
    sx={{paddingLeft: '10px', ...responsiveListFilter}}
    >
        {isSmall 
        ? 
        <SimpleList 
            primaryText={record => record.person_name} 
            secondaryText={record => record.username} 
            //tertiaryText={record => record.email}
            linkType={"edit"} /> 
            
        : 
        <Datagrid bulkActionButtons={false}>
            <FunctionField label="resources.utilizadores.fields.nome" source="person_name" render={(record : Users) => (
                <Box sx={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <Box>
                        {
                        record.photo
                        ? 
                        <img src={url + "/" + record.photo} style={{width: '40px', height: '40px', borderRadius: '30px'}} alt="user icon"/>
                        :
                        <img src="default-user.svg" style={{width: '40px'}} alt="user icon"/>
                        }
                    </Box>
                    <Box sx={{marginTop: '-6px'}}>
                        <Typography component={"span"} fontSize="14px">{record.person_name}</Typography>
                    </Box>
                </Box>
            )}  />
            <TextField source="username" label="resources.utilizadores.fields.username" />
            <ArrayField source="roles" label="resources.utilizadores.fields.roles" sortable={false}>
                <RolesField/>  
            </ArrayField>
            <FunctionField
                source={'validation_date'}
                label="resources.utilizadores.fields.validation_date" 
                render={(record : Users) => record.validation_date ? `${adjustDateWithoutTime(record.validation_date)}` : null}
            />
            {permissions.includes('ADMIN') &&  <BooleanField source="active" label="resources.utilizadores.fields.ativo" /> }
            <Box sx={{gap: '4px', float: 'right'}}>
                <WithRecord render={(record : Users) => {
                    return( 
                        <>
                            <CustomButtonToolTip 
                            icon={<Edit/>} 
                            label={"ra.action.edit"} 
                            action={"redirect"} 
                            id={record.id} 
                            resource={"users"}
                            sx={commonListCSS}
                            />
                            <CustomConfirmButtonToolTip 
                            sx={commonListCSS}
                            label={"ra.action.delete"}
                            color="error"
                            icon={<Delete />} 
                            id={record.id} 
                            disabled={record.active ? false : true}
                            resource={"users"}
                            />
                        </>
                    )
                    }}
                />
            </Box>
        </Datagrid>

        }
    </List>) : <Loading/>;
};
