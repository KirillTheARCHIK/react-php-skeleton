import React from "react";

import { Box, Card, Chip, Stack } from "@mui/material";
import { formatDate, formatFullDateTime, formatTime } from "helpers/date";

const FORMAT_DATE = {
  date: formatDate,
  year: formatDate,
  time: formatTime,
  datetime: formatFullDateTime,
  custom_datetime: formatFullDateTime,
};

const CustomChips = ({ availableChips, fields, handleDeleteChip }) => {
  const getFormatedTime = (start, end) => {
    if (start && end) return `C ${start} по ${end}`;
    if (!start && end) return `Окончание ${end}`;
    return `Начало ${start}`;
  };

  const buildChips = (values, fields) => {
    const usedFiltrationFields = Object.keys(values);
    const structureChips = usedFiltrationFields.map((item) => {
      const fieldFilter = fields.find((field) => field.id === item);
      const chipId = fieldFilter?.id;
      const titleChip = fieldFilter?.label;
      const fieldType =
        fieldFilter?.field?.type || fieldFilter?.field?.typeFilter;

      switch (fieldType) {
        case "year":
        case "datetime":
        case "time":
        case "date": {
          let startDate;
          if (values[chipId].start) {
            startDate = FORMAT_DATE[fieldType](values[chipId].start);
          }
          let endDate;
          if (values[chipId].end) {
            endDate = FORMAT_DATE[fieldType](values[chipId].end);
          }
          return { ...fieldFilter, value: getFormatedTime(startDate, endDate) };
        }
        case "select": {
          return {
            ...fieldFilter,
            title: titleChip,
            value: values[chipId].label,
          };
        }
        case "asyncselect": {
          return {
            ...fieldFilter,
            title: titleChip,
            value: values[chipId].displayName,
          };
        }
        case "custom_datetime": {
          return {
            ...fieldFilter,
            value: FORMAT_DATE[fieldType](values[chipId]),
          };
        }
        default: {
          return {
            ...fieldFilter,
            title: titleChip,
            value: values[chipId],
          };
        }
      }
    });

    return structureChips;
  };

  const chips = buildChips(availableChips, fields);

  if (chips.length) {
    return (
      <Stack spacing={{ sx: 1 }} direction="row" mb={1} flexWrap="wrap">
        {chips.map((chip) => {
          return (
            <Card
              key={chip.id}
              sx={{
                maxWidth: "260px",
                padding: "2px 8px 4px 8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                margin: "3px",
                borderRadius: "10px",
              }}
            >
              <Box
                sx={{
                  mb: "1px",
                  fontSize: 14,
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                {chip.label}
              </Box>
              <Chip
                label={chip.value}
                onDelete={() => handleDeleteChip(chip)}
                sx={{
                  mb: "2px",
                }}
              />
            </Card>
          );
        })}
      </Stack>
    );
  }
  return null;
};
CustomChips.defaultProps = {
  availableChips: [],
  fields: [],
};

export default CustomChips;
