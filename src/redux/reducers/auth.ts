import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";

export const authReducerTypes = {
  isLoggedIn: "auth/IS_LOGGED_IN",
  isLoggedInStatus: "auth/IS_LOGGED_IN_STATUS",
};

export interface IAuthReducer {
  isLoggedIn: boolean;
  isLoggedInStatus: "none" | "loading" | "loaded" | "error";
}

const initialState: IAuthReducer = {
  isLoggedIn: false,
  isLoggedInStatus: "none",
};

export const authReducer = (
  state = initialState,
  { type, payload }: AuthAction
): IAuthReducer => {
  switch (type) {
    case authReducerTypes.isLoggedIn: {
      return {
        ...state,
        isLoggedIn: payload as IAuthReducer["isLoggedIn"],
      };
    }

    case authReducerTypes.isLoggedInStatus: {
      return {
        ...state,
        isLoggedInStatus: payload as IAuthReducer["isLoggedInStatus"],
      };
    }

    default: {
      return state;
    }
  }
};

interface IsLoggedInStatus {
  type: typeof authReducerTypes.isLoggedInStatus;
  payload: IAuthReducer["isLoggedInStatus"];
}
interface IsLoggedInAction {
  type: typeof authReducerTypes.isLoggedIn;
  payload: IAuthReducer["isLoggedIn"];
}
export const isLoggedIn = (): ThunkAction<
  void,
  RootState,
  unknown,
  AuthAction
> => async (dispatch) => {
  try {
    // TODO: Auth
    dispatch({
      type: authReducerTypes.isLoggedInStatus,
      payload: "loaded",
    });
    dispatch({
      type: authReducerTypes.isLoggedIn,
      payload: false,
    });
  } catch (error) {
    dispatch({
      type: authReducerTypes.isLoggedInStatus,
      payload: "error",
    });
    dispatch({
      type: authReducerTypes.isLoggedIn,
      payload: false,
    });
  }
};

export type AuthAction = IsLoggedInAction | IsLoggedInStatus;
