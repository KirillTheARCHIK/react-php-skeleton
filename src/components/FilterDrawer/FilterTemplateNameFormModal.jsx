import React from "react";
import { useDispatch } from "react-redux";
import { Field, Form } from "react-final-form";
import { FORM_ERROR } from "final-form";

import Modal from "components/Modal";
import Button from "components/Button";
import StackButton from "components/StackButton";
import FormHelperText from "components/FormHelperText";
import Input from "components/FormFields/Input";

import { modalSlice } from "store/utility/modalSlice";
import { createFilterTemplate, updateFilterTemplate } from "actions/filterTemplates";
import { required } from "helpers/formValidators";

const FilterTemplateNameFormModal = ({
  modalName,
  catalogSlug,
  catalogName,
  filterContent,
  filterTemplate,
  filterTemplateId,
  setFilterTemplate,
  setFilterTemplateId,
}) => {
  const dispatch = useDispatch();

  const handleClose = React.useCallback(() => dispatch(modalSlice.actions.closeModal(modalName)), [dispatch, modalName]);

  const onSubmit = ({ filterName }) => {
    const newValues = {
      catalogSlug,
      catalogName,
      filterName,
      filterContent,
      public: true,
    };
    handleClose();
    // if (filterTemplateId) {
    //   return new Promise((resolve) => {
    //     dispatch(
    //       updateFilterTemplate(newValues, filterTemplateId, {
    //         resolve: ({ data }) => {
    //           resolve();
    //           handleClose();
    //           setFilterTemplate(data);
    //           setFilterTemplateId(data.id);
    //         },
    //         reject: ({ error }) => {
    //           resolve({ [FORM_ERROR]: `filterName: ${error}` });
    //         },
    //       })
    //     );
    //   });
    // }

    // return new Promise((resolve) => {
    //   dispatch(
    //     createFilterTemplate(newValues, {
    //       resolve: ({ data }) => {
    //         resolve();
    //         handleClose();
    //         setFilterTemplate(data);
    //         setFilterTemplateId(data.id);
    //       },
    //       reject: ({ error }) => {
    //         resolve({ [FORM_ERROR]: `filterName: ${error}` });
    //       },
    //     })
    //   );
    // });
  };

  return (
    <Modal modalName={modalName} title={`Форма ${filterTemplateId ? "редактирования" : "создания"} шаблона`}>
      <Form onSubmit={onSubmit} initialValues={filterTemplateId ? { filterName: filterTemplate.filterName } : {}}>
        {({ handleSubmit, submitting, pristine, form, valid, submitError, dirtySinceLastSubmit }) => {
          const validSaveBtn = valid || dirtySinceLastSubmit;
          return (
            <form onSubmit={handleSubmit}>
              <Field name="filterName" validate={required}>
                {({ input, meta }) => (
                  <Input
                    input={input}
                    meta={meta}
                    label="Наименование шаблона"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    sx={{ mb: 0 }}
                  />
                )}
              </Field>
              <StackButton>
                <Button disabled={!validSaveBtn} loading={submitting} variant="contained" type="submit" color="primary" size="small">
                  Применить
                </Button>
                <Button disabled={pristine || submitting} variant="outlined" size="small" onClick={form.reset} color="inherit">
                  Сброс
                </Button>
              </StackButton>
              {submitError && !dirtySinceLastSubmit && <FormHelperText error={submitError} />}
            </form>
          );
        }}
      </Form>
    </Modal>
  );
};

FilterTemplateNameFormModal.defaultProps = {
  modalName: "filter-template-name-modal",
};

export default FilterTemplateNameFormModal;
