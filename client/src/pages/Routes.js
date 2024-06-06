import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useHistory } from "react-router";
import NotFound from "./notFound";

import ACCESS from "./platforms/access.js";

//global
import Profile from "../components/profile";
import ViewProfile from "../components/profile/view.jsx";
import { useSelector } from "react-redux";
import Checkout from "./platforms/stockman/checkout/index.jsx";

export default function Routes() {
  const { role } = useSelector(({ auth }) => auth),
    history = useHistory();

  useEffect(() => {
    if (role === "CASHIER") {
      history.push("/pos");
    }
  }, [role, history]);

  const handleRoutes = () => {
    const routes = ACCESS[role] || [];

    return routes.map(({ path, component, children }, index) => {
      if (children)
        return children.map((child, cIndex) => (
          <Route
            key={`route-${index}-${cIndex}`}
            exact
            path={`${path}${child.path}`}
            component={child.component || NotFound}
          />
        ));

      return (
        <Route key={`route-${index}`} exact path={path} component={component} />
      );
    });
  };

  return (
    <Switch>
      {handleRoutes()}
      <Route path="/profile" exact component={ViewProfile} />
      <Route path="/profile/update" exact component={Profile} />
      <Route path="/checkout" exact component={Checkout} />

      <Route component={NotFound} />
    </Switch>
  );
}
