import * as React from "react";
import { useDispatch, useSelector } from "store/hooks";
import { Field, Form } from "react-final-form";
import { Badge, Box, Popover, Typography } from "@mui/material";

import { initParams, setFilter, setGroup } from "actions/requestParams";
import { loadGroupData } from "actions/group";

import Icon from "components/Icon";
import Button from "components/Button";
import Select from "components/FormFields/Select";
import IconButton from "components/IconButton";

import { getInitialValuesStatePage } from "helpers/requestParams";
import { DARK_MAIN_COLOR } from "constants/themes";
import { NOT_VISIBLE_FORM_FIELDS } from "constants/formFields";

const GroupPopover = ({ columns, loadData, url, isGroup, setIsGroup, reducerKey }) => {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(null);

  const id = open ? "group-popover" : undefined;

  const requestParams = useSelector((state) => state.requestParams[reducerKey]);

  const { groupParams } = requestParams;
  const initialValues = columns.find((item) => item.id === groupParams?.fieldName)?.label;

  const onOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const onClose = () => {
    setOpen(null);
  };

  const onSubmit = (values) => {
    const value = values["group"];
    const initialValuesStatePage = getInitialValuesStatePage();
    if (value) {
      const fieldName = value?.id ?? value;
      dispatch(setFilter({}, reducerKey));
      dispatch(
        loadGroupData({
          url,
          fieldName,
          ...initialValuesStatePage,
        })
      );
      dispatch(setGroup({ fieldName }, reducerKey));
      setIsGroup(true);
    } else if (isGroup) {
      dispatch(loadData(initialValuesStatePage));
      dispatch(initParams(reducerKey));
      setIsGroup(false);
    }
  };

  const onReset = (form) => {
    form.reset();
    if (isGroup) {
      dispatch(
        loadData({
          page: 1,
          limit: 10,
        })
      );
      dispatch(initParams(reducerKey));
      setIsGroup(false);
    }
  };

  const disabledResetButton = (pristine) => {
    if (isGroup) {
      return false;
    }
    return pristine;
  };

  const renderColumns = columns.filter((item) => !NOT_VISIBLE_FORM_FIELDS.includes(item.id));

  return (
    <>
      <Badge
        variant={isGroup ? "dot" : ""}
        sx={{
          "& .MuiBadge-badge": {
            right: 7,
            top: 6,
            backgroundColor: DARK_MAIN_COLOR,
          },
        }}
      >
        <IconButton name="group" title="Группировка" color="secondary" size="small" onClick={onOpen} />
      </Badge>
      <Popover
        id={id}
        open={Boolean(open)}
        anchorEl={open}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            width: 300,
            padding: "5px 10px 10px 10px",
            overflow: "visible",
          },
        }}
      >
        <Form initialValues={{ group: initialValues }} onSubmit={onSubmit}>
          {({ handleSubmit, submitting, pristine, form }) => {
            return (
              <>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: "5px",
                  }}
                >
                  <Typography>Группировка</Typography>
                  <Button onClick={() => onReset(form)} disabled={disabledResetButton(pristine)}>
                    Сбросить
                  </Button>
                </Box>
                <form onSubmit={handleSubmit}>
                  <Box
                    component="div"
                    sx={{
                      padding: "7px",
                    }}
                  >
                    <Field name="group">
                      {({ input, meta }) => (
                        <Select
                          input={input}
                          meta={meta}
                          label="Группировать по"
                          variant="outlined"
                          fullWidth
                          options={renderColumns}
                          size="small"
                          sx={{ mb: "0 !important" }}
                          icon={<Icon name="search" color="action" sx={{ fontSize: "16px !important" }} />}
                        />
                      )}
                    </Field>
                  </Box>
                  <Box component="div" sx={{ pt: "10px" }}>
                    <Button disabled={pristine} loading={submitting} variant="contained" type="submit" color="primary" size="small">
                      Применить
                    </Button>
                  </Box>
                </form>
              </>
            );
          }}
        </Form>
      </Popover>
    </>
  );
};

export default GroupPopover;
