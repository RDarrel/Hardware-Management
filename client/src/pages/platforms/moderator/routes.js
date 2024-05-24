import Dashboard from "./dashboard";
import Projects from "../administrator/work management/projects";
import Tasks from "../administrator/work management/tasks";

const routes = [
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/work-management",
    children: [
      {
        path: "/projects",
        component: Projects,
      },
      {
        path: "/tasks",
        component: Tasks,
      },
    ],
  },
];

export default routes;
