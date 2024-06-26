// import Checkout from "./checkout";
import Request from "../../widgets/purchases/request";
import Dashboard from "./dashboard";

import { Stocks } from "./stocks";
import Store from "./store";

const access = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tachometer-alt",
    component: Dashboard,
  },

  {
    path: "/stocks",
    name: "Stocks",
    icon: "warehouse",
    component: Stocks,
  },

  {
    path: "/store",
    name: "Store",
    icon: "store-alt",
    component: Store,
  },

  {
    path: "/purchases",
    name: "Purchases",
    icon: "shopping-basket",
    component: Request,
    props: { isAdmin: false },
  },
];

export default access;
