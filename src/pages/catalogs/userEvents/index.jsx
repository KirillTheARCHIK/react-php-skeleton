import { lazy } from "react";

const UserEventsLazy = lazy(() =>
  import("pages/catalogs/userEvents/UserEvents")
);

export default UserEventsLazy;
