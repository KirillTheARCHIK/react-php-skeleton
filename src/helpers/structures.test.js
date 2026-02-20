import { range } from "helpers/structures";

test("testing range", () => {
  expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
  expect(range(0, 5, 2)).toEqual([0, 2, 4]);
  expect(range(-3, 9, 3)).toEqual([-3, 0, 3, 6]);
  expect(range(5, 6)).toEqual([5]);
  expect(range(5, 6, 2)).toEqual([5]);
  expect(range(5, 5)).toEqual([]);
  expect(range(5, 4)).toEqual([]);
});
