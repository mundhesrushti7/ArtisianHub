import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;

  if (!order) {
    return (
      <main className="order-success-page">
        <div className="order-success">
          <h1>Order Not Found</h1>

          <button
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="order-success-page">
      <div className="order-success">
        <div className="success-icon">
          ✓
        </div>

        <p className="success-label">
          ORDER CONFIRMED
        </p>

        <h1>Thank You for Your Order!</h1>

        <p className="success-message">
          Your order has been placed successfully.
          Our artisans will begin preparing your
          handmade products.
        </p>

        <div className="order-number">
          <span>Order Number</span>

          <strong>{order.id}</strong>
        </div>

        <div className="success-details">
          <div>
            <span>Total Amount</span>
            <strong>₹{order.total}</strong>
          </div>

          <div>
            <span>Payment</span>
            <strong>
              {order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{order.status}</strong>
          </div>
        </div>

        <div className="success-actions">
          <button
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>

          <button
            className="secondary-success-button"
            onClick={() => navigate("/orders")}
          >
            View My Orders
          </button>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;