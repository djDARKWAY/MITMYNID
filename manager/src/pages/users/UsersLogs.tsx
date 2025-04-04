import { Datagrid, List, FunctionField, usePermissions, WithRecord, TextField, useTranslate } from "react-admin";
import { Box, Typography } from "@mui/material";
import { Edit, Restore, LockOpen } from "@mui/icons-material";
import CustomButtonToolTip, { commonListCSS } from "../../components/general/CustomButtonToolTip";
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import { Users } from "../../utils/types";
import { url } from "../../App";

const UsersLogs = () => {
    const { permissions, isLoading } = usePermissions();
    const translate = useTranslate();

    if (isLoading) return null;

    return (
        <Box display="flex" gap="20px" flexWrap="wrap">
            {/* Blocked Users */}
            <Box flex="1">
                <Typography variant="h6" gutterBottom>
                    {translate("resources.users.blocked_users")}
                </Typography>
                <List
                    resource="users"
                    actions={false}
                    queryOptions={{
                        refetchOnWindowFocus: false,
                        meta: { filter: { blocked: true } },
                    }}
                    filter={{ blocked: true }}
                    empty={<CustomEmptyPage />}
                    exporter={false}
                    title={translate("resources.users.blocked_users")}
                >
                    <Datagrid bulkActionButtons={false} rowClick={false}>
                        <FunctionField
                            label={translate("resources.utilizadores.fields.nome")}
                            source="person_name"
                            render={(record: Users) => (
                                <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                    <Box>
                                        {record.photo ? (
                                            <img
                                                src={`${url}/${record.photo}`}
                                                style={{ width: "40px", height: "40px", borderRadius: "30px" }}
                                                alt="user icon"
                                            />
                                        ) : (
                                            <img src="default-user.svg" style={{ width: "40px" }} alt="user icon" />
                                        )}
                                    </Box>
                                    <Box sx={{ marginTop: "-6px" }}>
                                        <Typography component={"span"} fontSize="14px">
                                            {record.person_name}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        />
                        <TextField source="username" label={translate("resources.users.fields.username")} />
                        <Box sx={{ gap: "4px", float: "right" }}>
                        </Box>
                    </Datagrid>
                </List>
            </Box>

            {/* Deleted Users */}
            <Box flex="1">
                <Typography variant="h6" gutterBottom>
                    {translate("resources.users.deleted_users")}
                </Typography>
                <List
                    resource="users"
                    actions={false}
                    queryOptions={{
                        refetchOnWindowFocus: false,
                        meta: { filter: { deleted: true } },
                    }}
                    filter={{ deleted: true }}
                    empty={<CustomEmptyPage />}
                    exporter={false}
                    title={translate("resources.users.deleted_users")}
                >
                    <Datagrid bulkActionButtons={false} rowClick={false}>
                        <FunctionField
                            label={translate("resources.utilizadores.fields.nome")}
                            source="person_name"
                            render={(record: Users) => (
                                <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                    <Box>
                                        {record.photo ? (
                                            <img
                                                src={`${url}/${record.photo}`}
                                                style={{ width: "40px", height: "40px", borderRadius: "30px" }}
                                                alt="user icon"
                                            />
                                        ) : (
                                            <img src="default-user.svg" style={{ width: "40px" }} alt="user icon" />
                                        )}
                                    </Box>
                                    <Box sx={{ marginTop: "-6px" }}>
                                        <Typography component={"span"} fontSize="14px">
                                            {record.person_name}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        />
                        <TextField source="username" label={translate("resources.users.fields.username")} />
                        <Box sx={{ gap: "4px", float: "right" }}>
                        </Box>
                    </Datagrid>
                </List>
            </Box>
        </Box>
    );
};

export default UsersLogs;
