import {
  getColorContrastRatio,
  getRelativeLuminance,
  hexToRgb,
} from "helpers/colors";

test("testing hextToRgb", () => {
  expect(hexToRgb("#ffffff")).toEqual({
    r: 255,
    g: 255,
    b: 255,
  });

  expect(hexToRgb("#FFFFFF")).toEqual({
    r: 255,
    g: 255,
    b: 255,
  });

  expect(hexToRgb("#aabbcc")).toEqual({
    r: 170,
    g: 187,
    b: 204,
  });

  expect(hexToRgb("#AABBCC")).toEqual({
    r: 170,
    g: 187,
    b: 204,
  });

  expect(hexToRgb("#abc")).toEqual({
    r: 170,
    g: 187,
    b: 204,
  });

  expect(hexToRgb("#ABC")).toEqual({
    r: 170,
    g: 187,
    b: 204,
  });

  expect(hexToRgb("#000000")).toEqual({
    r: 0,
    g: 0,
    b: 0,
  });

  expect(hexToRgb("#000")).toEqual({
    r: 0,
    g: 0,
    b: 0,
  });

  expect(hexToRgb("notValidColorString")).toBeNull();
});

test("testing getRelativeLuminance", () => {
  expect(typeof getRelativeLuminance("#000")).toBe("number");
  expect(getRelativeLuminance("#000000")).toBe(0);
  expect(getRelativeLuminance("#ffffff")).toBe(1);
  expect(getRelativeLuminance("notValidColorString")).toBeNull();
});

test("testing getColorContrastRatio", () => {
  expect(getColorContrastRatio("#ffffff", "#ffffff")).toBe(1);
  expect(getColorContrastRatio("#FFFFFF", "#FFFFFF")).toBe(1);
  expect(getColorContrastRatio("#ffffff", "#FFFFFF")).toBe(1);
  expect(getColorContrastRatio("#fff", "#fff")).toBe(1);
  expect(getColorContrastRatio("#FFF", "#FFF")).toBe(1);
  expect(getColorContrastRatio("#fff", "#FFF")).toBe(1);
  expect(getColorContrastRatio("#000000", "#000000")).toBe(1);
  expect(getColorContrastRatio("#000", "#000")).toBe(1);
  expect(getColorContrastRatio("#ffffff", "#000000")).toBe(21);
  expect(getColorContrastRatio("#000000", "#ffffff")).toBe(21);
  expect(getColorContrastRatio("notValidColorString", "#ffffff")).toBeNull();
  expect(getColorContrastRatio("#ffffff", "notValidColorString")).toBeNull();
  expect(getColorContrastRatio("#ffffff", "#37ff00")).toBeCloseTo(1.36, 1);
  expect(getColorContrastRatio("#212121", "#37ff00")).toBeCloseTo(11.86, 1);
  expect(getColorContrastRatio("#ffffff", "#ffff00")).toBeCloseTo(1.07, 1);
  expect(getColorContrastRatio("#212121", "#ffff00")).toBeCloseTo(14.99, 1);
});
