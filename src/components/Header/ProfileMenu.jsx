import React from "react";

import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import SwitchMode from "components/SwitchMode";
import IconButton from "components/IconButton";

const ProfileMenu = ({
  user,
  openProfileMenu,
  handleCloseProfileMenu,
  OpenGeneralSettingsModal,
  handleLogout,
  onNavigateProfile,
  isCustomer,
  isContractor,
  userParticipants,
  currentParticipant,
  onChangeParticipant,
}) => {
  return (
    <Menu
      sx={{
        mt: 6,
        ml: 0.5,
        "& .MuiPaper-root": { width: 180, minWidth: 180 },
      }}
      id="profile-menu"
      anchorEl={openProfileMenu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(openProfileMenu)}
      onClose={handleCloseProfileMenu}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          p: "10px",
        }}
      >
        <Stack spacing={1}>
          <Typography
            sx={{
              fontWeight: "700",
            }}
          >
            {user.name}
          </Typography>
          {user.organization ? (
            <Typography>{user.organization.displayName}</Typography>
          ) : null}
          <SwitchMode />
        </Stack>
      </Box>
      <Divider variant="middle" component="li" />

      {(isCustomer || isContractor) &&
        userParticipants.entries.map((participant) => (
          <MenuItem
            key={participant.id}
            sx={{
              p: "5px 10px",
              whiteSpace: "pre-wrap",
            }}
            selected={participant.id === currentParticipant.id}
            onClick={() => onChangeParticipant(participant.id)}
          >
            {participant.name}
            {participant.id === currentParticipant.id && (
              <IconButton
                name={"edit"}
                title={"Редактировать профиль"}
                iconProps={{
                  fontSize: "small",
                }}
                onClick={onNavigateProfile}
              />
            )}
          </MenuItem>
        ))}

      <MenuItem
        sx={{
          p: "5px 10px",
          whiteSpace: "pre-wrap",
        }}
        onClick={OpenGeneralSettingsModal}
      >
        Настройки пользователя
      </MenuItem>
      <MenuItem sx={{ p: "5px 10px" }} onClick={handleLogout}>
        Выход
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;
