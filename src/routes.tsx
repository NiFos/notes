import React from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { Auth } from "./pages/auth-page";
import { Home } from "./pages/home-page";
import { RootState } from "./redux/store";

interface Props {}

export function Routes(props: Props) {
  const state = useSelector((state: RootState) => state.auth);
  return (
    <Switch>
      <Route path="/">{state.isLoggedIn ? <Home /> : <Auth />}</Route>
    </Switch>
  );
}
