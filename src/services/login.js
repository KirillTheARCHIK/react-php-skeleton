export const login = async (values) => {
  try {
    return {
      login: values.username,
      name: values.username,
      roles: ["ROLE_USER", "ROLE_ADMIN"],
      organization: null,
      organizations: [],
      subdivisionName: null,
      phoneNumber: null,
      internalPhoneNumber: null,
      email: null,
      employeeNumber: null,
      position: null,
      enabled: true,
      canImpersonate: true,
      inImpersonate: false,
      specialCargoHandlingTypes: [],
      displayName: values.username,
    };
  } catch (e) {
    return e.response || { error: e.message };
  }
};

export const logout = async () => {
  // let req = {};
  // const response = await fetch("/api/v1/logout", {
  //   method: "get",
  //   credentials: "include",
  //   redirect: "manual",
  // });
  // if (response.type === "opaqueredirect") {
  //   req = response.type;
  // }
  return {};
};

export const getUser = async () => {
  return {};
};

export const impersonateUser = async (username) => {
  const response = await fetch(`/api/v1/login?_switch_user=${username}`, {
    credentials: "include",
    redirect: "manual",
  });

  if (response.ok || response.type === "opaqueredirect") {
    window.location.replace("/");
  }
};
