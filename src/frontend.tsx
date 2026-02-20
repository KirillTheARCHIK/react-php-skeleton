// import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import App from "./App";
import { AntdConfigProvider, ColorModeContextProvider, NotificationsContextProvider } from "providers/index";
import { store } from "store/store";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ColorModeContextProvider>
    <AntdConfigProvider>
      <Provider store={store}>
        <NotificationsContextProvider>
          <App />
        </NotificationsContextProvider>
      </Provider>
    </AntdConfigProvider>
  </ColorModeContextProvider>
  // </StrictMode>
);
