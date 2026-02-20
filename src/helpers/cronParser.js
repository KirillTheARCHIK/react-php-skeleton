import parser from "cron-parser";
import { INTEGRATION_INTERVALS, DAYS_IN_WEEK } from "constants/integration";
import { moment } from "./date";

export const cronParserToDate = (cronCommand) => {
  let period;
  const cronDate = new Date();
  let dayOfWeek = DAYS_IN_WEEK["1"];
  const interval = parser.parseExpression(cronCommand);
  const fields = JSON.parse(JSON.stringify(interval.fields));
  if (fields.dayOfWeek.length === 1) {
    period = INTEGRATION_INTERVALS.week;
    dayOfWeek = DAYS_IN_WEEK[fields.dayOfWeek[0]];
  } else if (fields.dayOfMonth.length === 1) {
    period = INTEGRATION_INTERVALS.month;
    cronDate.setDate(fields.dayOfMonth[0]);
  } else if (fields.hour.length === 1 && fields.minute.length === 1) {
    period = INTEGRATION_INTERVALS.day;
  } else {
    return {
      date: undefined,
      dayOfWeek: undefined,
      period: undefined,
    };
  }
  cronDate.setHours(fields.hour[0], fields.minute[0]);
  return {
    date: moment(cronDate),
    dayOfWeek,
    period,
  };
};

export const cronParserToCronCommand = (period, date, dayOfWeek) => {
  const baseInterval = parser.parseExpression("* * * * *");
  const fields = JSON.parse(JSON.stringify(baseInterval.fields));
  const cronDate = new Date(date);
  fields.hour = [cronDate.getHours()];
  fields.minute = [cronDate.getMinutes()];
  switch (period) {
    case "month": {
      fields.dayOfMonth = [cronDate.getDate()];
      break;
    }
    case "week": {
      fields.dayOfWeek = [dayOfWeek];
      break;
    }
    default:
      break;
  }
  return parser.fieldsToExpression(fields).stringify();
};
