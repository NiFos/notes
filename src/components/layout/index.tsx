/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { isLoggedIn } from "../../redux/reducers/auth";
import { RootState } from "../../redux/store";

interface Props {
  children: any;
}

export function Layout(props: Props) {
  const state = useSelector((state: RootState) => state.auth.isLoggedInStatus);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(isLoggedIn());
  }, []);

  return (
    <BrowserRouter>
      {state === "loaded" ? (
        props.children
      ) : state === "loading" ? (
        <div>Loading...</div>
      ) : state === "error" ? (
        <div>Something went wrong</div>
      ) : (
        <React.Fragment></React.Fragment>
      )}
    </BrowserRouter>
  );
}
