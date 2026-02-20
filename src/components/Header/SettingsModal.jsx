import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { modalSlice } from "store/utility/modalSlice";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import SystemSettings from "components/SystemSettings";
import Modal from "components/Modal";
import Icon from "components/Icon";
import Tabs from "components/Tabs";

import { TABS_CURRENT_EVENTS, ALL_FIELDS } from "constants/systemSettings";
import { LIGHT_THEME } from "constants/themes";

const styleTabs = {
  borderBottom: 0,
  "& .MuiTabs-indicator": {
    display: "none",
  },
};

const customSxTab = {
  fontWeight: "700",
  color: "#000000",
};

const SettingsModal = ({ modalName = "settings-modal" }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [tabsValues, setTabsValues] = React.useState({
    id: "repair",
    childId: "temporaries",
  });

  // React.useEffect(() => {
  //   dispatch(loadSystemSettings());
  // }, [dispatch]);

  const getFields = () => {
    return ALL_FIELDS.reduce((acc, current) => {
      if (tabsValues.childId === current.type) {
        acc.push(current);
      }
      return acc;
    }, []);
  };

  const handleChange = (value, tabKey) => {
    switch (value) {
      case "generalSettings":
        setTabsValues({ [tabKey]: value, childId: null });
        break;
      case "repair":
        setTabsValues({
          [tabKey]: value,
          childId: "temporaries",
        });
        break;
      case "tech_taxi":
        setTabsValues({
          [tabKey]: value,
          childId: "temporariesTaxi",
        });
        break;
      default:
        setTabsValues((prevState) => ({ ...prevState, [tabKey]: value }));
        break;
    }
  };

  const handleClose = useCallback(() => dispatch(modalSlice.actions.closeModal(modalName)), [dispatch, modalName]);

  const childrenTabs = () => {
    return TABS_CURRENT_EVENTS.reduce((acc, current) => {
      if (tabsValues.id === current.id) {
        acc.push(current.children);
      }
      return acc;
    }, []).flat();
  };

  const renderTabs = (tabs, tabKey, customSx) => {
    return (
      <Tabs
        value={tabsValues[tabKey]}
        tabs={tabs}
        handleChange={(event, value) => handleChange(value, tabKey)}
        sx={{ ...styleTabs, ...customSx }}
        customSxTab={{
          ...customSxTab,
          color: theme.palette.mode === LIGHT_THEME ? "#333333" : "#FFFFFF",
        }}
      />
    );
  };

  return (
    <Modal modalName={modalName} title="Системные настройки" customSX={{ width: 860 }}>
      <Box sx={{ display: "flex", marginBottom: "15px" }}>
        <Icon
          name={"line"}
          color="primary"
          sx={{
            height: "55px",
            margin: "auto 0",
            width: "25px",
          }}
        />
        <Box>
          {renderTabs(TABS_CURRENT_EVENTS, "id")}
          {renderTabs(childrenTabs(), "childId", { marginLeft: "25px" })}
        </Box>
      </Box>

      <SystemSettings moduleKey={tabsValues.childId} fields={getFields()} onClose={handleClose} />
    </Modal>
  );
};

export default SettingsModal;
