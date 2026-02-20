import { ConfigProvider, theme, type ThemeConfig } from "antd";
import ruRu from "antd/locale/ru_RU";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { DARK_MAIN_COLOR, LIGHT_MAIN_COLOR, LIGHT_THEME } from "constants/themes";

export const AntdConfigProvider = (props: { children: React.ReactNode | React.ReactNode[] }) => {
  const {
    palette: { mode },
  } = useTheme();

  const customTheme: ThemeConfig = useMemo(
    () => ({
      algorithm: mode === LIGHT_THEME ? theme.defaultAlgorithm : theme.darkAlgorithm,
      token: {
        colorPrimary: mode === LIGHT_THEME ? LIGHT_MAIN_COLOR : DARK_MAIN_COLOR,
        colorLink: mode === LIGHT_THEME ? LIGHT_MAIN_COLOR : DARK_MAIN_COLOR,
      },
      components: {
        Button: {
          primaryShadow: "none",
        },
        DatePicker: {
          activeBorderColor: mode === LIGHT_THEME ? LIGHT_MAIN_COLOR : DARK_MAIN_COLOR,
          activeShadow: "none",
          borderRadius: 4,
          colorBgContainerDisabled: "inherit",
          colorBorder: mode === LIGHT_THEME ? "#D3D3D3" : "#FFFFFF",
          colorTextPlaceholder: "#898989",
          fontFamily: "Helvetica, sans-serif",
          fontSize: 14,
          fontSizeLG: 16,
          fontSizeSM: 12,
          lineWidth: 2,
          lineHeight: 2,
          lineHeightLG: 2,
          hoverBorderColor: mode === LIGHT_THEME ? "#D3D3D3" : "#FFFFFF",
          zIndexPopup: 9999,
        },
      },
    }),
    [mode]
  );

  return (
    <ConfigProvider locale={ruRu} theme={customTheme}>
      {props.children}
    </ConfigProvider>
  );
};
