/**
 * @typedef {Object} urlOptions
 * @property {string} [fileName]
 * @property {string} [target]
 */

/**
 * Открывает ссылку
 * @param url адрес ссылки
 * @param {object} urlOptions объект дополнительных параметров ссылки
 * @param urlOptions.fileName имя скачеваемого файла
 * @param urlOptions.target значение атрибута target для ссылки
 */
export default function openURL(url, { fileName, target = "_blank" } = {}) {
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.target = target;

  if (fileName) {
    a.download = fileName;
  }

  document.body.appendChild(a);
  a.onclick = (event) => event.stopPropagation();
  a.click();
  a.remove();
}
