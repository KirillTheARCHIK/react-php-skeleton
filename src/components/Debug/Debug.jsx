import { useTheme } from "@mui/material/styles";
import clsx from "clsx";
import { DARK_THEME } from "constants/themes";

import "./styles.scss";

/**
 * Компонент для отладки в storybook'е, форматно выводит объект
 * @param value
 * @return {JSX.Element}
 */
export default function Debug({ value }) {
  const {
    palette: { mode },
  } = useTheme();

  return (
    <pre
      className={clsx({
        "storybook-debug": true,
        "storybook-debug_dark": mode === DARK_THEME,
      })}
    >
      <p className="storybook-debug__header">value:</p>
      {JSON.stringify(value, 0, 2)}
    </pre>
  );
}
