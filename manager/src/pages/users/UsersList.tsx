import { List, Datagrid, usePermissions, TextField, ArrayField, Loading, SimpleList, WithRecord, FunctionField, useDataProvider } from "react-admin";
import { userFilters } from "./UsersFilter";
import { Box, useTheme, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import RolesField from "./RolesFields";
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import { Users } from "../../utils/types";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import { url } from "../../App";
import adjustDateWithoutTime from "../../components/general/adjustDateWTime";
import { Edit, Delete, Block } from '@mui/icons-material';
import CustomButtonToolTip, { commonListCSS } from "../../components/general/CustomButtonToolTip";
import CustomConfirmButtonToolTip from "../../components/general/CustomConfirmButtonToolTip";
import { responsiveListFilter } from "../../components/general/customCSS";
import { useNotify } from 'react-admin';

export const UsersList = () => {
    const {permissions, isLoading} = usePermissions();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('lg'));
    const dataProvider = useDataProvider();
    const notify = useNotify();

    const handleSoftDelete = async (id: string) => {
        try {
            await dataProvider.update('users', { 
                id: `${id}/soft-delete`, 
                data: {}, 
                previousData: { id } 
            });
            notify('User deleted successfully', { type: 'success' });
        } catch (error) {
            notify('Error deleting user', { type: 'error' });
        }
    };

    const handleBlockUser = async (id: string) => {
        try {
            await dataProvider.update('users', { 
                id: id, 
                data: { blocked: true }, 
                previousData: { id } 
            });
            notify('User blocked successfully', { type: 'success' });
        } catch (error) {
            notify('Error blocking user', { type: 'error' });
        }
    };

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
        filter={{ active: true, blocked: false }}
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
            linkType={"edit"} /> 
            
        : 
        <Datagrid rowClick="show" bulkActionButtons={false}>
            <FunctionField label="resources.utilizadores.fields.nome" source="person_name" render={(record : Users) => (
                <Box sx={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <Box>
                        {
                        record.photo
                        ? 
                        <img src={`${url}/${record.photo}`} style={{width: '40px', height: '40px', borderRadius: '30px'}} alt="user icon"/>
                        :
                        <img src="default-user.svg" style={{width: '40px'}} alt="user icon"/>
                        }
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
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
                            label={"Block User"}
                            color="warning"
                            icon={<Block />} 
                            id={record.id} 
                            disabled={record.blocked}
                            resource={"users"}
                            customAction={() => handleBlockUser(record.id)}
                            />
                            <CustomConfirmButtonToolTip 
                            sx={commonListCSS}
                            label={"ra.action.delete"}
                            color="error"
                            icon={<Delete />} 
                            id={record.id} 
                            disabled={!record.active}
                            resource={"users"}
                            customAction={() => handleSoftDelete(record.id)}
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
