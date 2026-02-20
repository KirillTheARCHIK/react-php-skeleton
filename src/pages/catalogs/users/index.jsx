import { lazy } from "react";

const UsersLazy = lazy(() => import("pages/catalogs/users/Users"));

export default UsersLazy;
