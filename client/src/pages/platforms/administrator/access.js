import Dashboard from "./dashboard";
import EmployeesReport from "./report/employees";
import Employees from "./employees";
import Products from "./productMangement/products";
import Sales from "./report/sales";
import { Transactions } from "./report/transactions";
import Suppliers from "./suppliers";
import Request from "../../widgets/purchases/request";
import ReturnRefund from "./returnRefund";
// import Category from "./productMangement/category";

const access = [
  {
    path: "/dashboard",
    component: Dashboard,
    name: "Dashboard",
    icon: "tachometer-alt",
  },
  {
    name: "Employees",
    path: "/employees",
    icon: "users",
    component: Employees,
  },

  {
    path: "/products",
    name: "Products",
    icon: "award",
    component: Products,

    // children: [
    //   {
    //     name: "Products",
    //     path: "/products",
    //     component: Products,
    //   },
    //   {
    //     name: "Category",
    //     path: "/category",
    //     component: Category,
    //   },
    //   {
    //     name: "Materials",
    //     path: "/material",
    //   },
    // ],
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
    component: Request,
    props: { isAdmin: true },
  },

  {
    name: "Return/Refund",
    path: "/ReturnRefund",
    icon: "exchange-alt",
    component: ReturnRefund,
  },

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
        name: "Employees",
        path: "/Employee",
        component: EmployeesReport,
      },
    ],
  },
];

export default access;
