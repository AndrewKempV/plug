import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
/**
 *
 * Defines a typed api payload. An api payload contains both request data and the response data.
 * @type Request is an object representing the api request
 * @type Response is an object representing the api response
 */
interface Payload<Request, Response> {
  readonly req: Request;
  readonly res: Response;
}

/**
 *
 * Defines a fully typed, synchronous api action derived from a thunk action. An api action contains both a type id and the associated payload of that type.
 * @type T is a string representing the type id of the api action.
 * @type Request is an immutable object representing the api request
 * @type Response is an immutable object representing the api response
 */
export interface Action<T extends string, Request, Response> extends AnyAction {
  readonly type: T;
  readonly payload: Payload<Request, Response>;
}
/**
 * @description Creates a synchronous api action.
 *
 * @type Request is the request type
 * @type Response is the response type
 *
 * @param type is a key representing the type id of an api action.
 * @param req is an api request.
 * @param res is an api response.
 */
export function createAction<T extends string, Request, Response>(
  type: T,
  req: Request,
  res: Response
): Action<T, Request, Response> {
  return {
    type,
    payload: {
      req,
      res
    }
  };
}
/**
 * A typed wrapper that contains the api functor which represents a synchronous or asynchronous api action.
 * This is comprised of a mapping between request args and response args.
 *
 * @type Request is an api request type
 * @type Response is an api response type
 * @param args Request arguments.
 * @returns A promise to resolve on type Response. This will only occur if the api call is successful.
 */
type APIAction<Request, Response> = (args: Request) => Promise<Response>;
/**
 *
 * This factory method can be used to configure and produce asynchronous api calls that use the thunk middleware.
 * redux-thunk is a side effects library.
 *
 * @param actions The triplet of type id's which map to the 3 states of an asynchronous api call.
 * The api executor will dispatch at the start of an asynchronous action,
 * on the successful resolution of an async action and on the rejection of an async action.
 * @param apiCall The typed asynchronous api call.
 *
 *
 * API Async Action States
 * @type StartType is the type id indicating that the api call has been started and is still running.
 * @type SuccessType is the type id indicating that the api call has resolved successfully.
 * @type FailType is the type id indicating that the api call has failed.
 *
 *
 */
export function createAsyncAction<
  Start extends string,
  Success extends string,
  Fail extends string,
  State,
  Request,
  Response
>(actions: [Start, Success, Fail], apiCall: APIAction<Request, Response>) {
  return (
    apiArgs: Request
  ): ThunkAction<
    Promise<Action<Success, Request | undefined, Response> | void>,
    State,
    undefined,
    | Action<Start, Request | undefined, {}>
    | Action<Success, Request | undefined, Response>
    | Action<Fail, Request | undefined, any>
  > => dispatch => {
    const [start, success, fail] = actions;
    dispatch(createAction(start, apiArgs, {}));
    return Promise.resolve(apiCall(apiArgs))
      .then(response => {
        const action = createAction(success, apiArgs, response);
        dispatch(action);
        return action;
      })
      .catch(err => {
        const action = createAction(fail, apiArgs, err);
        Promise.reject(dispatch(action));
      });
  };
}
/**
 * An enumeration of type T mapped over a set of keys.
 */
type Enumerate<T> = T[keyof T];

/**
 * Type wrapper for a collection of asynchronous and synchronous api processes.
 */
export type InferActionTypes<T> = Enumerate<
  {
    [K in keyof T]: T[K] extends (
      args: any
    ) => ThunkAction<any, any, any, infer A>
      ? A
      : T[K] extends (args: any) => Action<any, any, any> // for normal createAction
      ? ReturnType<T[K]>
      : never;
  }
>;
/**
 * A typed helper to retrieve the api state.
 */
export type GetReducerState<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => infer Q ? Q : never;
};
/**
 *
 */
export type GetPropsFromDispatch<T> = {
  [P in keyof T]: T[P] extends (
    args?: infer U
  ) => ThunkAction<infer Q, any, any, any>
    ? (args?: U) => Q
    : T[P] extends (args: infer S) => infer R
    ? (args?: S) => R
    : never;
};

export const STARTED = "STARTED";
export const LOADING = "LOADING";
export const SUCCESS = "SUCCESS";
export const ERROR = "ERROR";
export type AsyncStatusTypes = "STARTED" | "LOADING" | "SUCCESS" | "ERROR";
