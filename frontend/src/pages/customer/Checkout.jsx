import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();

  const cart = JSON.parse(
    localStorage.getItem("artisanHubCart") || "[]"
  );

  const currentUser = JSON.parse(
    localStorage.getItem("artisanHubCurrentUser") || "null"
  );

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const [error, setError] = useState("");

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const delivery = cart.length > 0 ? 50 : 0;

  const total = subtotal + delivery;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handlePlaceOrder = (e) => {
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
      setError("Please fill in all delivery details.");
      return;
    }

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Phone validation
    // Allows exactly 10 digits
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(formData.phone)) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    // Pincode validation
    // Indian pincode = exactly 6 digits
    const pincodeRegex = /^\d{6}$/;

    if (!pincodeRegex.test(formData.pincode)) {
      setError(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const existingOrders = JSON.parse(
      localStorage.getItem("artisanHubOrders") || "[]"
    );

    const newOrder = {
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

      items: cart,

      subtotal,

      delivery,

      total,

      paymentMethod: formData.paymentMethod,

      status: "Order Placed",

      createdAt: new Date().toISOString(),
    };

    existingOrders.push(newOrder);

    localStorage.setItem(
      "artisanHubOrders",
      JSON.stringify(existingOrders)
    );

    localStorage.removeItem("artisanHubCart");

    navigate("/order-success", {
      state: {
        order: newOrder,
      },
    });
  };

  if (cart.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <h1>Your Cart is Empty</h1>

          <p>
            Add some products before proceeding to checkout.
          </p>

          <button
            onClick={() => navigate("/products")}
          >
            Explore Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-header">
        <p>ARTISANHUB CHECKOUT</p>

        <h1>Checkout</h1>
      </div>

      <section className="checkout-container">
        <form
          className="checkout-form"
          onSubmit={handlePlaceOrder}
        >
          <h2>Delivery Information</h2>

          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}

          <div className="checkout-row">
            <div>
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <label>Phone Number</label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit phone number"
            maxLength="10"
          />

          <label>Address</label>

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="House no., street, area"
            rows="4"
          ></textarea>

          <div className="checkout-row">
            <div>
              <label>City</label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai"
              />
            </div>

            <div>
              <label>State</label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Maharashtra"
              />
            </div>
          </div>

          <label>Pincode</label>

          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="6-digit pincode"
            maxLength="6"
          />

          <h2 className="payment-heading">
            Payment Method
          </h2>

          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={
                  formData.paymentMethod === "cod"
                }
                onChange={handleChange}
              />

              <div>
                <strong>Cash on Delivery</strong>

                <span>
                  Pay when your order arrives.
                </span>
              </div>
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={
                  formData.paymentMethod === "online"
                }
                onChange={handleChange}
              />

              <div>
                <strong>Online Payment</strong>

                <span>
                  Payment gateway will be integrated later.
                </span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="place-order-button"
          >
            Place Order • ₹{total}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-items">
            {cart.map((item) => (
              <div
                className="checkout-item"
                key={item.id}
              >
                <div>
                  <strong>{item.name}</strong>

                  <span>
                    Qty: {item.quantity}
                  </span>
                </div>

                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <hr />

          <div>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div>
            <span>Delivery</span>
            <span>₹{delivery}</span>
          </div>

          <hr />

          <div className="checkout-total">
            <strong>Total</strong>
            <strong>₹{total}</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Checkout;