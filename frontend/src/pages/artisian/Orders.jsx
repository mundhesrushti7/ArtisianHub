import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ArtisanOrders() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] =
    useState(null);

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

    loadOrders(user.id);
  }, [navigate]);

  const loadOrders = (artisanId) => {
    const storedOrders = JSON.parse(
      localStorage.getItem(
        "artisanHubOrders"
      ) || "[]"
    );

    const artisanOrders =
      storedOrders
        .map((order) => {
          /*
           * Keep only items belonging to
           * the currently logged-in artisan.
           */
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
           * Calculate only this artisan's
           * portion of the order.
           */
          const artisanSubtotal =
            artisanItems.reduce(
              (total, item) =>
                total +
                Number(item.price || 0) *
                  Number(item.quantity || 0),
              0
            );

          return {
            ...order,
            items: artisanItems,
            artisanTotal:
              artisanSubtotal,
          };
        })
        .filter(Boolean)
        .reverse();

    setOrders(artisanOrders);
  };

  const updateOrderStatus = (
    orderId,
    newStatus
  ) => {
    const storedOrders = JSON.parse(
      localStorage.getItem(
        "artisanHubOrders"
      ) || "[]"
    );

    const updatedOrders =
      storedOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            updatedAt:
              new Date().toISOString(),
          };
        }

        return order;
      });

    localStorage.setItem(
      "artisanHubOrders",
      JSON.stringify(updatedOrders)
    );

    loadOrders(currentUser.id);

    alert(
      "Order status updated successfully!"
    );
  };

  const getStatusClass = (
    status
  ) => {
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
    <div className="artisan-orders-page">

      <div className="artisan-orders-header">

        <div>
          <p className="artisan-dashboard-label">
            Artisan / Seller
          </p>

          <h1>
            Customer Orders
          </h1>

          <p>
            Orders containing your products
            are shown here.
          </p>
        </div>

        <button
          className="artisan-back-btn"
          onClick={() =>
            navigate(
              "/artisan/dashboard"
            )
          }
        >
          ← Dashboard
        </button>

      </div>

      {orders.length === 0 ? (
        <div className="artisan-orders-empty">

          <div className="artisan-orders-empty-icon">
            🛒
          </div>

          <h2>
            No Orders Yet
          </h2>

          <p>
            Orders containing your products
            will appear here.
          </p>

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
      ) : (
        <div className="artisan-orders-list">

          {orders.map((order) => (
            <div
              className="artisan-order-card"
              key={order.id}
            >

              {/* Order Header */}

              <div className="artisan-order-top">

                <div>

                  <p className="artisan-order-number">
                    {order.id}
                  </p>

                  <p className="artisan-order-date">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>

                </div>

                <span
                  className={`artisan-order-status ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

              </div>

              {/* Customer */}

              <div className="artisan-order-customer">

                <h3>
                  Customer
                </h3>

                <p>
                  <strong>
                    {order.customerName}
                  </strong>
                </p>

                <p>
                  {order.email}
                </p>

                {order.phone && (
                  <p>
                    {order.phone}
                  </p>
                )}

              </div>

              {/* Artisan Items */}

              <div className="artisan-order-items">

                <h3>
                  Your Products
                </h3>

                {order.items.map(
                  (item, index) => (
                    <div
                      className="artisan-order-item"
                      key={`${item.id}-${index}`}
                    >

                      <div>

                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {item.category}
                        </span>

                      </div>

                      <div className="artisan-order-item-price">

                        <span>
                          ×{" "}
                          {item.quantity}
                        </span>

                        <strong>
                          ₹
                          {(
                            Number(
                              item.price
                            ) *
                            Number(
                              item.quantity
                            )
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    </div>
                  )
                )}

              </div>

              {/* Bottom */}

              <div className="artisan-order-bottom">

                <div>

                  <span>
                    Your Sales
                  </span>

                  <strong>
                    ₹
                    {Number(
                      order.artisanTotal
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                <div className="artisan-order-actions">

                  <label
                    htmlFor={`status-${order.id}`}
                  >
                    Update Status
                  </label>

                  <select
                    id={`status-${order.id}`}
                    value={
                      order.status
                    }
                    onChange={(e) =>
                      updateOrderStatus(
                        order.id,
                        e.target.value
                      )
                    }
                  >

                    <option value="Order Placed">
                      Order Placed
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default ArtisanOrders;