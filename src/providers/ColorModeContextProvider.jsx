import React, { createContext, useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import {
  DARK_MAIN_COLOR,
  DARK_THEME,
  ERROR_COLOR,
  LIGHT_MAIN_COLOR,
  LIGHT_THEME,
  LOCAL_STORAGE_THEME_KEY,
} from "constants/themes";

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const ColorModeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(
    localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || LIGHT_THEME
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) =>
          prevMode === LIGHT_THEME ? DARK_THEME : LIGHT_THEME
        );
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === LIGHT_THEME ? LIGHT_MAIN_COLOR : DARK_MAIN_COLOR,
          },
          secondary: {
            main: mode === LIGHT_THEME ? LIGHT_MAIN_COLOR : "#FFFFFF",
          },
          error: {
            main: ERROR_COLOR,
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              "&::-webkit-scrollbar-track": {
                backgroundColor: mode === LIGHT_THEME ? "#d3d3d3" : "#333333",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar": {
                width: "6px",
                height: "6px",
                backgroundColor: mode === LIGHT_THEME ? "#FFFFFF" : "#121212",
              },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: "10px",
                backgroundColor:
                  mode === LIGHT_THEME ? LIGHT_MAIN_COLOR : DARK_MAIN_COLOR,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                marginBottom: 25,
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              sizeSmall: {
                padding: 8,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 5,
                boxShadow: "none",
                textTransform: "none",
              },
              sizeSmall: {
                width: 107,
                height: 34,
                lineHeight: 1.25,
              },
            },
          },
          MuiToggleButtonGroup: {
            styleOverrides: {
              root: {
                borderRadius: "0px 10px 10px 0px",
              },
            },
          },
          MuiToggleButton: {
            styleOverrides: {
              root: {
                width: 67,
                height: 38,
                color: mode === LIGHT_THEME ? "#000000" : "#AAAAAA",
                borderRadius: 10,
                textTransform: "none",
                "&.Mui-selected": {
                  color: "#FFFFFF",
                  backgroundColor:
                    mode === LIGHT_THEME ? LIGHT_MAIN_COLOR : DARK_MAIN_COLOR,
                  "&:hover": {
                    color:
                      mode === LIGHT_THEME ? LIGHT_MAIN_COLOR : DARK_MAIN_COLOR,
                  },
                },
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: { textTransform: "none" },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
