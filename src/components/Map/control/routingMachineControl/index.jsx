import React from "react";
import L from "leaflet";
import RoutingMachine from "./RoutingMachine";
import "./styles.scss";

const RoutingMachineControl = ({ waypoints = [] }) => {
  const ref = React.useRef();
  React.useEffect(() => {
    if (ref.current) {
      const routingWaypoints = waypoints.map((item) =>
        L.Routing.waypoint(L.latLng(+item.latitude, +item.longitude), item.address, {
          customPopupLabel: item.customPopupLabel,
        })
      );
      ref.current.setWaypoints(routingWaypoints);
    }
  }, [waypoints]);

  return <RoutingMachine ref={ref} />;
};

export default RoutingMachineControl;
