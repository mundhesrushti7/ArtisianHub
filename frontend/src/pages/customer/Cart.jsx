import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("artisanHubCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("artisanHubCart", JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (id, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + change,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const delivery = cart.length > 0 ? 50 : 0;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <h1>Your Cart is Empty</h1>

          <p>
            Looks like you haven't added any handmade products yet.
          </p>

          <button onClick={() => navigate("/products")}>
            Explore Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-header">
        <p>YOUR SHOPPING BAG</p>
        <h1>Your Cart</h1>
      </div>

      <section className="cart-container">
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-image">
                {item.category}
              </div>

              <div className="cart-item-details">
                <p>{item.category}</p>

                <h2>{item.name}</h2>

                <span>
                  Crafted by {item.artisan}
                </span>

                <strong>₹{item.price}</strong>
              </div>

              <div className="cart-item-actions">
                <div className="cart-quantity">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, -1)
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.id, 1)
                    }
                  >
                    +
                  </button>
                </div>

                <strong>
                  ₹{item.price * item.quantity}
                </strong>

                <button
                  className="remove-item"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div>
            <span>Delivery</span>
            <span>₹{delivery}</span>
          </div>

          <hr />

          <div className="cart-total">
            <strong>Total</strong>
            <strong>₹{total}</strong>
          </div>

          <button
            className="checkout-button"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>

          <button
            className="continue-shopping"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </aside>
      </section>
    </main>
  );
}

export default Cart;