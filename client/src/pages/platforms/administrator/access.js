import Dashboard from "./dashboard";
import EmployeesReport from "./report/employees";
import Employees from "./employees";
import Products from "./productMangement/products";
import Sales from "./report/sales";
import { Transactions } from "./report/transactions";
import Suppliers from "./suppliers";
import Request from "../../widgets/purchases/request";
// import ReturnRefund from "./returnRefund";
import PurchasesDefective from "../../widgets/purchases/purchasesDefective";
import Categories from "./productMangement/category";
import Materials from "./productMangement/materials";
import { Stocks } from "../stockman/stocks";
import ExpiredProducts from "./report/expiredProducts";
import Store from "../stockman/store";
import Audit from "./audit";
// import Category from "./productMangement/category";

const access = [
  {
    path: "/dashboard",
    component: Dashboard,
    name: "Dashboard",
    icon: "tachometer-alt",
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
    name: "Employees",
    path: "/employees",
    icon: "users",
    component: Employees,
  },

  {
    path: "/products",
    name: "Products Management",
    icon: "award",
    // component: Products,

    children: [
      {
        name: "Products",
        path: "/products",
        component: Products,
      },
      {
        name: "Category",
        path: "/category",
        component: Categories,
      },
      {
        name: "Materials",
        path: "/material",
        component: Materials,
      },
    ],
  },

  {
    name: "Supplier",
    path: "/suppliers",
    icon: "hands-helping",
    component: Suppliers,
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
        props: { isAdmin: true },
      },
      {
        path: "Defective",
        name: "Defective",
        component: PurchasesDefective,
        props: { isAdmin: true },
      },
      {
        path: "Discrepancy",
        name: "Discrepancy",
        component: PurchasesDefective,
        props: { isAdmin: true, isDefective: false },
      },
    ],
  },

  // {
  //   name: "Replacement/Refund",
  //   path: "/ReturnRefund",
  //   icon: "exchange-alt",
  //   component: ReturnRefund,
  // },

  {
    path: "/report",
    name: "Report",
    icon: "scroll",
    children: [
      {
        name: "Sales",
        path: "/Sales",
        component: Sales,
      },
      {
        name: "Transactions",
        path: "/Transaction",
        component: Transactions,
      },
      {
        name: "Expired Products",
        path: "/expiredProducts",
        component: ExpiredProducts,
      },
      {
        name: "Employees",
        path: "/Employee",
        component: EmployeesReport,
      },
    ],
  },

  {
    name: "Audit Trails",
    path: "/audit",
    icon: "map",
    component: Audit,
  },
];

export default access;
