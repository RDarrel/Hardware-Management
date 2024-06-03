import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import users from "./slices/users";
import roles from "./slices/roles";
import projects from "./slices/projects";
import tasks from "./slices/tasks";
import events from "./slices/events";
import employees from "./slices/administrator/employees";
import products from "./slices/administrator/products";
import suppliers from "./slices/administrator/suppliers";
import cart from "./slices/cart";
const store = configureStore({
  reducer: {
    auth,
    users,
    roles,
    projects,
    tasks,
    events,
    employees,
    products,
    suppliers,
    cart,
  },
});

export default store;
