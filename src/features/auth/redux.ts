import { createSlice } from "@reduxjs/toolkit";
import type { UserDTO } from "./user.dto";
import type { UserRoleDTO } from "helpers/routes";
import { fetchRequest, isErrorHttpResponse, type ErrorHttpResponse, type FetchOptions } from "helpers/fetchRequest";
import { createDefaultThunk } from "store/utility/defaultThunk";

const SLICE_NAME = "auth";

interface AuthState {
  currentUser?: UserDTO;
  roles: UserRoleDTO[];
  loading: boolean;
  postLoading: boolean;
  error?: ErrorHttpResponse;
}

const initialState: AuthState = {
  roles: [],
  loading: false,
  postLoading: false,
};

async function loginService(
  url: string | URL,
  options: FetchOptions
): Promise<{ user: UserDTO; roles: UserRoleDTO[] } | ErrorHttpResponse> {
  const user = await fetchRequest<UserDTO>(url, options);
  if (isErrorHttpResponse(user)) {
    return user;
  }
  const userRoles = await fetchRequest<UserRoleDTO[]>("api/v1/roles", { ...options, method: "get" });
  if (isErrorHttpResponse(userRoles)) {
    return userRoles;
  }
  return {
    user,
    roles: userRoles,
  };
}

async function logoutService(url: string | URL, options: FetchOptions): Promise<undefined | ErrorHttpResponse> {
  const error = await fetchRequest<undefined>(url, options);
  if (error?.status === 204) {
    return;
  }
  if (isErrorHttpResponse(error)) {
    return error;
  }
  return;
}

export const fetchCurrentUser = createDefaultThunk<{ user: UserDTO; roles: UserRoleDTO[] }>(
  `${SLICE_NAME}/fetchCurrentUser`,
  "api/v1/login",
  { customFetch: loginService }
);

export const login = createDefaultThunk<{ user: UserDTO; roles: UserRoleDTO[] }, { username: string; password: string }>(
  `${SLICE_NAME}/login`,
  "api/v1/login",
  { customFetch: loginService, method: "post" }
);

export const logout = createDefaultThunk<void>(`${SLICE_NAME}/logout`, "api/v1/logout", { customFetch: logoutService });

export const authSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers(builder) {
    /////////////////////////////////////////////////////////////////////////////////////////////////
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      // console.log("fetchCurrentUser.pending");
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.currentUser = payload.user;
      state.roles = payload.roles;
      // console.log("fetchCurrentUser.fulfilled");
    });
    builder.addCase(fetchCurrentUser.rejected, (state, { payload, error }) => {
      // console.log("error", error);
      state.loading = false;
      state.error = payload as ErrorHttpResponse;
      // console.log("fetchCurrentUser.rejected");
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////
    builder.addCase(login.pending, (state) => {
      state.postLoading = true;
      state.error = undefined;
      // console.log("login.pending");
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.postLoading = false;
      state.currentUser = payload.user;
      state.roles = payload.roles;
      // console.log("login.fulfilled");
    });
    builder.addCase(login.rejected, (state, { payload, error }) => {
      // console.log("error", error);
      state.postLoading = false;
      state.error = payload as ErrorHttpResponse;
      // console.log("login.rejected");
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////
    builder.addCase(logout.pending, (state) => {
      state.postLoading = true;
      state.error = undefined;
      // console.log("logout.pending");
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.postLoading = false;
      state.currentUser = initialState.currentUser;
      state.roles = initialState.roles;
      state.loading = initialState.loading;
      // console.log("logout.fulfilled");
    });
    builder.addCase(logout.rejected, (state, { payload, error }) => {
      // console.log("error", error);
      state.postLoading = false;
      state.error = payload as ErrorHttpResponse;
      // console.log("logout.rejected");
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////
  },
});
