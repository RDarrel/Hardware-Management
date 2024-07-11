// import Checkout from "./checkout";
import PurchasesDefective from "../../widgets/purchases/purchasesDefective";
import Request from "../../widgets/purchases/request";
import Dashboard from "./dashboard";
import ExpiredProducts from "./expiredProducts";

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
    path: "/expiredProducts",
    name: "Expired Products",
    icon: "exclamation-circle",
    component: ExpiredProducts,
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
    icon: "clipboard-list",
    children: [
      {
        path: "Request",
        name: "Request",
        component: Request,
        props: { isAdmin: false },
      },
      {
        path: "Defective",
        name: "Defective",
        component: PurchasesDefective,
        props: { isAdmin: false },
      },

      {
        path: "Discrepancy",
        name: "Discrepancy",
        component: PurchasesDefective,
        props: { isAdmin: false, isDefective: false },
      },
    ],
  },
];

export default access;
