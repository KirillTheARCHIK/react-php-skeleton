/**
 * Строковое представление цвета вида **#aa88ff**, **#AA88FF**, **#a8f**
 * или **#A8F**
 * @typedef {string} HexColor
 */

/**
 * RGB представление цвета
 * @typedef {Object} RGBColor
 * @property {number} r красный компонент цвета, число в диапазоне [0; 255]
 * @property {number} g зеленый компонент цвета, число в диапазоне [0; 255]
 * @property {number} b голубой компонент цвета, число в диапазоне [0; 255]
 */

/**
 * Преобразует строковое представление цвета в шестнадцатеричной системе
 * счисления к десятичной, т.е. к rgb, где каждая компонента цвета определена
 * числом в диапазоне [0; 255].
 *
 * @param {HexColor} hex строковое представление цвета
 * @return {RGBColor|null}
 */
export const hexToRgb = (hex) => {
  if (typeof hex !== "string") return null;
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Возвращает некоторый коэффициент для расчета контрастности цветов в итоговой
 * формуле, вычисления типовые для каждой компоненты цвета (R, G, B)
 *
 * @param {number} XsRGB число в диапазоне **[0; 1]**
 * @return {number}
 */
const getColorComponentRatio = (XsRGB) => {
  if (XsRGB <= 0.04045) {
    return XsRGB / 12.92;
  }
  return Math.pow((XsRGB + 0.055) / 1.055, 2.4);
};

/**
 * Возвращает относительную яркость цвета
 *
 * @param {HexColor} hex строковое представление цвета
 * @return {number|null} число в диапазоне [0; 1] (для черного и
 * белого цветов соответственно, как для граничных значений)
 */
export const getRelativeLuminance = (hex) => {
  const rgb = hexToRgb(hex);
  if (rgb === null) return null;

  const { r, g, b } = rgb;
  const RsRGB = r / 255;
  const GsRGB = g / 255;
  const BsRGB = b / 255;

  const R = getColorComponentRatio(RsRGB);
  const G = getColorComponentRatio(GsRGB);
  const B = getColorComponentRatio(BsRGB);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

/**
 * Возвращает значение контрастности для цвета переднего плана относительно
 * заднего. Алгоритм вычисления контрастности представлен в документе
 * «{@link https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio WCAG}» («Web
 * Content Accessibility Guidelines»).
 *
 * @param {HexColor} foreground цвет переднего плана (цвет текста)
 * @param {HexColor} background цвет заднего плана (цвет фона)
 * @return {number|null} число в диапазоне **[1; 21]**
 */
export const getColorContrastRatio = (foreground, background) => {
  const foregroundLuminance = getRelativeLuminance(foreground);
  const backgroundLuminance = getRelativeLuminance(background);
  if (foregroundLuminance === null || backgroundLuminance === null) return null;
  let lighter = foregroundLuminance;
  let darker = backgroundLuminance;
  if (lighter < darker) {
    lighter = backgroundLuminance;
    darker = foregroundLuminance;
  }
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Вернет один из определенных цветовой схемой цветов для текста с учетом
 * наилучшей контрастности
 *
 * @param {HexColor} bgColor
 * @return {HexColor}
 */
export const getContrastTextColor = (bgColor) => {
  const black = "#212121";
  const white = "#ffffff";
  const blackContrastRatio = getColorContrastRatio(black, bgColor);
  const whiteContrastRatio = getColorContrastRatio(white, bgColor);
  return blackContrastRatio >= whiteContrastRatio ? black : white;
};
