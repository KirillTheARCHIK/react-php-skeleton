import React from "react";
import Modal from "components/Modal";
import { IntegrationModalForm } from "./IntegrationModalForm";
import { IntegrationModalControls } from "./IntegrationModalControls";

const IntegrationModal = ({
  modalName,
  integrationInfo,
  initialValues,
  intervalsOptions,
  onSubmit,
  weekOptions,
  lastChange,
  onForcedStart,
  onStart,
}) => {
  return (
    <Modal modalName={modalName} title={"Интеграционная шина"}>
      <IntegrationModalForm
        integrationInfo={integrationInfo}
        initialValues={initialValues}
        intervalsOptions={intervalsOptions}
        onSubmit={onSubmit}
        weekOptions={weekOptions}
      />
      <IntegrationModalControls
        lastChange={lastChange}
        onForcedStart={onForcedStart}
        onStart={onStart}
        integrationInfo={integrationInfo}
      />
    </Modal>
  );
};

IntegrationModal.defaultProps = {
  onSubmit: () => {},
};

export default IntegrationModal;
