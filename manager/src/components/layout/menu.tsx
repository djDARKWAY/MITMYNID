import { useRef, useState } from "react";
import {
  Key,
  Insights,
  CellTowerRounded,
  CardMembershipRounded,
  CreditScoreRounded,
  WifiTetheringErrorRounded,
  HowToRegRounded,
  PeopleAltRounded,
  SecurityRounded,
  HistoryOutlined,
  HubRounded,
  ViewCarousel,
  Visibility,
  SignalWifi4BarLock,
  WarehouseRounded,
  ManageAccountsRounded,
} from "@mui/icons-material";
import {
  useTranslate,
  MenuItemLink,
  MenuProps,
  usePermissions,
  useSidebarState,
  useStore,
} from "react-admin";
import SubMenu from "./submenu";
import { Box, Divider } from "@mui/material";
import { Link } from "react-router-dom";

type MenuName =
  | "menuSeguranca"
  | "menuAccessPoint"
  | "menuMonitorizacao"
  | "menuCertificados"
  | "menuConfig"
  | "menuArmazens";

const MyMenu = ({ dense = false }: MenuProps) => {
  const logoBigImg = useRef<string>("MMN_H_RGB.svg");
  const logoSmallImg = useRef<string>("MMN_V_RGB.svg");
  const translate = useTranslate();
  const { permissions, isLoading } = usePermissions();
  //const { identity : profile, isLoading : isLoadingProfile } = useGetIdentity();
  const [resource] = useStore("resource.name");
  const [open] = useSidebarState();

  const [state, setState] = useState({
    menuSeguranca: resource === "menuSeguranca" ? true : false,
    menuAccessPoint: resource === "menuAccessPoint" ? true : false,
    menuCertificados: resource === "menuConfig" ? true : false,
    menuMonitorizacao: resource === "menuConfig" ? true : false,
    menuConfig: resource === "menuConfig" ? true : false,
    menuArmazens: resource === "menuArmazens" ? true : false,
  });

  const handleToggle = (menu: MenuName) => {
    setState((state) => ({ ...state, [menu]: !state[menu] }));
  };

  return !isLoading ? (
    <Box
      sx={{
        width: (theme) =>
          open ? theme.sidebar.width : theme.sidebar.closedWidth,
        marginTop: 1,
        marginBottom: 1,
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
    >
      <Box sx={{ padding: "10px 0px 10px 0px" }}>
        <Link to={"/"}>
          {open ? (
            <Box sx={{ padding: "0px 13px 0px 13px" }}>
              {logoBigImg.current ? (
                <img
                  src={logoBigImg.current}
                  alt="logo"
                  style={{ maxWidth: "220px" }}
                />
              ) : (
                <></>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                maxWidth: "80px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {logoSmallImg.current ? (
                <img
                  src={logoSmallImg.current}
                  alt="logo"
                  style={{ width: "70%", height: "100%", marginLeft: "6px" }}
                />
              ) : (
                <></>
              )}
            </Box>
          )}
        </Link>
      </Box>
      <MenuItemLink
        to={{ pathname: "/dashboard" }}
        className={"sidebar " + (open ? "open" : "close")}
        primaryText={translate(`ra.page.dashboard`)}
        sx={{
          color: (theme) => (!open ? theme.sidebar.background : "default"),
        }}
        leftIcon={<Insights />}
        dense={dense}
      />

      {permissions.includes("ADMIN") && <Divider />}

      {permissions.includes("ADMIN") && (
        <SubMenu
          handleToggle={() => handleToggle("menuSeguranca")}
          isOpen={state.menuSeguranca}
          name="pos.menu.security"
          icon={<SecurityRounded />}
          dense={dense}
        >
          <MenuItemLink
            to={{ pathname: "/users" }}
            className={"submenuItem " + (open ? "open" : "close")}
            primaryText={translate(`resources.utilizadores.name`)}
            sx={{ color: !open ? "transparent" : "default" }}
            leftIcon={<PeopleAltRounded />}
            dense={dense}
          />

          <MenuItemLink
            to={{ pathname: "/validateUsers" }}
            className={"submenuItem " + (open ? "open" : "close")}
            primaryText={translate(`resources.utilizadores.validate`)}
            sx={{ color: !open ? "transparent" : "default" }}
            leftIcon={<HowToRegRounded />}
            dense={dense}
          />

          <MenuItemLink
            to={{ pathname: "/users-logs" }}
            className={"submenuItem " + (open ? "open" : "close")}
            primaryText={translate(`resources.utilizadores.logs`)}
            sx={{ color: !open ? "transparent" : "default" }}
            leftIcon={<HistoryOutlined />}
            dense={dense}
          />

          {permissions.includes("ADMIN") && (
            <MenuItemLink
              to={{ pathname: "/roles" }}
              className={"submenuItem " + (open ? "open" : "close")}
              primaryText={translate("resources.role.name")}
              sx={{ color: !open ? "transparent" : "default" }}
              leftIcon={<Key />}
              dense={dense}
            />
          )}
        </SubMenu>
      )}

      {permissions.includes("ADMIN") && (
        <SubMenu
          handleToggle={() => handleToggle("menuAccessPoint")}
          isOpen={state.menuAccessPoint}
          name="pos.menu.accessPoints"
          icon={<CellTowerRounded />}
          dense={dense}
        >
          <MenuItemLink
            to={{ pathname: "/access-points" }}
            className={"submenuItem " + (open ? "open" : "close")}
            primaryText={translate(`resources.accessPoints.list`)}
            sx={{ color: !open ? "transparent" : "default" }}
            leftIcon={<HubRounded />}
            dense={dense}
          />

          {permissions.includes("ADMIN") && (
            <MenuItemLink
              to={{ pathname: "/." }}
              className={"submenuItem " + (open ? "open" : "close")}
              primaryText={translate("resources.accessPoints.manage")}
              sx={{ color: !open ? "transparent" : "default" }}
              leftIcon={<SignalWifi4BarLock />}
              dense={dense}
            />
          )}
        </SubMenu>
      )}

      {permissions.includes("ADMIN") && (
        <SubMenu
          handleToggle={() => handleToggle("menuCertificados")}
          isOpen={state.menuCertificados}
          name="pos.menu.certificates"
          icon={<CardMembershipRounded />}
          dense={dense}
        >
          <MenuItemLink
            to={{ pathname: "/certificates" }}
            className={"submenuItem " + (open ? "open" : "close")}
            primaryText={translate(`resources.certificates.list`)}
            sx={{ color: !open ? "transparent" : "default" }}
            leftIcon={<ViewCarousel />}
            dense={dense}
          />

          {permissions.includes("ADMIN") && (
            <MenuItemLink
              to={{ pathname: "/." }}
              className={"submenuItem " + (open ? "open" : "close")}
              primaryText={translate(`resources.certificates.validations`)}
              sx={{ color: !open ? "transparent" : "default" }}
              leftIcon={<CreditScoreRounded />}
              dense={dense}
            />
          )}
        </SubMenu>
      )}

      {permissions.includes("ADMIN") && (
        <SubMenu
          handleToggle={() => handleToggle("menuArmazens")}
          isOpen={state.menuArmazens}
          name="pos.menu.companies"
          icon={<WarehouseRounded />}
          dense={dense}
        >
          <MenuItemLink
            to={{ pathname: "/companies" }}
            className={"submenuItem " + (open ? "open" : "close")}
            primaryText={translate(`resources.companies.manage`)}
            sx={{ color: !open ? "transparent" : "default" }}
            leftIcon={<ManageAccountsRounded />}
            dense={dense}
          />
        </SubMenu>
      )}

      {permissions.includes("ADMIN") && (
        <SubMenu
          handleToggle={() => handleToggle("menuMonitorizacao")}
          isOpen={state.menuMonitorizacao}
          name="pos.menu.monitoring"
          icon={<Visibility />}
          dense={dense}
        >
          <MenuItemLink
            to={{ pathname: "/." }}
            className={"submenuItem " + (open ? "open" : "close")}
            primaryText={translate(`resources.monitoring.status`)}
            sx={{ color: !open ? "transparent" : "default" }}
            leftIcon={<WifiTetheringErrorRounded />}
            dense={dense}
          />
          {permissions.includes("ADMIN") && (
            <MenuItemLink
              to={{ pathname: "/logs" }}
              className={"submenuItem " + (open ? "open" : "close")}
              primaryText={translate(`resources.monitoring.logs`)}
              sx={{ color: !open ? "transparent" : "default" }}
              leftIcon={<HistoryOutlined />}
              dense={dense}
            />
          )}
        </SubMenu>
      )}
    </Box>
  ) : null;
};

export default MyMenu;
