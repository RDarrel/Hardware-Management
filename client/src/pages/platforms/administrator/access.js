import Dashboard from "./dashboard";
import Employees from "./employees";
import Products from "./products";
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
  // {
  //   path: "/user-settings",
  //   name: "User Settings",
  //   icon: "user-cog",
  //   children: [
  //     {
  //       name: "Roles",
  //       path: "/roles",
  //       component: Roles,
  //     },
  //     {
  //       name: "Users",
  //       path: "/users",
  //       component: Users,
  //     },
  //   ],
  // },
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
