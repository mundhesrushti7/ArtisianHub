import { Routes, Route } from "react-router-dom";

import Home from "../pages/customer/Home";
import Products from "../pages/customer/Products";
import ProductDetails from "../pages/customer/ProductDetails";

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
    </Routes>
  );
}

export default AppRoutes;