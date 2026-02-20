import { createContext, useState } from "react";

export const NotificationsContext = createContext({
  notificationsIsShown: false,
  setNotificationsIsShown: () => {},
});

export function NotificationsContextProvider({ children }) {
  const [notificationsIsShown, setNotificationsIsShown] = useState(false);

  return (
    <NotificationsContext.Provider
      value={{
        notificationsIsShown,
        setNotificationsIsShown,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
