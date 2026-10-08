import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ArtisanDashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    sales: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("artisanHubCurrentUser") || "null"
    );

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "artisan") {
      navigate("/");
      return;
    }

    setCurrentUser(user);

    const products = JSON.parse(
      localStorage.getItem("artisanHubProducts") || "[]"
    );

    const orders = JSON.parse(
      localStorage.getItem("artisanHubOrders") || "[]"
    );

    const artisanProducts = products.filter(
      (product) => product.artisanId === user.id
    );

    const artisanOrders = orders;

    const totalSales = artisanOrders.reduce(
      (total, order) => total + Number(order.total || 0),
      0
    );

    setStats({
      products: artisanProducts.length,
      orders: artisanOrders.length,
      sales: totalSales,
    });

    setRecentOrders(
      artisanOrders
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        )
        .slice(0, 5)
    );
  }, [navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="artisan-dashboard">
      <div className="artisan-dashboard-header">
        <div>
          <p className="artisan-dashboard-label">
            Artisan / Seller
          </p>

          <h1>Welcome, {currentUser.name}!</h1>

          <p>
            Manage your products, orders and sales from your
            dashboard.
          </p>
        </div>

        <button
          className="artisan-add-product-btn"
          onClick={() => navigate("/artisan/products/add")}
        >
          + Add Product
        </button>
      </div>

      <div className="artisan-stats-grid">
        <div className="artisan-stat-card">
          <div className="artisan-stat-icon">📦</div>
          <div>
            <p>Total Products</p>
            <h2>{stats.products}</h2>
          </div>
        </div>

        <div className="artisan-stat-card">
          <div className="artisan-stat-icon">🛒</div>
          <div>
            <p>Total Orders</p>
            <h2>{stats.orders}</h2>
          </div>
        </div>

        <div className="artisan-stat-card">
          <div className="artisan-stat-icon">₹</div>
          <div>
            <p>Total Sales</p>
            <h2>₹{stats.sales}</h2>
          </div>
        </div>
      </div>

      <div className="artisan-dashboard-content">
        <div className="artisan-dashboard-card">
          <div className="artisan-card-header">
            <div>
              <h2>Recent Orders</h2>
              <p>Your latest customer orders</p>
            </div>

            <button
              onClick={() => navigate("/artisan/orders")}
            >
              View All
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="artisan-empty-state">
              <div>🛍️</div>
              <h3>No orders yet</h3>
              <p>
                Your recent customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="artisan-orders-list">
              {recentOrders.map((order) => (
                <div
                  className="artisan-order-row"
                  key={order.id}
                >
                  <div>
                    <h3>{order.id}</h3>
                    <p>
                      {order.customerName || "Customer"}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`artisan-order-status ${String(
                        order.status || "Order Placed"
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {order.status || "Order Placed"}
                    </span>
                  </div>

                  <div className="artisan-order-total">
                    ₹{order.total}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="artisan-dashboard-card">
          <div className="artisan-card-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Manage your store</p>
            </div>
          </div>

          <div className="artisan-quick-actions">
            <button
              onClick={() =>
                navigate("/artisan/products")
              }
            >
              <span>📦</span>
              <div>
                <strong>Manage Products</strong>
                <small>
                  Add, edit or remove products
                </small>
              </div>
            </button>

            <button
              onClick={() =>
                navigate("/artisan/products/add")
              }
            >
              <span>➕</span>
              <div>
                <strong>Add Product</strong>
                <small>
                  Add a new handmade product
                </small>
              </div>
            </button>

            <button
              onClick={() => navigate("/artisan/orders")}
            >
              <span>🛒</span>
              <div>
                <strong>Manage Orders</strong>
                <small>
                  View and update customer orders
                </small>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtisanDashboard;