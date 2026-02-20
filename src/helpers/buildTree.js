export const buildTreeReportGroup = (data) => {
  const treeData = data.reduce(
    (
      acc,
      {
        subdivisionId,
        subdivisionName,
        personnelNumber,
        driverName,
        indicator,
        indicatorValue,
      }
    ) => {
      const childs = acc[subdivisionId]?.children || [];
      acc[subdivisionId] = {
        ...acc[subdivisionId],
        id: subdivisionId,
        subdivisionName,
        children: [
          ...childs,
          { personnelNumber, driverName, indicator, indicatorValue },
        ],
      };
      return acc;
    },
    {}
  );
  return Object.values(treeData);
};

export const buildTreeReportUngroup = (data) => {
  const treeData = data.reduce(
    (
      acc,
      {
        subdivisionId,
        subdivisionName,
        driverId,
        driverName,
        personnelNumber,
        indicator,
        indicatorValue,
      }
    ) => {
      const childs = acc[subdivisionId]?.children || [];
      acc[subdivisionId] = {
        ...acc[subdivisionId],
        id: subdivisionId,
        subdivisionName,
        children: [
          ...childs,
          {
            driverId,
            driverName,
            children: [
              ...(childs.children || []),
              { indicator, indicatorValue, personnelNumber },
            ],
          },
        ],
      };
      return acc;
    },
    {}
  );
  return Object.values(treeData);
};

export const buildTreeReportGsm = (data) => {
  const treeData = data.reduce(
    (
      acc,
      {
        subdivisionId,
        subdivisionName,
        driverName,
        governmentNumber,
        vehicleTypeModel,
        modelIce,
        groupName,
        shiftSpentFuel,
        avgGroup,
        deviation,
        points,
      }
    ) => {
      const childs = acc[subdivisionId]?.children || [];
      acc[subdivisionId] = {
        ...acc[subdivisionId],
        id: subdivisionId,
        subdivisionName,
        children: [
          ...childs,
          {
            governmentNumber,
            vehicleTypeModel,
            modelIce,
            groupName,
            children: [
              ...(childs.children || []),
              { driverName, shiftSpentFuel, avgGroup, deviation, points },
            ],
          },
        ],
      };
      return acc;
    },
    {}
  );
  return Object.values(treeData);
};

export const buildTreeWorkPLaces = (data) => {
  const treeData = data.reduce(
    (
      acc,
      {
        vehicleId,
        vehicleNumber,
        vehicleModel,
        vehicleType,
        rating,
        ...current
      }
    ) => {
      const childs = acc[vehicleId]?.children || [];
      acc[vehicleId] = {
        ...acc[vehicleId],
        id: vehicleId,
        vehicleNumber,
        vehicleModel,
        vehicleType,
        rating,
        children: [...childs, { ...current }],
      };
      return acc;
    },
    {}
  );
  return Object.values(treeData);
};
