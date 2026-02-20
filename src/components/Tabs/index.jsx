import React from "react";
import { Tab } from "@mui/material";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";

const Tabs = ({ tabs, value, orientation, handleChange, sx, customSxTab }) => {
  return (
    <TabContext value={value}>
      <TabList
        onChange={handleChange}
        orientation={orientation}
        aria-label="tab"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          ...sx,
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            sx={{
              minWidth: "auto",
              alignItems: "flex-start",
              ...customSxTab,
            }}
            value={tab.id}
          />
        ))}
      </TabList>
    </TabContext>
  );
};

export default Tabs;
