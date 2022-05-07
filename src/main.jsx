import React from "react";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./components/App";
import AdminLogin from "./components/admin/AdminLogin";
import Admin from "./components/admin/Admin";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="/admin-login" element={<AdminLogin />}></Route>
      <Route path="/admin" element={<Admin />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
