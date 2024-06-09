import Dashboard from "./dashboard";
import Employees from "./employees";
import Products from "./products";
import Purchases from "./purchases";
import Suppliers from "./suppliers";

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
    name: "Products",
    path: "/products",
    icon: "award",
    component: Products,
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
      },
      {
        name: "Transaction",
        path: "/Transaction",
      },
      {
        name: "Employee",
        path: "/Employee",
      },
    ],
  },
  // {
  //   path: "/work-management",
  //   name: "Work Management",
  //   icon: "city",
  //   children: [
  //     {
  //       name: "Projects",
  //       path: "/projects",
  //       component: Projects,
  //     },
  //     {
  //       name: "Tasks",

  //       path: "/tasks",
  //       component: Tasks,
  //     },
  //     {
  //       name: "Events",

  //       path: "/events",
  //       component: Events,
  //     },
  //     {
  //       name: "Tickets",

  //       path: "/tickets",
  //       component: Events,
  //     },
  //   ],
  // },
];

export default access;
