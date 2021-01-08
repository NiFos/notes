import React from "react";
import { Route, Switch } from "react-router-dom";
import { Home } from "./pages/home-page";

interface Props {}

export function Routes(props: Props) {
  return (
    <Switch>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
}
