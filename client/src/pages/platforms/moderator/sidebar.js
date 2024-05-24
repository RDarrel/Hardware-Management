import Projects from "../administrator/work management/projects";
import Tasks from "../administrator/work management/tasks";
import Dashboard from "./dashboard";

const sidebar = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "tachometer-alt",
    component: Dashboard,
  },
  {
    name: "Work Management",
    icon: "city",
    path: "/work-management",
    children: [
      {
        name: "Projects",
        path: "/projects",
        component: Projects,
      },
      {
        name: "Tasks",
        path: "/tasks",
        component: Tasks,
      },
    ],
  },
  {
    name: "Trainings",
    icon: "user-graduate",
    path: "/trainings",
    children: [
      {
        name: "Courses",
        path: "/courses",
      },
      {
        name: "Lessons",
        path: "/lessons",
      },
      {
        name: "Activities",
        path: "/activities",
      },
    ],
  },
  {
    name: "Financials",
    icon: "credit-card",
    path: "/financials",
    children: [
      {
        name: "Deployments",
        path: "/deployments",
      },
      {
        name: "Utilities",
        path: "/utilities",
      },
      {
        name: "Expenses",
        path: "/expenses",
      },
      {
        name: "Savings",
        path: "/savings",
      },
    ],
  },
];

export default sidebar;
