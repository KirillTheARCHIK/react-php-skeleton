import React from "react";
import { useDispatch, useSelector } from "store/hooks";
import Control from "react-leaflet-custom-control";

import CustomIconButton from "components/Map/CustomIconButton";
import { clearMapParams } from "actions/mapParams";

const ClearControl = ({ form, isView, customClearForm, setVisibleDraggableMarker, setPolygonOnMap }) => {
  const dispatch = useDispatch();

  const { markerPosition } = useSelector((state) => state.mapParams);

  const onClear = () => {
    if (customClearForm) {
      customClearForm(form);
    }
    dispatch(clearMapParams());
    setVisibleDraggableMarker(false);
    setPolygonOnMap(null);
    if (form) {
      form.change("address", null);
      form.change("latitude", null);
      form.change("longitude", null);
    }
  };

  return (
    <Control position="topleft">
      <CustomIconButton iconName="clear" className="clear-control-btn" onClick={onClear} disabled={!markerPosition || isView} />
    </Control>
  );
};

export default ClearControl;
