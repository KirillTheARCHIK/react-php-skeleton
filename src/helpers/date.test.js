import {
  getDisabledDate,
  getDisabledTime,
  momentTime,
  toNaiveISOString,
} from "helpers/date";
import { addMinutes, moment } from "./date";
import { range } from "helpers/structures";

test("testing toNaiveISOString", () => {
  const testData = [
    ["2024-03-20T00:00:00.000Z", "2024-03-20T00:00:00", "Etc/UTC"],
    ["2024-03-20T00:00:00+03", "2024-03-20T00:00:00", "Europe/Moscow"],
    ["2024-03-20T00:00:00+03:00", "2024-03-20T00:00:00", "Europe/Moscow"],
    ["2024-03-20T00:00:00+04", "2024-03-20T00:00:00", "Europe/Saratov"],
    ["2024-03-20T00:00:00+04:00", "2024-03-20T00:00:00", "Europe/Saratov"],
    ["2024-03-20T00:00:00-05", "2024-03-20T00:00:00", "EST"],
    ["2024-03-20T00:00:00-05:00", "2024-03-20T00:00:00", "EST"],
    ["2024-03-20T00:23:11-05:00", "2024-03-20T00:23:11", "EST"],
  ];

  testData.forEach(([date, expected, tz]) => {
    const current = moment.tz(date, tz);
    const naiveCurrent = toNaiveISOString(current);
    expect(naiveCurrent).toBe(expected);
  });
});

test("testing getDisabledDate", () => {
  const start = moment("2024-03-20T16:35:40.000Z").utc();
  const end = moment("2024-03-23T03:10:00.000Z").utc();
  const disabledDate = getDisabledDate(start, end);

  const testData = [
    ["2024-03-19T00:00:00.000Z", true],
    ["2024-03-20T13:00:00.000Z", false],
    ["2024-03-20T16:35:41.000Z", false],
    ["2024-03-20T17:00:00.000Z", false],
    ["2024-03-23T03:10:00.000Z", false],
    ["2024-03-23T03:10:01.000Z", false],
    ["2024-03-24T03:00:00.000Z", true],
  ];

  testData.forEach(([date, expected]) => {
    const current = moment(date).utc();
    expect(disabledDate(current)).toBe(expected);
  });
});

test("testing addMinutes", () => {
  const testData = [
    {
      time: "2024-10-14T10:00:00",
      minutes: 20,
      expectedTime: "2024-10-14T10:20:00",
    },
    {
      time: "2024-10-14T10:50:00",
      minutes: 20,
      expectedTime: "2024-10-14T11:10:00",
    },
    {
      time: "2024-10-14T23:50:00",
      minutes: 20,
      expectedTime: "2024-10-15T00:10:00",
    },

    {
      time: "2024-10-14T10:00:00",
      minutes: 120,
      expectedTime: "2024-10-14T12:00:00",
    },
  ];

  testData.forEach((testCase) => {
    const currentResult = addMinutes(testCase.time, testCase.minutes, (date) =>
      toNaiveISOString(momentTime(date))
    );
    expect(currentResult).toEqual(testCase.expectedTime);
  });
});

test("testing getDisabledTime", () => {
  const start = moment("2024-03-20T16:35:40.000Z").utc();
  const end = moment("2024-03-23T03:10:00.000Z").utc();
  const disabledTime = getDisabledTime(start, end);

  const testData = [
    [
      "2024-03-19T00:00:00.000Z",
      {
        disabledHours: () => range(0, 24),
        disabledMinutes: () => range(0, 60),
      },
    ],
    [
      "2024-03-20T12:15:00.000Z",
      {
        disabledHours: () => range(0, 16),
        disabledMinutes: () => range(0, 60),
      },
    ],
    [
      "2024-03-20T16:25:00.000Z",
      {
        disabledHours: () => range(0, 16),
        disabledMinutes: () => range(0, 35),
      },
    ],
    [
      "2024-03-21T17:00:00.000Z",
      {
        disabledHours: () => [],
        disabledMinutes: () => [],
      },
    ],
    [
      "2024-03-23T03:10:00.000Z",
      {
        disabledHours: () => range(4, 24),
        disabledMinutes: () => range(11, 60),
      },
    ],
    [
      "2024-03-23T07:30:00.000Z",
      {
        disabledHours: () => range(4, 24),
        disabledMinutes: () => range(0, 60),
      },
    ],
    [
      "2024-03-24T03:00:00.000Z",
      {
        disabledHours: () => range(0, 24),
        disabledMinutes: () => range(0, 60),
      },
    ],
  ];

  testData.forEach(([date, expected]) => {
    const current = moment(date).utc();
    const result = disabledTime(current);
    const resultHours = result.disabledHours();
    const expectedHours = expected.disabledHours();
    expect(resultHours).toEqual(expectedHours);

    const resultMinutes = result.disabledMinutes();
    const expectedMinutes = expected.disabledMinutes();
    expect(resultMinutes).toEqual(expectedMinutes);
  });
});
