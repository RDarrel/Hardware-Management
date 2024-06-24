import Dashboard from "./dashboard";
import EmployeesReport from "./report/employees";
import Employees from "./employees";
import Products from "./productMangement/products";
import Sales from "./report/sales";
import { Transactions } from "./report/transactions";
import Suppliers from "./suppliers";
import Request from "../../widgets/purchases/request";
import Completed from "../../widgets/purchases/completed";
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
    icon: "shopping-basket",
    children: [
      {
        name: "Request",
        path: "/request",
        component: Request,
      },
      {
        name: "Completed",
        path: "/rooms",
        component: Completed,
      },
    ],
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
