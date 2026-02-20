export const parseNumber = (value) => {
  if (value === "" || value === null || value === undefined) return value;
  return +value;
};

export const clip = (value, decimal) => {
  if (value === "") return value;
  const k = Math.pow(10, decimal);
  return Math.floor(+value * k) / k;
};

export const parseRubles = (value) => {
  return parseFloat(String(value).replaceAll(" ", ""));
};

export const parsePhoneWithoutPlus = (value) => {
  return value
    .replace(/\+/g, "")
    .replace(/\)/g, "")
    .replace(/\(/g, "")
    .replace(/-/g, "")
    .replace(/ /g, "");
};

export const parsePhone = (value) => {
  return value
    .replace(/\)/g, "")
    .replace(/\(/g, "")
    .replace(/-/g, "")
    .replace(/ /g, "");
};

export const parseEnglishLettersAndNumber = (value) => {
  return value.replace(/[^a-zA-Z0-9]/g, "");
};

export const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return value.split(":")?.[1] || value;
  }
};
