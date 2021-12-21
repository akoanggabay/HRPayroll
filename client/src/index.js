// =========================================================
// * Volt React Dashboard
// =========================================================

// * Product Page: https://themesberg.com/product/dashboard/volt-react
// * Copyright 2021 Themesberg (https://www.themesberg.com)
// * Official Repository: https://github.com/themesberg/volt-react-dashboard
// * License: MIT License (https://themesberg.com/licensing)

// * Designed and coded by https://themesberg.com

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. Please contact us to request a removal.

// vendor styles
import "@fortawesome/fontawesome-free/css/all.css";
import React from 'react';
import "react-datetime/css/react-datetime.css";
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import store from './redux/store';
// core styles
import "./scss/volt.scss";




ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <ScrollToTop />
      <HomePage />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
