export const loadUserRoles = () => {
  return [
    {
      name: "Дешифрирование",
      key: "decryption",
      controller: "App\\Controller\\Catalog\\ConstantController",
      roles: ["ROLE_ADMIN"],
    },
    {
      name: "Летное задание",
      key: "flightAssignment",
      controller: "App\\Controller\\Catalog\\ConstantController",
      roles: ["ROLE_ADMIN"],
      disabled: true,
    },
    {
      name: "Верификация",
      key: "verification",
      controller: "App\\Controller\\Catalog\\ConstantController",
      roles: ["ROLE_ADMIN"],
      disabled: true,
    },
    {
      name: "Верификация",
      key: "driver",
      controller: "App\\Controller\\Catalog\\ConstantController",
      roles: ["ROLE_ADMIN"],
      disabled: true,
    },
    {
      name: "Отчеты по дешифрированию",
      key: "contractor",
      controller: "App\\Controller\\Catalog\\ConstantController",
      roles: ["ROLE_ADMIN"],
      disabled: true,
    },
    {
      name: "Пользователи",
      key: "user",
      controller: "App\\Controller\\Catalog\\ConstantController",
      roles: ["ROLE_ADMIN"],
      disabled: true,
    },
  ];
};
