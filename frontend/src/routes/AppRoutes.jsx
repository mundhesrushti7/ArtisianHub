import { Routes, Route } from "react-router-dom";

import Home from "../pages/customer/Home";
import Products from "../pages/customer/Products";
import ProductDetails from "../pages/customer/ProductDetails";
import Cart from "../pages/customer/Cart";
import Login from "../pages/customer/Login";
import Register from "../pages/customer/Register";
import Checkout from "../pages/customer/Checkout";
import OrderSuccess from "../pages/customer/OrderSuccess";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/products"
        element={<Products />}
      />

      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/order-success"
        element={<OrderSuccess />}
      />
    </Routes>
  );
}

export default AppRoutes;