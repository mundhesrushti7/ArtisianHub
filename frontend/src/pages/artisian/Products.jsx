import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("artisanHubCurrentUser") || "null"
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

    const allProducts = JSON.parse(
      localStorage.getItem("artisanHubProducts") || "[]"
    );

    const artisanProducts = allProducts.filter(
      (product) => product.artisanId === user.id
    );

    setProducts(artisanProducts);
  }, [navigate]);

  const handleDelete = (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    const allProducts = JSON.parse(
      localStorage.getItem("artisanHubProducts") || "[]"
    );

    const updatedProducts = allProducts.filter(
      (product) => product.id !== productId
    );

    localStorage.setItem(
      "artisanHubProducts",
      JSON.stringify(updatedProducts)
    );

    setProducts(
      updatedProducts.filter(
        (product) => product.artisanId === currentUser.id
      )
    );
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="artisan-products-page">
      <div className="artisan-products-header">
        <div>
          <p className="artisan-dashboard-label">
            Artisan / Seller
          </p>

          <h1>My Products</h1>

          <p>
            Manage the handmade products you are selling on
            ArtisanHub.
          </p>
        </div>

        <div className="artisan-products-header-actions">
          <button
            className="artisan-back-btn"
            onClick={() => navigate("/artisan/dashboard")}
          >
            ← Dashboard
          </button>

          <button
            className="artisan-add-product-btn"
            onClick={() =>
              navigate("/artisan/products/add")
            }
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="artisan-products-summary">
        <strong>{products.length}</strong>
        <span>
          {products.length === 1
            ? " product"
            : " products"}{" "}
          listed
        </span>
      </div>

      {products.length === 0 ? (
        <div className="artisan-products-empty">
          <div className="artisan-products-empty-icon">
            📦
          </div>

          <h2>No products yet</h2>

          <p>
            You haven't added any products to your store yet.
          </p>

          <button
            className="artisan-add-product-btn"
            onClick={() =>
              navigate("/artisan/products/add")
            }
          >
            + Add Your First Product
          </button>
        </div>
      ) : (
        <div className="artisan-products-grid">
          {products.map((product) => (
            <div
              className="artisan-product-card"
              key={product.id}
            >
              <div className="artisan-product-image">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                ) : (
                  <span>{product.category}</span>
                )}
              </div>

              <div className="artisan-product-content">
                <span className="artisan-product-category">
                  {product.category}
                </span>

                <h2>{product.name}</h2>

                <p className="artisan-product-description">
                  {product.description ||
                    "No description available."}
                </p>

                <div className="artisan-product-info">
                  <div>
                    <span>Price</span>
                    <strong>₹{product.price}</strong>
                  </div>

                  <div>
                    <span>Stock</span>
                    <strong>{product.stock}</strong>
                  </div>
                </div>

                <div className="artisan-product-actions">
                  <button
                    className="artisan-edit-btn"
                    onClick={() =>
                      navigate(
                        `/artisan/products/edit/${product.id}`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="artisan-delete-btn"
                    onClick={() =>
                      handleDelete(product.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;