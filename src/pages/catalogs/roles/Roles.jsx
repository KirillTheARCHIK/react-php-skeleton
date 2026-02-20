import React from "react";
import { Route, Switch } from "react-router-dom";

import Container from "@mui/material/Container";

import RolesWidget from "widgets/catalogs/roles";
import RoleFormContainer from "widgets/catalogs/roles/RoleFormContainer";

const RolesPage = ({ match: { path }, routeParams }) => {
  return (
    <Container maxWidth={false}>
      <Switch>
          <Route path={`${path}/create`} component={RoleFormContainer} />,
        <Route
          path={`${path}/:roleId/view`}
          render={(props) => (
            <RoleFormContainer {...props} isView routeId={routeParams.key} />
          )}
        />
          <Route
              path={`${path}/:roleId/edit`}
              render={(props) => (
                  <RoleFormContainer {...props} isEdit routeId={routeParams.key} />
              )}
          />
        <Route
          exact
          path={path}
          render={(props) => (
            <RolesWidget
              {...props}
              routeId={routeParams.key}
              routeName={routeParams.name}
              routeRoles={routeParams.roles}
              routePath={routeParams.routePath}
            />
          )}
        />
      </Switch>
    </Container>
  );
};

export default RolesPage;
