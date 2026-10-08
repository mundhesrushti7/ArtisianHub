import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ArtisanDashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem(
        "artisanHubCurrentUser"
      ) || "null"
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

    loadDashboardData(user.id);
  }, [navigate]);

  const loadDashboardData = (artisanId) => {
    const storedProducts = JSON.parse(
      localStorage.getItem(
        "artisanHubProducts"
      ) || "[]"
    );

    const storedOrders = JSON.parse(
      localStorage.getItem(
        "artisanHubOrders"
      ) || "[]"
    );

    /*
     * Get only products created by
     * the currently logged-in artisan.
     */
    const artisanProducts =
      storedProducts.filter(
        (product) =>
          String(product.artisanId) ===
          String(artisanId)
      );

    /*
     * Get only orders containing
     * products belonging to this artisan.
     */
    const artisanOrders =
      storedOrders
        .map((order) => {
          const artisanItems =
            (order.items || []).filter(
              (item) =>
                String(item.artisanId) ===
                String(artisanId)
            );

          if (
            artisanItems.length === 0
          ) {
            return null;
          }

          /*
           * Calculate this artisan's
           * portion of the order.
           */
          const artisanSales =
            artisanItems.reduce(
              (sum, item) =>
                sum +
                Number(item.price || 0) *
                  Number(item.quantity || 0),
              0
            );

          return {
            ...order,
            artisanItems,
            artisanSales,
          };
        })
        .filter(Boolean)
        .reverse();

    setProducts(artisanProducts);
    setOrders(artisanOrders);
  };

  /*
   * Calculate total sales.
   *
   * Cancelled orders are not counted
   * as completed sales.
   */
  const totalSales = orders.reduce(
    (sum, order) => {
      if (order.status === "Cancelled") {
        return sum;
      }

      return (
        sum +
        Number(order.artisanSales || 0)
      );
    },
    0
  );

  const recentOrders =
    orders.slice(0, 5);

  const getStatusClass = (status) => {
    if (status === "Delivered") {
      return "artisan-status-delivered";
    }

    if (status === "Cancelled") {
      return "artisan-status-cancelled";
    }

    if (status === "Shipped") {
      return "artisan-status-shipped";
    }

    if (status === "Processing") {
      return "artisan-status-processing";
    }

    return "artisan-status-placed";
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="artisan-dashboard-page">

      {/* Header */}

      <div className="artisan-dashboard-header">

        <div>
          <p className="artisan-dashboard-label">
            Artisan / Seller
          </p>

          <h1>
            Welcome, {currentUser.name}!
          </h1>

          <p>
            Manage your products, orders and
            sales from your dashboard.
          </p>
        </div>

        <button
          className="artisan-add-product-btn"
          onClick={() =>
            navigate(
              "/artisan/products/add"
            )
          }
        >
          + Add Product
        </button>

      </div>

      {/* Statistics */}

      <div className="artisan-stats-grid">

        <div className="artisan-stat-card">

          <div className="artisan-stat-icon">
            📦
          </div>

          <div>
            <span>
              Total Products
            </span>

            <strong>
              {products.length}
            </strong>
          </div>

        </div>

        <div className="artisan-stat-card">

          <div className="artisan-stat-icon">
            🛒
          </div>

          <div>
            <span>
              Total Orders
            </span>

            <strong>
              {orders.length}
            </strong>
          </div>

        </div>

        <div className="artisan-stat-card">

          <div className="artisan-stat-icon">
            ₹
          </div>

          <div>
            <span>
              Total Sales
            </span>

            <strong>
              ₹
              {totalSales.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

        </div>

      </div>

      {/* Main Dashboard */}

      <div className="artisan-dashboard-content">

        {/* Recent Orders */}

        <div className="artisan-recent-orders">

          <div className="artisan-section-header">

            <div>
              <h2>
                Recent Orders
              </h2>

              <p>
                Your latest customer orders
              </p>
            </div>

            <button
              onClick={() =>
                navigate(
                  "/artisan/orders"
                )
              }
            >
              View All
            </button>

          </div>

          {recentOrders.length === 0 ? (
            <div className="artisan-dashboard-empty">

              <div>
                🛒
              </div>

              <h3>
                No orders yet
              </h3>

              <p>
                Orders containing your products
                will appear here.
              </p>

            </div>
          ) : (
            <div className="artisan-recent-order-list">

              {recentOrders.map(
                (order) => (
                  <div
                    className="artisan-recent-order"
                    key={order.id}
                  >

                    <div>
                      <strong>
                        {order.id}
                      </strong>

                      <span>
                        {order.customerName}
                      </span>
                    </div>

                    <div>
                      <span
                        className={`artisan-order-status ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      <strong>
                        ₹
                        {Number(
                          order.artisanSales ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* Quick Actions */}

        <div className="artisan-quick-actions">

          <div className="artisan-section-header">
            <div>
              <h2>
                Quick Actions
              </h2>

              <p>
                Manage your store
              </p>
            </div>
          </div>

          <button
            className="artisan-action-card"
            onClick={() =>
              navigate(
                "/artisan/products"
              )
            }
          >

            <div className="artisan-action-icon">
              📦
            </div>

            <div>
              <strong>
                Manage Products
              </strong>

              <span>
                Add, edit or remove products
              </span>
            </div>

          </button>

          <button
            className="artisan-action-card"
            onClick={() =>
              navigate(
                "/artisan/products/add"
              )
            }
          >

            <div className="artisan-action-icon">
              +
            </div>

            <div>
              <strong>
                Add Product
              </strong>

              <span>
                Add a new handmade product
              </span>
            </div>

          </button>

          <button
            className="artisan-action-card"
            onClick={() =>
              navigate(
                "/artisan/orders"
              )
            }
          >

            <div className="artisan-action-icon">
              🛒
            </div>

            <div>
              <strong>
                Manage Orders
              </strong>

              <span>
                View and update customer orders
              </span>
            </div>

          </button>

        </div>

      </div>

    </div>
  );
}

export default ArtisanDashboard;