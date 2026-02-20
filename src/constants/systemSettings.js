import composeValidators, {
  maxValue60,
  maxValue120,
  maxValue70,
  maxValue99,
  minValue0,
  minValue1,
  minValue15,
  minValue91,
  required,
} from "helpers/formValidators";

import {
  CALENDAR_SHIFT_PAIR_AVAILABLE_MIN_PERIOD_OPTIONS,
  TIME_TO_APPROVE_OPTIONS,
  TIME_TO_APPROVE_SUMMARY_REQUEST_OPTIONS,
  TIME_TO_RECEIVE_APP_BY_DRIVER_OPTIONS,
} from "./options";
import { range } from "helpers/structures";

export const TABS_CURRENT_EVENTS = [
  {
    id: "generalSettings",
    label: "Общие настройки",
    children: [],
  },
  {
    id: "repair",
    label: "ТОиР",
    children: [
      {
        id: "temporaries",
        label: "Временные значения",
      },
      {
        id: "constantPresets",
        label: "Константные предустановки",
      },
    ],
  },
  {
    id: "tech_taxi",
    label: "Технологическое такси",
    children: [
      {
        id: "temporariesTaxi",
        label: "Временные значения",
      },
      {
        id: "TimersApplicationStatuses",
        label: "Таймеры статусов состояния заявки",
      },
      {
        id: "colorSegments",
        label: "Цветовые сегменты причин",
      },
    ],
  },
];

export const ALL_FIELDS = [
  {
    id: "vehicle_amount_in_process",
    label: "Режим обработки очереди ТОиР",
    validate: composeValidators(required, minValue0),
    type: "temporaries",
  },
  {
    id: "repair_application_lock_time",
    label: "Время блокировки ЗВР при отсутствии ТС в зоне приема (минуты)",
    validate: required,
    type: "temporaries",
  },
  {
    id: "arm_refresh_time",
    label: "Временной интервал обновления перечня ЗВР (минуты)",
    validate: required,
    type: "temporaries",
  },
  {
    id: "information_message_interval",
    label: "Интервал отображения информационных сообщений (минуты)",
    validate: required,
    type: "temporaries",
  },
  {
    id: "external_repair_application_priority",
    label: "Значение ИПРТ для внешних ТС",
    validate: composeValidators(required, minValue91, maxValue99),
    type: "constantPresets",
  },
  {
    id: "repair_application_priority",
    label: "Значение ИПРТ, назначаемое административным персоналом",
    validate: composeValidators(required, minValue91, maxValue99),
    type: "constantPresets",
  },

  {
    id: "vehicle_economic_efficiency",
    label: "Вес коэффициента экономической эффективности ТС",
    validate: composeValidators(required, minValue1, maxValue70),
    type: "constantPresets",
  },
  {
    id: "processing_calendar_shift_time",
    label: "Значение временной обработки КС (минуты)",
    type: "temporariesTaxi",
    validate: required,
  },
  {
    id: "data_redistribution_time",
    label: "Частота запуска перераспределения (минуты)",
    type: "temporariesTaxi",
    validate: required,
  },

  {
    id: "data_refresh_time",
    label: "Временной интервал обновления данных (секунды)",
    type: "temporariesTaxi",
    validate: required,
  },
  {
    id: "start_work_time",
    label: "Время начала работы",
    type: "temporariesTaxi",
    field: {
      type: "time",
    },
  },
  {
    id: "time_period_request",
    label: "Временной период запроса",
    type: "temporariesTaxi",
    field: {
      type: "time",
    },
  },
  {
    id: "time_to_approve",
    label: "Время на редактирование и утверждение разнарядок, часы",
    type: "temporariesTaxi",
    field: {
      type: "select",
      options: TIME_TO_APPROVE_OPTIONS,
    },
  },
  {
    id: "time_to_edit_discharge_before_calendar_shift_start",
    label:
      "Время окончания редактирования утвержденной разнарядки до старта КС, мин",
    type: "temporariesTaxi",
    validate: composeValidators(required, minValue15, maxValue60),
  },
  {
    id: "time_to_approve_summary_request",
    label: "Время утверждения итогового запроса на транспорт, мин",
    type: "temporariesTaxi",
    field: {
      type: "select",
      options: TIME_TO_APPROVE_SUMMARY_REQUEST_OPTIONS,
    },
  },
  {
    id: "time_accept_app_next_day",
    label: "Время окончания приема предварительных заявок на КС следующего дня",
    type: "temporariesTaxi",
    field: {
      type: "time",
      disabledTime: (current) => ({
        disabledHours: () => range(18, 24),
        disabledMinutes: () => {
          const hours = current.hours();
          if (hours < 17) {
            return [];
          }
          if (hours > 17) {
            return range(0, 60);
          }
          return range(1, 60);
        },
      }),
    },
  },
  {
    id: "calendar_shift_pair_available_min_period",
    label: "Минимальное время доступности пары на КС, часы",
    type: "temporariesTaxi",
    field: {
      type: "select",
      options: CALENDAR_SHIFT_PAIR_AVAILABLE_MIN_PERIOD_OPTIONS,
    },
  },
  {
    id: "time_to_receive_app_by_driver",
    label: "Время на прием заявки водителем, мин",
    type: "temporariesTaxi",
    field: {
      type: "select",
      options: TIME_TO_RECEIVE_APP_BY_DRIVER_OPTIONS,
    },
  },
  {
    id: "time_to_departure_to_line",
    label: "Время выезда на линию, мин",
    type: "temporariesTaxi",
    validate: composeValidators(required, minValue1, maxValue120),
  },
  {
    id: "time_to_notify_driver_before_application_start",
    label: "Время уведомления водителя о заявке, мин",
    type: "temporariesTaxi",
    validate: composeValidators(required, minValue0),
  },
  {
    id: "timer_application_started",
    label: "Начато выполнение заявки",
    type: "TimersApplicationStatuses",
    validate: composeValidators(required, minValue1),
  },
  {
    id: "timer_application_begun_move_next",
    label: "Начато движение к МТ № 1 ",
    type: "TimersApplicationStatuses",
    validate: composeValidators(required, minValue1),
  },
  {
    id: "timer_application_arrived",
    label: "Прибыл на МТ",
    type: "TimersApplicationStatuses",
    validate: composeValidators(required, minValue1),
  },
  {
    id: "timer_application_cargo_operation_started",
    label: "Начаты грузовые операции на МТ",
    type: "TimersApplicationStatuses",
    validate: composeValidators(required, minValue1),
  },

  {
    id: "timer_application_cargo_operation_completed",
    label: "Завершены грузовые операции на МТ (минуты)",
    type: "TimersApplicationStatuses",
    validate: required,
  },
  {
    id: "timer_application_begun_move",
    label: "Начато движение к МТ № ХХХ",
    type: "TimersApplicationStatuses",
    validate: composeValidators(required, minValue1),
  },
];
