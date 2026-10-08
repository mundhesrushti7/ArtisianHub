import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] =
    useState(null);

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

    loadProducts(user);
  }, [navigate]);

  const loadProducts = (user) => {
    const allProducts = JSON.parse(
      localStorage.getItem(
        "artisanHubProducts"
      ) || "[]"
    );

    const artisanProducts =
      allProducts.filter(
        (product) =>
          String(product.artisanId) ===
          String(user.id)
      );

    setProducts(artisanProducts);
  };

  const handleDelete = (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    const allProducts = JSON.parse(
      localStorage.getItem(
        "artisanHubProducts"
      ) || "[]"
    );

    const updatedProducts =
      allProducts.filter(
        (product) =>
          !(
            String(product.id) ===
              String(productId) &&
            String(product.artisanId) ===
              String(currentUser?.id)
          )
      );

    localStorage.setItem(
      "artisanHubProducts",
      JSON.stringify(updatedProducts)
    );

    const artisanProducts =
      updatedProducts.filter(
        (product) =>
          String(product.artisanId) ===
          String(currentUser?.id)
      );

    setProducts(artisanProducts);
  };

  return (
    <div className="artisan-products-page">

      <div className="artisan-products-header">

        <div>
          <p className="artisan-section-label">
            Artisan / Seller
          </p>

          <h1>My Products</h1>

          <p className="artisan-products-subtitle">
            Manage the handmade products you
            are selling on ArtisanHub.
          </p>
        </div>

        <div className="artisan-products-header-actions">

          <button
            className="artisan-secondary-btn"
            onClick={() =>
              navigate(
                "/artisan/dashboard"
              )
            }
          >
            ← Dashboard
          </button>

          <button
            className="artisan-primary-btn"
            onClick={() =>
              navigate(
                "/artisan/products/add"
              )
            }
          >
            + Add Product
          </button>

        </div>

      </div>

      <div className="artisan-products-count">
        {products.length}{" "}
        {products.length === 1
          ? "product"
          : "products"}{" "}
        listed
      </div>

      {products.length === 0 ? (
        <div className="artisan-empty-products">

          <div className="artisan-empty-icon">
            📦
          </div>

          <h2>No Products Yet</h2>

          <p>
            You haven't added any products
            to your store yet.
          </p>

          <button
            className="artisan-primary-btn"
            onClick={() =>
              navigate(
                "/artisan/products/add"
              )
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
                <span>
                  {product.category}
                </span>
              </div>

              <div className="artisan-product-content">

                <p className="artisan-product-category">
                  {product.category}
                </p>

                <h2>
                  {product.name}
                </h2>

                <p className="artisan-product-description">
                  {product.description ||
                    "Handmade product created by our artisan."}
                </p>

                <div className="artisan-product-info">

                  <div>
                    <span>Price</span>
                    <strong>
                      ₹{product.price}
                    </strong>
                  </div>

                  <div>
                    <span>Stock</span>
                    <strong>
                      {product.stock}
                    </strong>
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