import React, { useState } from "react";
import { useDispatch, useSelector } from "store/hooks";
import { impersonateUser } from "actions/login";
import "./styles.scss";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Alert } from "@mui/material";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import DateTime from "components/DateTime";
import IconButton from "components/IconButton";
import Modal, { MODAL_STATE } from "components/Modal";
import NavMenu from "./NavMenu";
import SearchMenu from "./SearchMenu";
import ProfileMenu from "./ProfileMenu";
import SettingsModal from "./SettingsModal";
import GeneralSettingsModal from "./GeneralSettings/GeneralSettingsModal";

import { ROLE_ADMIN } from "constants/userTypes";
import { modalSlice } from "store/utility/modalSlice";
import { logout } from "features/auth/redux";

const Header = ({ user, routes }) => {
  const dispatch = useDispatch();
  const [openProfileMenu, setOpenProfileMenu] = useState(null);

  const currentUser = useSelector((state) => state.auth.currentUser);
  const userParticipants = useSelector((state) => state.transportationParticipants);

  const handleOpenProfileMenu = (event) => {
    setOpenProfileMenu(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setOpenProfileMenu(null);
  };

  const onOpenSettingsModal = () => {
    dispatch(modalSlice.actions.openModal({ modalName: "settings-modal", modalState: MODAL_STATE.OPENED }));
  };

  const OpenGeneralSettingsModal = () => {
    setOpenProfileMenu(null);
    dispatch(modalSlice.actions.openModal({ modalName: "general-settings-modal", modalState: MODAL_STATE.OPENED }));
  };

  const onOpenSearchMenu = () => {
    dispatch(modalSlice.actions.openModal({ modalName: "search-menu-modal", modalState: MODAL_STATE.OPENED }));
  };

  const onNavigateProfile = (e) => {
    e.stopPropagation();
    dispatch(modalSlice.actions.openModal({ modalName: "profile", modalState: MODAL_STATE.OPENED }));
    handleCloseProfileMenu();
  };

  const handleLogout = () => {
    handleCloseProfileMenu();
    dispatch(logout());
  };

  return (
    <AppBar
      sx={{
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
      }}
    >
      {currentUser.inImpersonate ? (
        <Alert severity="warning" action={<Button onClick={() => dispatch(impersonateUser({ username: "_exit" }))}>Выйти</Button>}>
          Использование приложения от лица пользователя {currentUser.displayName}
        </Alert>
      ) : null}
      <Container maxWidth={false}>
        <Toolbar
          sx={{
            minHeight: {
              xs: 60,
            },
            maxHeight: 60,
            justifyContent: "space-between",
          }}
          disableGutters
        >
          {/* <div className="header__logo"></div> */}
          <NavMenu routes={routes} />
          <Box component="div" sx={{ display: "flex" }}>
            <Box component="div" sx={{ ml: "38px", mr: "25px" }}>
              <DateTime />
            </Box>
            <IconButton name="search" title="Навигационный поиск" size="small" color="inherit" onClick={onOpenSearchMenu} />
            <SearchMenu user={user} />
            {currentUser.roles.includes(ROLE_ADMIN) ? (
              <IconButton name="systemSettings" title="Системные настройки" size="small" color="inherit" onClick={onOpenSettingsModal} />
            ) : null}
            <GeneralSettingsModal user={user} />
            <SettingsModal />
            <IconButton name="user" title="Профиль" size="small" color="inherit" onClick={handleOpenProfileMenu} />
            <ProfileMenu
              user={user}
              openProfileMenu={openProfileMenu}
              OpenGeneralSettingsModal={OpenGeneralSettingsModal}
              handleCloseProfileMenu={handleCloseProfileMenu}
              handleLogout={handleLogout}
              onNavigateProfile={onNavigateProfile}
              userParticipants={userParticipants}
            />
            <Modal modalName={"profile"} title="Личный профиль"></Modal>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
