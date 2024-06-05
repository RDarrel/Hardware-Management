// import Checkout from "./checkout";
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

  // {
  //   path: "/checkout",
  //   name: "checkout",
  //   icon: "store-alt",
  //   component: Checkout,
  // },
];

export default access;
