import { Suspense, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { BrowserRouter as Router, Redirect, Route, Switch, useHistory } from "react-router-dom";

import { Box, Toolbar } from "@mui/material";

import { ErrorBoundary } from "react-error-boundary";

import Header from "components/Header";
import History from "components/History";
import LinearLoading from "components/LinearLoading";
import CircularLoading from "components/CircularLoading";
import { LIGHT_THEME } from "constants/themes";
import { buildRoutes, type UserRoleDTO } from "helpers/routes";

import LoginPage from "pages/login";
import DefaultPage from "pages/default";
import ErrorPage from "pages/error";

import RolesLazy from "pages/catalogs/roles";
import UsersLazy from "pages/catalogs/users";

import { useDispatch, useSelector } from "store/hooks";
import type { PageRoute } from "constants/routes";
import { fetchCurrentUser } from "features/auth/redux";

export let historySingleton: ReturnType<typeof useHistory> | undefined = undefined;
export function setHistorySingleton(history: typeof historySingleton) {
  historySingleton = history;
}

const routeComponents = {
  user: UsersLazy,
  user_group: RolesLazy,
};

const ComponentPage = (props: {
  match: {
    path: string;
  };
  routeParams: UserRoleDTO & PageRoute & { routePath: string };
}) => {
  const Component = routeComponents[props.routeParams.key as keyof typeof routeComponents];
  return <Component {...props} />;
};

const App = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.currentUser);
  const loading = useSelector((state) => state.auth.loading);
  const userRoles = useSelector((state) => state.auth.roles);
  // const auth = useSelector((state) => state.auth);
  // console.log("AuthState", auth);
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // useEffect(() => {
  //   if (user) {
  //     dispatch(loadUserSettings());
  //   }
  // }, [dispatch, user]);

  const bgColorMain = theme.palette.mode === LIGHT_THEME ? "#F5F5F5" : "#1D1F29";

  const getStartPage = () => {
    if (user?.startPage) {
      const routes = buildRoutes(userRoles);
      const route = routes.find((item) => item.children.some((el) => el.key === user.startPage!.key))!;
      return `/${route.id}/${user.startPage.key}`;
    }
    return "/default";
  };

  if (loading) {
    return <LinearLoading />;
  }

  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          bgcolor: bgColorMain,
        }}
      >
        {user && userRoles.length ? (
          <>
            <Header user={user} routes={buildRoutes(userRoles)} />
            <History />

            <Box
              component="main"
              sx={{
                width: "100%",
                minHeight: "100vh",
                pt: "10px",
              }}
            >
              <Toolbar />
              <Suspense fallback={<CircularLoading />}>
                <Switch>
                  {buildRoutes(userRoles).map((item) => {
                    return item.children.map((el) => {
                      return (
                        <Route
                          key={el.key}
                          path={`/${item.id}/${el.key}`}
                          render={(props) => (
                            <ErrorBoundary FallbackComponent={ErrorPage}>
                              <ComponentPage
                                {...props}
                                routeParams={{
                                  ...el,
                                  routePath: `/${item.id}/${el.key}`,
                                }}
                              />
                            </ErrorBoundary>
                          )}
                        />
                      );
                    });
                  })}
                  <Route path="/default" component={DefaultPage} />
                  <Route path="/error" component={ErrorPage} />
                  <Route path="/" render={() => <Redirect to={getStartPage()} />} />
                </Switch>
              </Suspense>
            </Box>
          </>
        ) : (
          <Route path="/" component={LoginPage} />
        )}
      </Box>
    </Router>
  );
};

export default App;
