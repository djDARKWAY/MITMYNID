import { defaultTheme } from "react-admin";

const lightTheme = {
  ...defaultTheme,
  palette: {
    primary: {
      light: "#009DCD",
      main: "#00B3E6",
      dark: "#006480",
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
      default: "#fcfcfe",
      paper: "#fcfcfe",
    },
    mode: "light" as "light",
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
    background: "#fcfcfe",
    borderRight: "1.5px dotted rgb(22222, 158, 171, 0.7)",
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
          color: "#000000b3",
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
            color: "black",
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
            color: "black",
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
            color: "black",
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
            background: "#D3D8DE",
            color: "dark_gray",
            fontWeight: "600",
            "& span": {
              textTransform: "uppercase",
            },
          },
          "& .MuiTableBody-root .MuiTableRow-root .MuiTableCell-root": {},
          "& .MuiTableBody-root .MuiTableRow-root": {
            "&:nth-of-type(even)": {
              backgroundColor: "#EFF2F5",
            },
            "&:nth-of-type(odd)": {
              backgroundColor: "#fcfcfe",
            },            
            "&:hover": {
              backgroundColor: "#DDE2E7",
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
          color: "black",
          background: "#fcfcfe",
          height: "62px",
          justifyContent: "center",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgb(255, 255, 255);",
          boxShadow:
            "rgb(0 0 0 / 8%) 0px 0px 1px 0px, rgb(0 0 0 / 4%) 0px 2px 4px -1px",
          border: "none",
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(255, 255, 255, 0)",
          borderRadius: "5px",
          border: "1px solid rgb(145, 158, 171, 0.4)",
          "&$disabled": {
            backgroundColor: "rgb(0, 0, 0, 0.04)",
          },
          "&:hover:not($disabled):before": {
            backgroundColor: "rgb(255, 255, 255, 0)",
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
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          color: "black",
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
            color: "black",
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

export default lightTheme;
