import lightTheme  from "./lightTheme";
import darkTheme from "./darkTheme";

declare module '@mui/material/styles' {
    interface Theme {
        sidebar: {
            width: string|number;
            closedWidth: string|number;
            background: string;
            borderRight: string;
        };
        primary: {
            light: string;
            main: string;
            dark: string;
            contrastText: string;
        };
    }
    interface ThemeOptions {
        sidebar?: {
            width?: string|number;
            closedWidth: string|number;
            background: string;
            borderRight: string;
        };
        primary?: {
            light: string;
            main: string;
            dark: string;
            contrastText: string;
        };
    }
    interface PaletteOptions {
        customElements: {
            actions: {
                main: string
            }
        }
    }
    interface Palette {
        customElements: {
            actions: {
                main: string
            }
        } 
    }
}



const themes = {
    light: lightTheme,
    dark: darkTheme
}

export default themes;