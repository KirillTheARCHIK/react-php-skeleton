import React, { useState } from "react";
import { Checkbox, List, ListItem, ListItemText, Popover } from "@mui/material";
import LayerIcon from "@mui/icons-material/Layers";
import Control from "react-leaflet-custom-control";
import IconButton from "components/IconButton";

const CustomLayerControl = ({ layers = [], onLayerToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleIconClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Control position="topright" prepend>
      <div>
        <IconButton
          onClick={handleIconClick}
          sx={{ background: "white" }}
          name="layers"
        >
          <LayerIcon />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <List>
            {layers.map((layer) => (
              <ListItem
                key={layer.name}
                disabled={layer.disabled}
                sx={{ padding: 0, pr: 1 }}
              >
                <Checkbox
                  checked={layer.visible}
                  onChange={() => onLayerToggle(layer.name)}
                  disabled={layer.disabled}
                />
                <ListItemText
                  primary={layer.name}
                  onClick={() => !layer.disabled && onLayerToggle(layer.name)}
                  style={{ cursor: layer.disabled ? "not-allowed" : "pointer" }}
                />
              </ListItem>
            ))}
          </List>
        </Popover>
      </div>
    </Control>
  );
};

export default CustomLayerControl;
