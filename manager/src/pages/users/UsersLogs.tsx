import { Datagrid, List, FunctionField, usePermissions, TextField, useTranslate, useDataProvider, useNotify, useRefresh } from "react-admin";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import { LockOpen, Delete, History } from "@mui/icons-material";
import CustomEmptyPage from "../../components/general/CustomEmptyPage";
import CustomPagination, { perPageDefault } from "../../components/general/CustomPagination";
import CustomButtonToolTip, { commonListCSS } from "../../components/general/CustomButtonToolTip";
import CustomConfirmButtonToolTip from "../../components/general/CustomConfirmButtonToolTip";
import { url } from "../../App";

const UsersLogs = () => {
    const { isLoading } = usePermissions();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleCustomAction = async (id: number, endpoint: string, successMessage: string, errorMessage: string) => {
        try {
            await dataProvider.customAction("users", {
                id,
                meta: { method: 'PATCH', endpoint },
            });
            notify(successMessage, { type: "success" });
            refresh();
        } catch (error) {
            notify(errorMessage, { type: "error" });
        }
    };

    if (isLoading) return null;
  
    return (
        <Box display="flex" gap="20px" flexWrap="nowrap">
        {/* Blocked Users */}
        <Box flex="1" overflow="auto">
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
            pagination={<CustomPagination />}
            perPage={perPageDefault}
            title={translate("resources.users.blocked_users")}
          >
            <Datagrid bulkActionButtons={false} rowClick={false}>
              <FunctionField
                label={translate("resources.utilizadores.fields.nome")}
                source="person_name"
                render={(record) => (
                  <Box
                    sx={{ display: "flex", gap: "10px", alignItems: "center" }}
                  >
                    <Box>
                      {record.photo ? (
                        <img
                          src={`${url}/${record.photo}`}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "30px",
                          }}
                          alt="user icon"
                        />
                      ) : (
                        <img
                          src="default-user.svg"
                          style={{ width: "40px" }}
                          alt="user icon"
                        />
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
              <TextField
                source="username"
                label={translate("resources.users.fields.username")}
              />
              <FunctionField
                label="Ações"
                render={(record) => (
                  <Box
                    sx={{
                      display: "flex",
                      gap: "4px",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Tooltip title="Desbloquear">
                      <IconButton
                        onClick={() => handleCustomAction(record.id, `users/${record.id}/unlock`, "Utilizador desbloqueado com sucesso", "Erro ao desbloquear utilizador")}
                        size="small"
                      >
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
        <Box flex="1" overflow="auto">
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
            pagination={<CustomPagination />}
            perPage={perPageDefault}
            title={translate("resources.users.deleted_users")}
          >
            <Datagrid bulkActionButtons={false} rowClick={false}>
              <FunctionField
                label={translate("resources.utilizadores.fields.nome")}
                source="person_name"
                render={(record) => (
                  <Box
                    sx={{ display: "flex", gap: "10px", alignItems: "center" }}
                  >
                    <Box>
                      {record.photo ? (
                        <img
                          src={`${url}/${record.photo}`}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "30px",
                          }}
                          alt="user icon"
                        />
                      ) : (
                        <img
                          src="default-user.svg"
                          style={{ width: "40px" }}
                          alt="user icon"
                        />
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
              <TextField
                source="username"
                label={translate("resources.users.fields.username")}
              />
              <FunctionField
                label="Ações"
                render={(record) => (
                  <Box
                    sx={{
                      display: "flex",
                      gap: "4px",
                      justifyContent: "flex-start",
                    }}
                  >
                    <>
                      <Tooltip title="Restaurar">
                        <IconButton
                          onClick={() => handleCustomAction(record.id, `users/${record.id}/recover`, "Utilizador restaurado com sucesso", "Erro ao restaurar utilizador")}
                          size="small"
                        >
                          <History />
                        </IconButton>
                      </Tooltip>
                      <CustomConfirmButtonToolTip
                        sx={commonListCSS}
                        label={"Eliminar"}
                        color="error"
                        icon={<Delete />}
                        id={record.id}
                        resource={"users"}
                        customAction={() => handleCustomAction(record.id, `users/${record.id}/recover`, "Utilizador restaurado com sucesso", "Erro ao restaurar utilizador")}
                      />
                    </>
                  </Box>
                )}
              />
            </Datagrid>
          </List>
        </Box>
      </Box>
    );
};

export default UsersLogs;
