export const STATUS_400 = "400";
export const STATUS_401 = "401";
export const STATUS_403 = "403";
export const STATUS_404 = "404";
export const STATUS_405 = "405";
export const STATUS_408 = "408";
export const STATUS_413 = "413";
export const STATUS_429 = "429";
export const STATUS_500 = "500";

export const TEXT_ERROR = [{ message: "Ошибка при записи в БД" }];

export const STATUS_ERROR = {
  [STATUS_400]: "Ошибка получения данных",
  [STATUS_401]: "Ошибка доступа",
  [STATUS_403]: "Доступ ограничен. Недостаточно прав",
  [STATUS_404]: "Страница не найдена",
  [STATUS_405]: "Указанный клиентом метод нельзя применить к текущему ресурсу",
  [STATUS_408]: "Истекло время ожидания запроса",
  [STATUS_413]:
    "Сервер отказывается обрабатывать запрос потому, что тело запроса превышает допустимый размер",
  [STATUS_429]: "Отправлено слишком много запросов за короткое время",
  [STATUS_500]:
    "Сервер обнаружил неожиданное условие, препятствующее выполнению запроса",
};
