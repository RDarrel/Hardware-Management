import React, { useEffect } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Platforms from "./pages/platforms";
import Home from "./pages/home";
import { useDispatch, useSelector } from "react-redux";
import { VALIDATEREFRESH } from "./services/redux/slices/auth";
import POS from "./pages/platforms/cashier/pos";
import Checkout from "./pages/widgets/checkout";
import PrintOut from "./components/printOut";
import Quotation from "./pages/platforms/customer/pos";
import LoginPage from "./pages/home/loginPage";

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
      <Route path="/pos" exact component={POS} />
      <Route path="/login" exact component={LoginPage} />
      <Route path="/quotation" exact component={Quotation} />
      <Route path="/printOut" exact component={PrintOut} />
      <Route path="/pos/checkout" exact component={Checkout} />
      <Platforms />
    </Switch>
  );
}
