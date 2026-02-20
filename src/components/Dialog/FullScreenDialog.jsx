import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Box } from "@mui/material";
import { LIGHT_THEME } from "constants/themes";

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = ({ title, open, onClose, children, activeButton }) => {
  return (
    <Box component="div">
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            backgroundImage: "none",
            bgcolor: (theme) =>
              theme.palette.mode === LIGHT_THEME ? "#F5F5F5" : "#1D1F29",
          },
        }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar
            sx={{
              minHeight: {
                xs: 60,
              },
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>
            {activeButton}
          </Toolbar>
        </AppBar>
        <Box component="div" sx={{ pr: 3, pl: 3, pt: 2, overflow: "auto" }}>
          {children}
        </Box>
      </Dialog>
    </Box>
  );
};

FullScreenDialog.defaultProps = {
  title: "",
  open: false,
  activeButton: null,
  onClose: () => {},
};

export default FullScreenDialog;
