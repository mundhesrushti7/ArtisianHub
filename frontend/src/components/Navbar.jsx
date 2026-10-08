import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const cart = JSON.parse(
    localStorage.getItem("artisanHubCart") || "[]"
  );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const currentUser = JSON.parse(
    localStorage.getItem("artisanHubCurrentUser") || "null"
  );

  const isArtisan =
    currentUser?.role === "artisan";

  const handleLogout = () => {
    localStorage.removeItem(
      "artisanHubCurrentUser"
    );

    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link
        to="/"
        className="navbar-brand"
      >
        ArtisanHub
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        <Link to="/products">
          Products
        </Link>

        {isArtisan ? (
          <>
            <Link to="/artisan/dashboard">
              Dashboard
            </Link>

            <Link to="/artisan/products">
              My Products
            </Link>

            <Link to="/artisan/orders">
              Orders
            </Link>
          </>
        ) : (
          <>
            <Link to="/cart">
              Cart

              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </Link>

            {currentUser && (
              <Link to="/orders">
                My Orders
              </Link>
            )}
          </>
        )}

        {currentUser ? (
          <>
            <span className="navbar-user">
              Hi, {currentUser.name}
            </span>

            <button
              className="navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;