import React from "react";
import { Box, List, ListItem, ListItemButton, ListItemText, Divider, Typography, styled, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { HelpOutline, Dashboard, Warehouse, CardMembership, SignalWifi4BarLock } from "@mui/icons-material";
import { Theme } from "@mui/material/styles";

interface ShortcutSubItem {
  label: string;
  path: string;
}

interface ShortcutItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  subItems?: ShortcutSubItem[];
}

const shortcuts: ShortcutItem[] = [
  {
    label: "Dashboard",
    path: "/faq/dashboard",
    icon: <Dashboard fontSize="small" />,
  },
  {
    label: "Entidades",
    icon: <Warehouse fontSize="small" />,
    subItems: [
      { label: "Painel de entidades", path: "/faq/warehouse" },
      { label: "Mapa geográfico", path: "/faq/map" },
    ],
  },
  {
    label: "Certificados",
    icon: <CardMembership fontSize="small" />,
    subItems: [
      { label: "Gestão de certificados", path: "/faq/certificate" },
      { label: "Vincular ficheiros", path: "/faq/upload" },
    ],
  },
  {
    label: "Pontos de Acesso",
    icon: <SignalWifi4BarLock fontSize="small" />,
    subItems: [
      { label: "Dispositivos de rede", path: "/faq/access-points" },
    ],
  },
];

type CollapsibleMenuSectionProps = {
  open: boolean;
  children: React.ReactNode;
  transitionMs?: number;
};

function CollapsibleMenuSection({
  open,
  children,
  transitionMs = 300,
}: CollapsibleMenuSectionProps) {
  const [show, setShow] = React.useState(open);
  const [height, setHeight] = React.useState<number | undefined>(open ? undefined : 0);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      setShow(true);
      setTimeout(() => {
        if (contentRef.current) {
          setHeight(contentRef.current.scrollHeight);
        }
      }, 10);
    } else {
      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight);
      }
      setTimeout(() => setHeight(0), 10);
      const timeout = setTimeout(() => setShow(false), transitionMs);
      return () => clearTimeout(timeout);
    }
  }, [open, transitionMs]);

  React.useEffect(() => {
    if (open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children, open]);

  return (
    <Box
      sx={{
        maxHeight: open ? height : 0,
        overflow: 'hidden',
        transition: `max-height ${transitionMs}ms cubic-bezier(0.4,0,0.2,1)` ,
        borderRadius: 2,
        ml: 2,
      }}
    >
      <div ref={contentRef} style={{ visibility: show ? 'visible' : 'hidden' }}>
        {show ? children : null}
      </div>
    </Box>
  );
}

function renderMenu(
  items: ShortcutItem[] | ShortcutSubItem[],
  openMenus: { [key: string]: boolean },
  handleToggle: (label: string) => void,
  navigate: (path: string) => void,
  location: ReturnType<typeof useLocation>,
  theme: Theme,
  level = 0
) {
  return items.map((item: any) => {
    const hasSubItems = !!item.subItems;
    const isSelected = item.path && location.pathname === item.path;
    return (
      <React.Fragment key={item.path || item.label}>
        <ListItem disablePadding sx={{ mb: 0.5, pl: level * 2 }}>
          <ListItemButton
            selected={!!isSelected}
            onClick={() => {
              if (hasSubItems) handleToggle(item.label);
              else if (item.path) navigate(item.path);
            }}
            sx={{
              borderRadius: 2,
              pl: level > 0 ? 2 : undefined,
              transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
              },
              ...(level > 0 && {
              }),
              '&.Mui-selected': {
                background: 'linear-gradient(90deg, #00B3E6 0%, #0077B6 100%)',
                color: 'white',
                '&:hover': { background: 'linear-gradient(90deg, #00B3E6 0%, #0077B6 100%)' },
              },
            }}
          >
            {item.icon && (
              <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </Box>
            )}
            <ListItemText primary={item.label} />
            {hasSubItems && (
              <Box
                sx={{
                  ml: 1,
                  fontSize: 18,
                  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#00B3E6',
                  display: 'flex',
                  alignItems: 'center',
                  width: 20,
                  height: 20,
                  justifyContent: 'center',
                  transition: 'transform 0.2s',
                  transform: openMenus[item.label] ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline
                    points="4,7 9,12 14,7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
            )}
          </ListItemButton>
        </ListItem>
        {hasSubItems && (
          <CollapsibleMenuSection open={!!openMenus[item.label]} transitionMs={300}>
            <List disablePadding>
              {renderMenu(item.subItems, openMenus, handleToggle, navigate, location, theme, level + 1)}
            </List>
          </CollapsibleMenuSection>
        )}
      </React.Fragment>
    );
  });
}

const ShortcutMenuContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  right: "20px",
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 0 10px rgba(0,0,0,0.2)"
      : "0 0 10px rgba(0,0,0,0.1)",
  borderRadius: "12px",
  zIndex: 900,
  padding: theme.spacing(2),
  display: "block",
  overflowY: "auto",
  border:
    theme.palette.mode === "dark" ? "1px solid #333333" : "1px solid #e0e0e0",
  width: "270px",
  height: "auto",
  maxHeight: "calc(100vh - 150px)",
}));

const getInitialOpenMenus = (pathname: string) => {
  const initial: { [key: string]: boolean } = {};
  shortcuts.forEach((item) => {
    if (item.subItems?.some((sub) => sub.path === pathname)) {
      initial[item.label] = true;
    }
  });
  return initial;
};

const FaqShortcutMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [openMenus, setOpenMenus] = React.useState<{ [key: string]: boolean }>(() => getInitialOpenMenus(location.pathname));

  const handleToggle = (label: string) => {
    setOpenMenus((prev) => {
      const isOpen = !!prev[label];
      const newState: { [key: string]: boolean } = {};
      shortcuts.forEach((item) => {
        newState[item.label] = false;
      });
      if (!isOpen) {
        newState[label] = true;
      }
      return newState;
    });
  };

  return (
    <ShortcutMenuContainer sx={{ display: { xs: "none", md: "block" } }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <HelpOutline color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" color="primary" fontWeight="500">
          FAQ
        </Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      <List>
        {renderMenu(shortcuts, openMenus, handleToggle, navigate, location, theme)}
      </List>
    </ShortcutMenuContainer>
  );
};

export default FaqShortcutMenu;
