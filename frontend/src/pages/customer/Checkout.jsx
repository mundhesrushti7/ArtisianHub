import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(
      localStorage.getItem("artisanHubCart") || "[]"
    );

    const user = JSON.parse(
      localStorage.getItem("artisanHubCurrentUser") || "null"
    );

    if (storedCart.length === 0) {
      navigate("/cart");
      return;
    }

    setCart(storedCart);
    setCurrentUser(user);

    setFormData((previous) => ({
      ...previous,
      name: user?.name || "",
      email: user?.email || "",
    }));
  }, [navigate]);

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const delivery = 50;

  const total = subtotal + delivery;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(formData.phone)) {
      setError(
        "Phone number must contain exactly 10 digits."
      );
      return;
    }

    const pincodeRegex = /^\d{6}$/;

    if (!pincodeRegex.test(formData.pincode)) {
      setError(
        "Pincode must contain exactly 6 digits."
      );
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    /*
     * Collect all artisans whose products
     * are present in this order.
     */
    const artisanIds = [
      ...new Set(
        cart
          .map((item) => item.artisanId)
          .filter(Boolean)
      ),
    ];

    /*
     * Create the order.
     */
    const order = {
      id: `AH-${Date.now()}`,

      userId: currentUser?.id || null,

      customerName: formData.name.trim(),

      email: formData.email.trim(),

      phone: formData.phone,

      address: {
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode,
      },

      /*
       * Products purchased in this order.
       */
      items: cart,

      /*
       * IDs of artisans involved in the order.
       */
      artisanIds,

      subtotal,

      delivery,

      total,

      paymentMethod:
        formData.paymentMethod,

      status: "Order Placed",

      createdAt: new Date().toISOString(),
    };

    /*
     * Get existing orders.
     */
    const existingOrders = JSON.parse(
      localStorage.getItem("artisanHubOrders") ||
        "[]"
    );

    /*
     * Add new order.
     */
    const updatedOrders = [
      ...existingOrders,
      order,
    ];

    localStorage.setItem(
      "artisanHubOrders",
      JSON.stringify(updatedOrders)
    );

    /*
     * Empty cart after successful order.
     */
    localStorage.removeItem("artisanHubCart");

    /*
     * Go to order success page.
     */
    navigate("/order-success", {
      state: {
        order,
      },
    });
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>

        <p>
          Complete your details to place your order.
        </p>
      </div>

      <div className="checkout-container">
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >
          <div className="checkout-section">
            <h2>Contact Information</h2>

            <div className="checkout-form-grid">
              <div className="checkout-field">
                <label>
                  Full Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="checkout-field">
                <label>
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="checkout-field">
                <label>
                  Phone *
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  maxLength="10"
                />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2>Delivery Address</h2>

            <div className="checkout-form-grid">
              <div className="checkout-field checkout-full">
                <label>
                  Address *
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House number, street, area"
                  rows="3"
                />
              </div>

              <div className="checkout-field">
                <label>
                  City *
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>

              <div className="checkout-field">
                <label>
                  State *
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>

              <div className="checkout-field">
                <label>
                  Pincode *
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  maxLength="6"
                />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2>Payment Method</h2>

            <div className="checkout-payment-options">
              <label className="checkout-payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={
                    formData.paymentMethod ===
                    "cod"
                  }
                  onChange={handleChange}
                />

                <div>
                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order arrives.
                  </span>
                </div>
              </label>

              <label className="checkout-payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={
                    formData.paymentMethod ===
                    "online"
                  }
                  onChange={handleChange}
                />

                <div>
                  <strong>
                    Online Payment
                  </strong>

                  <span>
                    Payment gateway integration
                    can be added later.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="checkout-place-order-btn"
          >
            Place Order
          </button>
        </form>

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-summary-items">
            {cart.map((item) => (
              <div
                className="checkout-summary-item"
                key={item.id}
              >
                <div>
                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    × {item.quantity}
                  </span>
                </div>

                <strong>
                  ₹
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-summary-line">
            <span>Subtotal</span>

            <strong>
              ₹{subtotal.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="checkout-summary-line">
            <span>Delivery</span>

            <strong>
              ₹{delivery}
            </strong>
          </div>

          <div className="checkout-summary-total">
            <span>Total</span>

            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;