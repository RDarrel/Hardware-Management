import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import users from "./slices/users";
import roles from "./slices/roles";
import projects from "./slices/projects";
import tasks from "./slices/tasks";
import events from "./slices/events";
import employees from "./slices/administrator/employees";
import products from "./slices/administrator/productManagement/products";
import suppliers from "./slices/administrator/suppliers";
import cart from "./slices/cart";
import purchases from "./slices/stockman/purchases";
import stocks from "./slices/stockman/stocks";
import pos from "./slices/cashier/pos";
import category from "./slices/administrator/productManagement/category";
import salesReport from "./slices/administrator/report/salesReport";
import transactionsReport from "./slices/administrator/report/transactionsReport";
import returnRefund from "./slices/administrator/returnRefund";
import expiredProducts from "./slices/stockman/expiredProducts";
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
    purchases,
    stocks,
    pos,
    salesReport,
    transactionsReport,
    category,
    returnRefund,
    expiredProducts,
  },
});

export default store;
