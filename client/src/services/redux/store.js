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
import defectivePurchases from "./slices/stockman/defectivePurchases";
import StockmanDashboard from "./slices/stockman/StockmanDashboard";
import materials from "./slices/administrator/productManagement/materials";
import suspendedTransacs from "./slices/cashier/suspendedTransacs";
import adminDashboard from "./slices/administrator/adminDashboard";
import notifications from "./slices/notifications";
import quotations from "./slices/quotations";
import expiredProductsReport from "./slices/administrator/report/expiredProductsReport";
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
    materials,
    purchases,
    stocks,
    pos,
    salesReport,
    transactionsReport,
    category,
    returnRefund,
    expiredProducts,
    defectivePurchases,
    suspendedTransacs,
    adminDashboard,
    StockmanDashboard,
    notifications,
    expiredProductsReport,
    quotations,
  },
});

export default store;
