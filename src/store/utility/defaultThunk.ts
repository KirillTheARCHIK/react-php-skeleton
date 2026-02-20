import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRequest, isErrorHttpResponse, type ErrorHttpResponse, type FetchOptions } from "helpers/fetchRequest";

export interface TrunkArgs<BodyType extends string | object | FormData | void = void, ResolveValue = void, RejectValue = void> {
  /** Тип аргумента */
  arg?: BodyType;
  onResolve?: (data: ResolveValue) => void;
  onReject?: (data: RejectValue) => void;
}
export function isTrunkArgs<BodyType extends string | object | FormData | void = void, ResolveValue = void, RejectValue = void>(
  object: unknown
): object is TrunkArgs<BodyType, ResolveValue, RejectValue> {
  return typeof object === "object" && ("arg" in object || "onResolve" in object || "onReject" in object);
}

export function createDefaultThunk<ReturnType, BodyType extends string | object | FormData | void = void>(
  typePrefix: string,
  /** Можно передать URL, по которому будет выполнен запрос или кастомную функцию */
  url: string | URL | ((payload: TrunkArgs<BodyType, ReturnType, ErrorHttpResponse>) => string | URL),
  other: {
    customFetch?: (url: string | URL, fetchOptions: FetchOptions) => Promise<ReturnType | ErrorHttpResponse>;
    /** "get", если поле пустое */
    method?: "get" | "post" | "put" | "patch" | "delete";
  }
) {
  return createAsyncThunk<ReturnType, BodyType | TrunkArgs<BodyType, ReturnType, ErrorHttpResponse>>(
    typePrefix,
    async (thunkArg, thunk) => {
      const payload: TrunkArgs<BodyType, ReturnType, ErrorHttpResponse> = isTrunkArgs<BodyType, ReturnType, ErrorHttpResponse>(thunkArg)
        ? thunkArg
        : { arg: thunkArg };

      /** URL, по которому будет выполнен запрос */
      const _url: string | URL = typeof url === "function" ? url(payload) : url;

      /** Параметры для http-запроса */
      const options: FetchOptions = { method: other.method };
      const requestBody = payload.arg;
      if (requestBody) {
        options.body = requestBody;
      }

      /** Ответ на http-запрос, вызывается стандартная или кастомная функция, указанная в параметрах */
      const res =
        other.customFetch && typeof other.customFetch === "function"
          ? await other.customFetch(_url, options)
          : await fetchRequest<ReturnType>(_url, options);

      //Обработка результата: resolve при успехе, reject при ошибке
      if (isErrorHttpResponse(res)) {
        if (payload.onReject) {
          payload.onReject(res);
        }
        // console.log("thunk.rejectWithValue", res);
        return thunk.rejectWithValue(res);
      } else {
        if (payload.onResolve) {
          payload.onResolve(res);
        }
        // console.log("thunk.fulfillWithValue", res);
        return thunk.fulfillWithValue(res);
      }
    }
  );
}
