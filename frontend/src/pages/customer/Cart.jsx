import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(
      localStorage.getItem("artisanHubCart") || "[]"
    );

    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "artisanHubCart",
      JSON.stringify(cart)
    );
  }, [cart]);

  /*
   * Restore stock for an artisan product.
   */
  const restoreStock = (
    productId,
    quantity
  ) => {
    const artisanProducts = JSON.parse(
      localStorage.getItem(
        "artisanHubProducts"
      ) || "[]"
    );

    const updatedProducts =
      artisanProducts.map((product) => {
        if (
          String(product.id) ===
          String(productId)
        ) {
          return {
            ...product,
            stock:
              Number(product.stock || 0) +
              Number(quantity || 0),
          };
        }

        return product;
      });

    localStorage.setItem(
      "artisanHubProducts",
      JSON.stringify(updatedProducts)
    );
  };

  /*
   * Change quantity in cart.
   *
   * Increasing quantity decreases stock.
   * Decreasing quantity restores stock.
   */
  const updateQuantity = (
    productId,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }

    const currentItem = cart.find(
      (item) =>
        String(item.id) ===
        String(productId)
    );

    if (!currentItem) {
      return;
    }

    const oldQuantity =
      Number(currentItem.quantity);

    const difference =
      newQuantity - oldQuantity;

    /*
     * Increasing quantity.
     */
    if (difference > 0) {
      const artisanProducts = JSON.parse(
        localStorage.getItem(
          "artisanHubProducts"
        ) || "[]"
      );

      const artisanProduct =
        artisanProducts.find(
          (product) =>
            String(product.id) ===
            String(productId)
        );

      /*
       * Demo products don't have stock
       * managed through artisanHubProducts.
       */
      if (artisanProduct) {
        const availableStock =
          Number(
            artisanProduct.stock || 0
          );

        if (
          difference >
          availableStock
        ) {
          alert(
            `Only ${availableStock} more item${
              availableStock === 1
                ? ""
                : "s"
            } available.`
          );

          return;
        }

        const updatedProducts =
          artisanProducts.map(
            (product) => {
              if (
                String(product.id) ===
                String(productId)
              ) {
                return {
                  ...product,
                  stock:
                    Number(
                      product.stock || 0
                    ) - difference,
                };
              }

              return product;
            }
          );

        localStorage.setItem(
          "artisanHubProducts",
          JSON.stringify(
            updatedProducts
          )
        );
      }
    }

    /*
     * Decreasing quantity restores stock.
     */
    if (difference < 0) {
      restoreStock(
        productId,
        Math.abs(difference)
      );
    }

    const updatedCart = cart.map(
      (item) => {
        if (
          String(item.id) ===
          String(productId)
        ) {
          return {
            ...item,
            quantity: newQuantity,
          };
        }

        return item;
      }
    );

    setCart(updatedCart);
  };

  /*
   * Remove product completely.
   */
  const removeItem = (productId) => {
    const item = cart.find(
      (cartItem) =>
        String(cartItem.id) ===
        String(productId)
    );

    if (!item) {
      return;
    }

    /*
     * Restore all reserved stock.
     */
    restoreStock(
      productId,
      item.quantity
    );

    const updatedCart =
      cart.filter(
        (cartItem) =>
          String(cartItem.id) !==
          String(productId)
      );

    setCart(updatedCart);
  };

  /*
   * Empty the complete cart.
   */
  const clearCart = () => {
    cart.forEach((item) => {
      restoreStock(
        item.id,
        item.quantity
      );
    });

    setCart([]);
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const delivery =
    cart.length > 0 ? 50 : 0;

  const total =
    subtotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">

          <div className="cart-empty-icon">
            🛒
          </div>

          <h1>
            Your Cart is Empty
          </h1>

          <p>
            Looks like you haven't added
            anything yet.
          </p>

          <button
            className="cart-continue-btn"
            onClick={() =>
              navigate("/products")
            }
          >
            Continue Shopping
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-header">
        <div>
          <h1>
            Shopping Cart
          </h1>

          <p>
            Review your handmade products
            before checkout.
          </p>
        </div>

        <button
          className="cart-continue-shopping"
          onClick={() =>
            navigate("/products")
          }
        >
          ← Continue Shopping
        </button>
      </div>

      <div className="cart-layout">

        {/* Cart Items */}

        <div className="cart-items">

          {cart.map((item) => (
            <div
              className="cart-item"
              key={item.id}
            >

              <div className="cart-item-image">
                {item.category}
              </div>

              <div className="cart-item-details">

                <p className="cart-item-category">
                  {item.category}
                </p>

                <h2>
                  {item.name}
                </h2>

                <p className="cart-item-artisan">
                  {item.artisan}
                </p>

                <strong className="cart-item-price">
                  ₹
                  {Number(
                    item.price
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

              <div className="cart-item-actions">

                <div className="cart-quantity">

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity - 1
                      )
                    }
                    disabled={
                      item.quantity <= 1
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>

                </div>

                <strong>
                  ₹
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

                <button
                  type="button"
                  className="cart-remove-btn"
                  onClick={() =>
                    removeItem(item.id)
                  }
                >
                  Remove
                </button>

              </div>

            </div>
          ))}

          <button
            type="button"
            className="cart-clear-btn"
            onClick={clearCart}
          >
            Clear Cart
          </button>

        </div>

        {/* Summary */}

        <div className="cart-summary">

          <h2>
            Order Summary
          </h2>

          <div className="cart-summary-line">
            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="cart-summary-line">
            <span>
              Delivery
            </span>

            <strong>
              ₹{delivery}
            </strong>
          </div>

          <div className="cart-summary-total">
            <span>
              Total
            </span>

            <strong>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <button
            className="cart-checkout-btn"
            onClick={() =>
              navigate("/checkout")
            }
          >
            Proceed to Checkout
          </button>

        </div>

      </div>
    </div>
  );
}

export default Cart;