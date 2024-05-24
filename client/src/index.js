import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import * as serviceWorker from "./serviceWorker";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ENDPOINT } from "./services/utilities";
import { Provider } from "react-redux";
import store from "./services/redux/store";
import axios from "axios";
import { ToastProvider } from "react-toast-notifications";
import App from "./App";
const customHistory = createBrowserHistory();

axios.defaults.baseURL = ENDPOINT;
axios.defaults.withCredentials = true;

ReactDOM.render(
  <Router history={customHistory}>
    <Provider store={store}>
      <ToastProvider placement="top-center" autoDismiss={5000}>
        <App />
      </ToastProvider>
    </Provider>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
