import { applyMiddleware, compose, createStore } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { AuthAction } from "./reducers/auth";
import { rootReducer } from "./reducers/root";

export type RootState = ReturnType<typeof rootReducer>;
export type RootActions = AuthAction;

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers =
  process.env.NODE_ENV === "production"
    ? compose
    : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk as ThunkMiddleware<RootState, RootActions>)
  )
);
