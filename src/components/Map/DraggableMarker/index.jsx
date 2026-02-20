import React from "react";
import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { markerIcon } from "components/Map/MarkerIcon";
import { useDispatch, useSelector } from "store/hooks";
import L from "leaflet";

import { setMapParams } from "actions/mapParams";
import { fetchLocation } from "components/Map/index";

const DraggableMarker = ({ isView, form, data, isEntrancePolygon, polygons, customRequestWhenSettingPoint }) => {
  const map = useMap();
  const dispatch = useDispatch();

  const { cursorPosition, markerPosition } = useSelector((state) => state.mapParams);

  const markerRef = React.useRef(null);

  React.useEffect(() => {
    const lat = data.latitude;
    const lng = data.longitude;
    if (!markerPosition && lat && lng) {
      const latLng = new L.LatLng(lat, lng);
      dispatch(setMapParams({ markerPosition: latLng }));
      map.setView(latLng);
    }
  }, [data]);

  React.useEffect(() => {
    if (markerPosition && !isView) {
      setStyleMarker();
    }
  }, [markerPosition]);

  const setStyleMarker = () => {
    const marker = markerRef.current;
    if (marker !== null) {
      const elementMarker = marker.getElement();
      elementMarker.style.border = "dashed 2px #FF1493";
    }
  };

  useMapEvents(
    isView
      ? {}
      : {
          mousemove: (event) => {
            dispatch(
              setMapParams({
                cursorPosition: event.latlng,
              })
            );
          },
          mouseout: () => {
            dispatch(
              setMapParams({
                cursorPosition: null,
              })
            );
          },
          click: (event) => {
            if (!markerPosition && !isEntrancePolygon) {
              const latLng = event.latlng;
              dispatch(
                setMapParams({
                  markerPosition: latLng,
                })
              );

              if (form) {
                if (customRequestWhenSettingPoint) {
                  customRequestWhenSettingPoint(
                    {
                      lat: latLng.lat,
                      lng: latLng.lng,
                    },
                    form
                  );
                }
                fetchLocation(
                  {
                    lat: latLng.lat,
                    lng: latLng.lng,
                  },
                  form
                );
              }
            }
          },
        }
  );

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;

        if (marker !== null && !isEntrancePolygon) {
          const latLng = marker.getLatLng();

          dispatch(setMapParams({ markerPosition: latLng }));

          if (form) {
            if (customRequestWhenSettingPoint) {
              customRequestWhenSettingPoint(
                {
                  lat: latLng.lat,
                  lng: latLng.lng,
                },
                form
              );
            }
            fetchLocation(
              {
                lat: latLng.lat,
                lng: latLng.lng,
              },
              form
            );
          }
        }
      },
      click() {
        if (!markerPosition && !isView) {
          const marker = markerRef.current;
          if (marker !== null) {
            const latLng = marker.getLatLng();

            if (isEntrancePolygon) {
              const isPointInsideSquare = polygons.getBounds().contains([latLng.lat, latLng.lng]);
              if (!isPointInsideSquare) {
                return;
              }
            }
            dispatch(setMapParams({ markerPosition: latLng }));

            if (form) {
              if (customRequestWhenSettingPoint) {
                customRequestWhenSettingPoint(
                  {
                    lat: latLng.lat,
                    lng: latLng.lng,
                  },
                  form
                );
              }
              fetchLocation(
                {
                  lat: latLng.lat,
                  lng: latLng.lng,
                },
                form
              );
            }
          }
        }
      },
    }),
    [markerPosition]
  );

  const getPopup = () => {
    const lat = data.latitude;
    const lng = data.longitude;
    const address = data.address;
    if (lat && lng && address) {
      return (
        <div>
          <div>{`Адрес: ${address}`}</div>
          <div>{`Широта: ${lat}`}</div>
          <div>{`Долгота: ${lng}`}</div>
        </div>
      );
    }
    return null;
  };

  const position = markerPosition || cursorPosition;

  if (position) {
    return (
      <Marker draggable={!isView} eventHandlers={eventHandlers} position={position} ref={markerRef} icon={markerIcon}>
        <Popup>{getPopup()}</Popup>
      </Marker>
    );
  }
  return null;
};

export default DraggableMarker;
