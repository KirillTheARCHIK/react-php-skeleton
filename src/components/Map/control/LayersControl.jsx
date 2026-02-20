import React from "react";
import Points from "../Points";
import { LayerGroup } from "react-leaflet";

// return (
//     <LayersControl position="topright">
//       <LayersControl.Overlay name="Маркеры"></LayersControl.Overlay>
//     </LayersControl>
//   );

const LayersControl = (form, points, customAutofillFields) => {
  return (
    <div>
      <LayersControl position="topright">
        <LayersControl.Overlay name="Маркеры">
          <LayerGroup>
            <Points
              form={form}
              points={points}
              customAutofillFields={customAutofillFields}
            />
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </div>
  );
};

export default LayersControl;
