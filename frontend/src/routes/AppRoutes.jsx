import { Routes, Route } from "react-router-dom";

import Home from "../pages/customer/Home";
import Products from "../pages/customer/Products";
import ProductDetails from "../pages/customer/ProductDetails";
import Cart from "../pages/customer/Cart";
import Login from "../pages/customer/Login";
import Register from "../pages/customer/Register";
import Checkout from "../pages/customer/Checkout";
import OrderSuccess from "../pages/customer/OrderSuccess";
import Orders from "../pages/customer/Orders";

import ArtisanDashboard from "../pages/artisian/ArtisanDashboard";
import ArtisanProducts from "../pages/artisian/Products";
import AddProduct from "../pages/artisian/AddProduct";
import EditProduct from "../pages/artisian/EditProduct";


function AppRoutes() {
    return (
        <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<Orders />} />

            {/* Artisan / Seller Routes */}
            <Route
                path="/artisan/dashboard"
                element={<ArtisanDashboard />}
            />

            <Route
                path="/artisan/products"
                element={<ArtisanProducts />}
            />


            <Route
                path="/artisan/products/add"
                element={<AddProduct />}
            />

            <Route
                path="/artisan/products/edit/:id"
                element={<EditProduct />}
            />
        </Routes>
    );
}

export default AppRoutes;