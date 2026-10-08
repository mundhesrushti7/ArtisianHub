import { Link } from "react-router-dom";

function Navbar() {
  const cart = JSON.parse(
    localStorage.getItem("artisanHubCart") || "[]"
  );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav>
      <h2>ArtisanHub</h2>

      <div>
        <Link to="/">Home</Link>

        <Link to="/products">
          Products
        </Link>

        <Link to="/cart">
          Cart
          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}
        </Link>

        <Link to="/login">
          Login
        </Link>

        <Link to="/register">
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;