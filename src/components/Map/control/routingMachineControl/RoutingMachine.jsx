import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import { markerIcon } from "components/Map/MarkerIcon";
import "leaflet-routing-machine";

const getPopupLabel = (waypoint) => {
  const customPopupLabel = waypoint.options?.customPopupLabel;

  if (customPopupLabel) {
    return customPopupLabel;
  }
  return waypoint.name;
};

const createRoutingMachineLayer = () => {
  const instance = L.Routing.control({
    routeLine: (route, options) => {
      const line = L.Routing.line(route, options);

      line.eachLayer((element) => {
        element.bindPopup("Маршрутные точки");
      });
      return line;
    },

    createMarker: (index, waypoint, total) => {
      if (index === 0 || index === total - 1) {
        return L.marker(waypoint.latLng, {
          icon: markerIcon,
        })
          .bindPopup(getPopupLabel(waypoint))
          .openPopup();
      }
      return L.circleMarker(waypoint.latLng, { color: "#00cc00" }).bindPopup(waypoint.name).openPopup();
    },

    router: {
      route: async (waypoints, callback, context) => {
        const searchParams = new URLSearchParams();
        waypoints.forEach(({ latLng: { lat, lng } }, index) => {
          searchParams.set(`points[${index}][x]`, lng);
          searchParams.set(`points[${index}][y]`, lat);
        });

        const response = await fetch(`/api/v1/map/directions?${searchParams}`);

        let error = null;
        let routes = null;
        if (response.ok) {
          const json = await response.json();
          if (json.result) {
            const route = {
              name: "Маршрутные точки",
              summary: {
                totalTime: json.properties.time,
                totalDistance: json.properties.length,
              },
              coordinates: [],
              waypoints: waypoints.map(({ latLng: { lat, lng } }) => L.latLng(lat, lng)),
              instructions: [],
              inputWaypoints: waypoints,
            };

            json.features.forEach(({ geometry: { coordinates, type } }) => {
              if (type === "Point") {
                const [lng, lat] = coordinates;
                route.coordinates.push(L.latLng(lat, lng));
              } else {
                coordinates.forEach(([lng, lat]) => {
                  route.coordinates.push(L.latLng(lat, lng));
                });
              }
            });

            routes = [route];
          }
        } else {
          error = {
            status: response.status,
            message: await response.text(),
          };
        }

        callback.call(context || callback, error, routes);
      },
    },

    show: false,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutingMachineLayer);

export default RoutingMachine;
