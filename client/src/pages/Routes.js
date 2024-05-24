import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "./notFound";

import ACCESS from "./platforms/access.js";

//global
import Profile from "../components/profile";
import ViewProfile from "../components/profile/view.jsx";
import { useSelector } from "react-redux";

export default function Routes() {
  const { role } = useSelector(({ auth }) => auth);

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

      <Route component={NotFound} />
    </Switch>
  );
}
