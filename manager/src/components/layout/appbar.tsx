import { forwardRef } from "react";
import { AppBar, Logout, MenuItemLink, RefreshIconButton, ToggleThemeButton, UserMenu, useTranslate } from "react-admin";
import { Settings, Person } from "@mui/icons-material";
import { Typography } from "@mui/material";

const ConfigurationMenu = forwardRef<any, any>((props, ref) => {
  const translate = useTranslate();
  return (
    <>
      <MenuItemLink
        ref={ref}
        to="/profile"
        className="userMenuItems"
        primaryText={translate("ra.page.profile")}
        leftIcon={<Person />}
        onClick={props.onClick}
        style={{ margin: '0px 10px 0px 10px' }} />
      <MenuItemLink
        ref={ref}
        to="/configuration"
        className="userMenuItems"
        style={{ margin: '0px 10px 0px 10px' }}
        primaryText={translate("ra.page.configuration")}
        leftIcon={<Settings />}
        onClick={props.onClick} />
    </>
  );
});

const CustomUserMenu = () => (
  <UserMenu >
    <ConfigurationMenu />
    <Logout style={{ margin: '0px 10px 0px 10px' }} />
  </UserMenu>
);

const AppToolbar = () => {
  return (
    <>
      <RefreshIconButton />
      <ToggleThemeButton />
    </>
  );
};

const MyAppBar = (props: any) => {

  return (
    <AppBar
      {...props}
      sx={{ boxShadow: "none", position: 'relative' }}
      userMenu={<CustomUserMenu />}
      toolbar={<AppToolbar />}
    >
      <Typography style={{
        flex: 1,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        fontWeight: "bold",
        fontSize: "20px",
        textTransform: 'uppercase'
      }} id="react-admin-title" />
    </AppBar>
  );
};

export default MyAppBar;
