import { useNavigate } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("artisanHubCurrentUser") || "null"
  );

  const allOrders = JSON.parse(
    localStorage.getItem("artisanHubOrders") || "[]"
  );

  const orders = currentUser
    ? allOrders.filter(
        (order) =>
          order.userId === currentUser.id ||
          order.email === currentUser.email
      )
    : allOrders;

  const getStatusClass = (status) => {
    if (status === "Delivered") {
      return "status-delivered";
    }

    if (status === "Cancelled") {
      return "status-cancelled";
    }

    return "status-active";
  };

  return (
    <main className="orders-page">
      <div className="orders-header">
        <p>YOUR ARTISANHUB JOURNEY</p>

        <h1>My Orders</h1>

        <span>
          Track and view your handmade product orders.
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <h2>No Orders Yet</h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <button
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <section className="orders-container">
          {orders
            .slice()
            .reverse()
            .map((order) => (
              <div
                className="order-card"
                key={order.id}
              >
                <div className="order-card-header">
                  <div>
                    <span>ORDER NUMBER</span>

                    <strong>{order.id}</strong>
                  </div>

                  <div>
                    <span>ORDER DATE</span>

                    <strong>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-IN")}
                    </strong>
                  </div>

                  <div>
                    <span>STATUS</span>

                    <strong
                      className={getStatusClass(
                        order.status
                      )}
                    >
                      {order.status}
                    </strong>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div
                      className="order-item"
                      key={item.id}
                    >
                      <div className="order-item-image">
                        {item.category}
                      </div>

                      <div className="order-item-info">
                        <h3>{item.name}</h3>

                        <p>
                          Crafted by {item.artisan}
                        </p>

                        <span>
                          Quantity: {item.quantity}
                        </span>
                      </div>

                      <strong>
                        ₹{item.price * item.quantity}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div>
                    <span>Payment</span>

                    <strong>
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </strong>
                  </div>

                  <div>
                    <span>Total</span>

                    <strong>
                      ₹{order.total}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
        </section>
      )}
    </main>
  );
}

export default Orders;