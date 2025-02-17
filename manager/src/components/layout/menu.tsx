import { useRef, useState } from "react";
import {
  People,
  DisplaySettings,
  Security,
  AddBusiness,
  Key,
  MapsHomeWork,
  Handyman,
  Category,
  Flaky,
  Insights,
  WarningAmber,
  Assignment,
  AccountTreeOutlined,
  Approval,
  ManageSearch
} from '@mui/icons-material';
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
import { Link } from 'react-router-dom';

type MenuName = 'menuSeguranca' | 'menuConfig';

const MyMenu = ({ dense = false }: MenuProps) => {

  const logoBigImg = useRef<string>('MMN_H_RGB.svg');
  const logoSmallImg = useRef<string>('MMN_V_RGB.svg');
  const translate = useTranslate();
  const { permissions, isLoading } = usePermissions();
  //const { identity : profile, isLoading : isLoadingProfile } = useGetIdentity();
  const [resource] = useStore('resource.name');
  const [open] = useSidebarState();

  const [state, setState] = useState({
    menuSeguranca: resource === 'menuSeguranca' ? true : false,
    menuConfig: resource === 'menuConfig' ? true : false
  });


  const handleToggle = (menu: MenuName) => {
    setState(state => ({ ...state, [menu]: !state[menu] }));
  };

  return !isLoading ? (
    <Box sx={{
      width: theme => open ? theme.sidebar.width : theme.sidebar.closedWidth,
      marginTop: 1,
      marginBottom: 1,
      transition: theme => theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }}
    >
      <Box sx={{ padding: '10px 0px 10px 0px' }}>
        <Link to={"/"}>
          {open ?
            <Box sx={{ padding: '0px 13px 0px 13px' }}>
              {logoBigImg.current ? <img src={logoBigImg.current} alt="logo" style={{ maxWidth: '220px' }} /> : <></>}
            </Box>
            :
            <Box sx={{ maxWidth: '80px', display: 'flex', justifyContent: 'center' }}>
              {logoSmallImg.current ? <img src={logoSmallImg.current} alt="logo" style={{ width: '70%', height: '100%', marginLeft: '6px' }} /> : <></>}
            </Box>
          }
        </Link>
      </Box>
      <MenuItemLink
        to={{ pathname: "/dashboard" }}
        className={"sidebar " + (open ? 'open' : 'close')}
        primaryText={translate(`ra.page.dashboard`)}
        sx={{ color: theme => !open ? theme.sidebar.background : 'default' }}
        leftIcon={<Insights />}
        dense={dense}
      />

      {(permissions.includes('ADMIN')) && <Divider />}

      {(permissions.includes('ADMIN')) &&
        <SubMenu
          handleToggle={() => handleToggle("menuSeguranca")}
          isOpen={state.menuSeguranca}
          name='pos.menu.seguranca'
          icon={<Security />}
          dense={dense}
        >
          <MenuItemLink
            to={{ pathname: "/users" }}
            className={"submenuItem " + (open ? 'open' : 'close')}
            primaryText={translate(`resources.utilizadores.name`)}
            sx={{ color: !open ? 'transparent' : 'default' }}
            leftIcon={<People />}
            dense={dense}
          />

          <MenuItemLink
            to={{ pathname: "/validateUsers" }}
            className={"submenuItem " + (open ? 'open' : 'close')}
            primaryText={translate(`resources.utilizadores.validate`)}
            sx={{ color: !open ? 'transparent' : 'default' }}
            leftIcon={<People />}
            dense={dense}
          />

          {permissions.includes('ADMIN') &&
            <MenuItemLink
              to={{ pathname: "/roles" }}
              className={"submenuItem " + (open ? 'open' : 'close')}
              primaryText={translate('resources.role.name')}
              sx={{ color: !open ? 'transparent' : 'default' }}
              leftIcon={<Key />}
              dense={dense}
            />
          }
        </SubMenu>
      }
    </Box>
  ) : null;
};

export default MyMenu;
