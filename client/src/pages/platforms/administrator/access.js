import Dashboard from "./dashboard";
import EmployeesReport from "./report/employees";
import Employees from "./employees";
import Products from "./productMangement/products";
import Purchases from "./purchases";
import Sales from "./report/sales";
import { Transactions } from "./report/transactions";
import Suppliers from "./suppliers";
import Category from "./productMangement/category";

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
    path: "/product",
    name: "Product Mangement",
    icon: "award",
    children: [
      {
        name: "Products",
        path: "/products",
        component: Products,
      },
      {
        name: "Category",
        path: "/category",
        component: Category,
      },
      {
        name: "Materials",
        path: "/material",
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
    name: "Purchases",
    path: "/Purchases",
    icon: "shopping-basket",
    component: Purchases,
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
