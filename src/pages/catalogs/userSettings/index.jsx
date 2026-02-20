import { lazy } from "react";

const UserSettingsLazy = lazy(() =>
  import("pages/catalogs/userSettings/UserSettings")
);

export default UserSettingsLazy;
