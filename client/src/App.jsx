import React, { useEffect } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Platforms from "./pages/platforms";
import Home from "./pages/home";
import { useDispatch, useSelector } from "react-redux";
import { VALIDATEREFRESH } from "./services/redux/slices/auth";

export default function App() {
  const { auth, token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    if (!auth._id && token) {
      dispatch(VALIDATEREFRESH(token));
    }
  }, [auth, token, dispatch]);

  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Platforms />
    </Switch>
  );
}
