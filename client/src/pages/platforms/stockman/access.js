// import Checkout from "./checkout";
import Dashboard from "./dashboard";
import Purchases from "./purchases";
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
    component: Purchases,
  },
];

export default access;
