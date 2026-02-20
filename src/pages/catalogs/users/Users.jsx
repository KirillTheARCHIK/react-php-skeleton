import React from "react";
import Container from "@mui/material/Container";
import UsersWidget from "widgets/catalogs/users";

const UsersPage = ({ routeParams }) => {
  return (
    <Container maxWidth={false}>
      <UsersWidget
        routeId={routeParams.key}
        routeName={routeParams.name}
        routeRoles={routeParams.roles}
      />
    </Container>
  );
};

export default UsersPage;
