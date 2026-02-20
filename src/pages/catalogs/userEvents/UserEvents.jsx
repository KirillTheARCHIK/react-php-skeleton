import React from "react";
import Container from "@mui/material/Container";

import Catalog from "components/Catalog";

import { loadUserEvents } from "actions/catalogs/userEvents";
import { loadUserEvent, URL } from "services/catalogs/userEvents";
import { USER_EVENTS_COLUMNS } from "constants/columns";

const UserEventsPage = ({ routeParams }) => {
  return (
    <Container maxWidth={false}>
      <Catalog
        routeId={routeParams.key}
        routeName={routeParams.name}
        routeRoles={routeParams.roles}
        reducerKey="userEvents"
        url={URL}
        columns={USER_EVENTS_COLUMNS}
        loadData={loadUserEvents}
        loadFetchDataById={loadUserEvent}
        readOnly
      />
    </Container>
  );
};

export default UserEventsPage;
