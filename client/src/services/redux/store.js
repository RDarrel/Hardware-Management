import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import users from "./slices/users";
import roles from "./slices/roles";
import projects from "./slices/projects";
import tasks from "./slices/tasks";
import events from "./slices/events";
import employees from "./slices/administrator/employees";
const store = configureStore({
  reducer: {
    auth,
    users,
    roles,
    projects,
    tasks,
    events,
    employees,
  },
});

export default store;
