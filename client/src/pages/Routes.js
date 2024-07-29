import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "./notFound";

import ACCESS from "./platforms/access.js";

//global
import Profile from "../components/profile";
// import ViewProfile from "../components/profile/view.jsx";
import { useSelector } from "react-redux";
import Checkout from "./platforms/stockman/checkout/index.jsx";

export default function Routes() {
  const { role } = useSelector(({ auth }) => auth);

  const handleRoutes = () => {
    const routes = ACCESS[role] || [];

    return routes.map(
      ({ path, component: Component, children, props }, index) => {
        if (children)
          return children.map((child, cIndex) => (
            <Route
              key={`route-${index}-${cIndex}`}
              exact
              path={`${path}${child.path}`}
              render={(routeProps) =>
                child.component ? (
                  <child.component {...routeProps} {...child.props} />
                ) : (
                  <NotFound />
                )
              }
              // render={() =>
              //   child.component ? (
              //     <child.component props={child?.props} />
              //   ) : (
              //     <NotFound />
              //   )
              // }
            />
          ));

        return (
          <Route
            key={`route-${index}`}
            exact
            path={path}
            render={(routeProps) =>
              Component ? (
                <Component {...routeProps} {...props} />
              ) : (
                <NotFound />
              )
            }
          />
        );
      }
    );
  };

  return (
    <Switch>
      {handleRoutes()}
      <Route path="/profile" exact component={Profile} />
      <Route path="/profile/update" exact component={Profile} />
      <Route path="/checkout" exact component={Checkout} />

      <Route component={NotFound} />
    </Switch>
  );
}
