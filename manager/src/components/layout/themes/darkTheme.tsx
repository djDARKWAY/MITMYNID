import { defaultTheme } from "react-admin";

const darkTheme = {
  ...defaultTheme,
  palette: {
    primary: {
      light: "#e3f2fd",
      main: "#90caf9",
      dark: "#42a5f5",
      contrastText: "#fff",
    },
    secondary: {
      main: "#fff",
    },
    customElements: {
      actions: {
        main: "rgb(0, 179, 230, 0.7)",
      },
    },
    background: {
      default: "#212b36",
      paper: "#212b36",
    },
    mode: "dark" as "dark",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  shape: {
    borderRadius: 10,
  },
  sidebar: {
    width: 250,
    closedWidth: 87,
    background: "#161c24",
    borderRight: "1.5px dotted rgb(81, 84, 93, 0.7)",
  },
  typography: {
    fontFamily: "Public Sans, sans-serif",
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          paddingBottom: "10px",
          paddingTop: "10px",
          fontColor: "rgb(0, 179, 230, 0)",
          borderRadius: "10px",
          color: "#ffffffb3",
          "&.sidebar": {
            marginLeft: "17px",
            marginRight: "15px",
            marginTop: "5px",
            marginBottom: "5px",
          },
          "&.submenuItem": {
            marginTop: "3.5px",
            marginLeft: "17px",
            marginRight: "15px",
          },
          "&:hover": {
            background: "rgb(0, 179, 230, 0.5)",
            color: "white",
            "&.close": {
              color: "transparent",
            },
            "&.open": {
              color: "white",
            },
            transition: "0.3s",
            "&.MuiListItemIcon-root": {
              color: "white",
            },
          },
          "&.RaMenuItemLink-active": {
            background: "rgb(0, 179, 230, 0.7)",
            color: "white",
            "&.close": {
              color: "transparent",
            },
            "&.open": {
              color: "white",
            },
            "&.MuiListItemIcon-root": {
              color: "white",
            },
          },
        },
      },
    },
    RaDatagrid: {
      styleOverrides: {
        root: {
          "& .MuiToolbar-root:not(.RaBulkActionsToolbar-collapsed)": {
            minHeight: "31px",
            transform: "translateY(0px)",
          },
          "& .MuiToolbar-root .RaBulkActionsToolbar-topToolbar": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          "& .RaDatagrid-thead": {
            paddingTop: "300px",
          },
        },
      },
    },
    RaList: {
      styleOverrides: {
        root: {
          "& .MuiCardContent-root .MuiTypography-root": {
            color: "white",
          },
          "& .MuiToolbar-root": {
            background: "none",
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
            justifyContent: "center",
            "& form": {
              width: "100%",
            },
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          paddingTop: "10px",
          "& .MuiTableHead-root .MuiTableCell-root": {
            padding: "12px",
            background: "rgba(145, 158, 171, 0.16)",
            color: "white",
            fontWeight: "600",
            "& span": {
              textTransform: "uppercase",
            },
          },
          "& .MuiTableBody-root .MuiTableRow-root .MuiTableRow-root": {},
          "& .MuiTableBody-root .MuiTableRow-root": {
            "&:nth-of-type(even)": {
              backgroundColor: "rgb(81, 84, 93, 0.12)",
            },
            "&:hover": {
              backgroundColor: "rgb(81, 84, 93, 0.35)",
            },
          },
          "&:last-child td, &:last-child th": {
            border: 0,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorSecondary: {
          border: "none",
          color: "white",
          background: "rgb(22, 28, 36)",
          height: "62px",
          justifyContent: "center",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgb(33, 43, 54);",
          boxShadow:
            "rgb(0 0 0 / 48%) 0px 0px 1px 0px, rgb(0 0 0 / 24%) 0px 2px 4px -1px",
          border: "none",
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(0, 0, 0, 0)",
          borderRadius: "5px",
          border: "1px solid rgb(145, 158, 171, 0.4)",
          "&$disabled": {
            backgroundColor: "rgb(0, 0, 0, 0.04)",
          },
          "&:hover:not($disabled):before": {
            backgroundColor: "rgb(0, 0, 0, 0)",
            border: "1px solid rgb(145, 158, 171)",
          },
        },
        underline: {
          "&:before": {
            borderBottom: "1px solid rgba(255, 133, 51, 0)",
          },
          "&:after": {
            borderBottom: `1px solid #00B3E6`,
          },
          "&:hover:before": {
            borderBottomColor: `rgba(255, 133, 51, 0) !important`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: "none",
        },
        root: {
          backgroundColor: "#424242",
          border: "1px solid #494950",
          color: "white",
          "&.RaList-content": {
            marginTop: "14px",
          },
        },
      },
    },
    RaLoading: {
      styleOverrides: {
        root: {
          "& .RaLoading-message": {
            color: "white",
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&:hover:active::after": {
            content: '""',
            display: "block",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "currentColor",
            opacity: 0.3,
            borderRadius: "inherit",
          },
        },
      },
    },
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
    MuiList: {
      dense: false,
    },
    MuiMenuItem: {
      dense: false,
    },
    MuiTable: {
      size: "small",
    },
  },
  spacing: 8,
};

export default darkTheme;
