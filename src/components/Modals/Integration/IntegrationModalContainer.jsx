import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "store/hooks";
import IntegrationModal from "widgets/integrationModal/IntegrationModal";
import { cronParserToCronCommand, cronParserToDate } from "helpers/cronParser";
import { formatDate } from "helpers/date";
import { DAYS_IN_WEEK, INTEGRATION_INTERVALS } from "constants/integration";

const IntegrationModalContainer = ({ modalName, reducerKey, getIntegrationInfo, setIntegrationSchedule, changeIntegration }) => {
  const dispatch = useDispatch();
  const integrationInfo = useSelector((state) => state[reducerKey].integration);
  const initialValues = useMemo(() => cronParserToDate(integrationInfo.lastCronDate), [integrationInfo.lastCronDate]);
  const weekOptions = useMemo(() => Object.values(DAYS_IN_WEEK), []);
  const intervalsOptions = useMemo(() => Object.values(INTEGRATION_INTERVALS), []);
  const lastChange = useMemo(
    () => (integrationInfo.lastChange ? formatDate(integrationInfo.lastChange) : null),
    [integrationInfo.lastChange]
  );

  useEffect(() => {
    dispatch(getIntegrationInfo());
  }, [dispatch, getIntegrationInfo]);

  const onSubmit = useCallback(
    (values) => {
      const cronCommand = cronParserToCronCommand(values.period.value, values.date, values.dayOfWeek?.value);
      dispatch(setIntegrationSchedule(cronCommand));
    },
    [dispatch, setIntegrationSchedule]
  );

  const onForcedStart = useCallback(() => {
    dispatch(changeIntegration("start"));
  }, [dispatch, changeIntegration]);

  const onStart = useCallback(() => {
    if (integrationInfo.enabled) {
      dispatch(changeIntegration("disable"));
    } else {
      dispatch(changeIntegration("enable"));
    }
  }, [dispatch, integrationInfo.enabled, changeIntegration]);

  return (
    <IntegrationModal
      modalName={modalName}
      integrationInfo={integrationInfo}
      initialValues={initialValues}
      intervalsOptions={intervalsOptions}
      onSubmit={onSubmit}
      weekOptions={weekOptions}
      onStart={onStart}
      onForcedStart={onForcedStart}
      lastChange={lastChange}
    />
  );
};

export default IntegrationModalContainer;
