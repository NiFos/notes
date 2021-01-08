import { combineReducers } from "redux";
import { authReducer } from "./auth";
import { notesReducer } from "./notes";

export const rootReducer = combineReducers({
  auth: authReducer,
  notes: notesReducer,
});
