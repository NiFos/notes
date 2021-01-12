import { ThunkAction } from "redux-thunk";
import { currentUser, loginUser, registerUser } from "../../lib/firebase";
import { RootState } from "../store";

export const authReducerTypes = {
  isLoggedIn: "auth/IS_LOGGED_IN",
  isLoggedInStatus: "auth/IS_LOGGED_IN_STATUS",
  setUser: "auth/SET_USER",
  authStatus: "auth/AUTH_STATUS",
};

export interface IAuthReducer {
  isLoggedIn: boolean;
  isLoggedInStatus: "none" | "loading" | "loaded" | "error";
  user: string;
  authStatus: "none" | "loading" | "loaded" | "error";
}

const initialState: IAuthReducer = {
  isLoggedIn: false,
  isLoggedInStatus: "none",
  user: "",
  authStatus: "none",
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

    case authReducerTypes.setUser: {
      return {
        ...state,
        user: payload as IAuthReducer["user"],
      };
    }

    case authReducerTypes.authStatus: {
      return {
        ...state,
        authStatus: payload as IAuthReducer["authStatus"],
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
    const response = currentUser();

    // TODO: Auth current user
    dispatch({
      type: authReducerTypes.isLoggedInStatus,
      payload: "loaded",
    });
    dispatch({
      type: authReducerTypes.isLoggedIn,
      payload: !!response,
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

interface AuthStatusAction {
  type: typeof authReducerTypes.authStatus;
  payload: IAuthReducer["authStatus"];
}

interface UserAuthAction {
  type: typeof authReducerTypes.setUser;
  payload: IAuthReducer["user"];
}
export const auth = (
  email: string,
  password: string,
  isReg: boolean
): ThunkAction<void, RootState, unknown, AuthAction> => async (dispatch) => {
  try {
    dispatch({
      type: authReducerTypes.authStatus,
      payload: "loading",
    });
    let user: string = "";
    if (isReg) {
      user = await registerUser(email, password);
    } else {
      user = await loginUser(email, password);
    }

    dispatch({
      type: authReducerTypes.authStatus,
      payload: "loaded",
    });
    dispatch({
      type: authReducerTypes.setUser,
      payload: user,
    });
    dispatch({
      type: authReducerTypes.isLoggedIn,
      payload: true,
    });
  } catch (error) {
    dispatch({
      type: authReducerTypes.authStatus,
      payload: "error",
    });
    dispatch({
      type: authReducerTypes.setUser,
      payload: "",
    });
  }
};

export type AuthAction =
  | IsLoggedInAction
  | IsLoggedInStatus
  | AuthStatusAction
  | UserAuthAction;
