import { Datagrid, List, FunctionField, usePermissions, TextField, useTranslate, useDataProvider, useNotify, useRefresh } from "react-admin";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import { url } from "../../App";

const UsersLogs = () => {
    const { isLoading } = usePermissions();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleUnlockUser = async (id: number) => {
        try {
            await dataProvider.update("users", {
                id,
                data: { blocked: false },
                previousData: { id },
                meta: { method: 'PATCH', endpoint: `users/${id}/unlock` },
            });
            notify("Utilizador desbloqueado com sucesso", { type: "success" });
            refresh();
        } catch (error) {
            notify("Erro ao desbloquear utilizador", { type: "error" });
        }
    };

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
                            render={(record) => (
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
                        <FunctionField
                            label="Ações"
                            render={(record) => (
                                <Box sx={{ display: "flex", gap: "4px" }}>
                                    <Tooltip title="Desbloquear">
                                        <IconButton onClick={() => handleUnlockUser(record.id)} size="small">
                                            <LockOpen />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            )}
                        />
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
                            render={(record) => (
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
                    </Datagrid>
                </List>
            </Box>
        </Box>
    );
};

export default UsersLogs;
