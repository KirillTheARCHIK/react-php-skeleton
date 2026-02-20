import { store } from "store/store";
import { setRequest } from "actions/request";

import { MODAL_STATE } from "components/Modal";
import { modalSlice } from "store/utility/modalSlice";
import { historySingleton } from "App";

const historyPushErrorPage = (req, errorChecking) => {
  // setTimeout(() => {
  //   historySingleton?.push("/error", { status: req.status });
  // }, 1000);
  if (errorChecking) {
    switch (req.status) {
      case 204:
        break;
      // case 400:
      //   store.dispatch(setRequest(req));
      //   break;
      case 401:
        store.dispatch(modalSlice.actions.openModal({ modalName: "login-modals", modalState: MODAL_STATE.OPENED }));
        break;
      default:
        historySingleton?.push("/error", { status: req.status });
        break;
    }
  }
};

export interface ErrorHttpResponse {
  status?: number;
  ok: boolean;
  error?: string;
  violations?: any[];
  cause?: any;
}

export function isErrorHttpResponse(object: unknown): object is ErrorHttpResponse {
  return typeof object === "object" && (("ok" in object && !object.ok) || ("error" in object && <boolean>object.error));
}

export interface FetchOptions {
  method?: "get" | "post" | "put" | "patch" | "delete";
  credentials?: RequestCredentials;
  body?: FormData | object | string;
  headers?: HeadersInit;
  errorChecking?: boolean;
}

export const fetchRequest = async <ResType>(url: string | URL, opts: FetchOptions = {}) => {
  const { method = "get", credentials = "include", body = undefined, headers = {}, errorChecking = true } = opts;
  const res: ErrorHttpResponse = {
    ok: false,
  };
  let response: Response | undefined;
  try {
    switch (method) {
      case "get": {
        response = await fetch(url, { credentials });
        break;
      }
      ///
      case "post":
      case "put":
      case "patch": {
        const responseHeaders = body instanceof FormData ? {} : { "Content-Type": "application/json" };
        response = await fetch(url, {
          method: method.toUpperCase(),
          credentials,
          body: body instanceof FormData ? body : JSON.stringify(body),
          headers: { ...responseHeaders, ...headers },
        });
        break;
      }
      ///
      case "delete": {
        response = await fetch(url, {
          method: "delete",
          credentials: credentials,
        });
        break;
      }
    }
    res.ok = response.ok;
    res.status = response.status;
    const resBody = await response.text();
    let data = undefined;
    try {
      data = JSON.parse(resBody);
    } catch {
      data = { status: 204, error: resBody.includes("<!DOCTYPE html>") ? "HTML ошибка" : "Ошибка парсинга ответа от сервера" };
    }

    historyPushErrorPage(res, errorChecking);
    if (!res.ok) {
      res.error = data.error ?? data.detail;
      res.violations = data.violations;
      res.cause = data.cause;
      if (method === "delete") {
        historyPushErrorPage(res, errorChecking);
      }
      return res;
    } else {
      return data as ResType;
    }
  } catch (e) {
    res.error = e;
    if (res.status !== 400) {
      historyPushErrorPage(res, errorChecking);
    }
    return res;
  }
};
