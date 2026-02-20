import { isISODate } from "helpers/validators";

test("testing isISODate", () => {
  const testData = [
    ["2024-01-31", true],
    ["2024-01-31T00:00:00", true],
    ["2024-01-31T00:00:00Z", true],
    ["20240131T000000Z", true],
    ["2024-01-31T00:00:00.000Z", true],
    ["2024-01-31T00:00:00.000Z", true],
    ["2024-01-31T00:00:00+03", true],
    ["2024-01-31T00:00:00+03:00", true],
    ["2024-31-01", false],
    ["31-01-2024", false],
    ["2024-31-01T00:00:00+03:00", false],
  ];

  testData.forEach(([date, expected]) => {
    expect(isISODate(date)).toBe(expected);
  });
});