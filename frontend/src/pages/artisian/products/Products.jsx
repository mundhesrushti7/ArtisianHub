import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ArtisanProducts() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] =
    useState(null);

  const [products, setProducts] =
    useState([]);

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

    loadProducts(user.id);
  }, [navigate]);

  const loadProducts = (artisanId) => {
    const allProducts = JSON.parse(
      localStorage.getItem(
        "artisanHubProducts"
      ) || "[]"
    );

    const artisanProducts =
      allProducts.filter(
        (product) =>
          String(product.artisanId) ===
          String(artisanId)
      );

    setProducts(artisanProducts);
  };

  const handleDelete = (productId) => {
    const product = products.find(
      (item) =>
        String(item.id) ===
        String(productId)
    );

    if (!product) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
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
        (item) =>
          String(item.id) !==
          String(productId)
      );

    localStorage.setItem(
      "artisanHubProducts",
      JSON.stringify(updatedProducts)
    );

    setProducts(
      updatedProducts.filter(
        (item) =>
          String(item.artisanId) ===
          String(currentUser.id)
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
          <p className="artisan-products-label">
            Artisan / Seller
          </p>

          <h1>
            My Products
          </h1>

          <p>
            Manage the handmade products
            available in your store.
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
            className="artisan-add-product-btn"
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

      {products.length === 0 ? (
        <div className="artisan-products-empty">

          <div className="artisan-empty-icon">
            📦
          </div>

          <h2>
            No Products Yet
          </h2>

          <p>
            Add your first handmade product
            to start selling on ArtisanHub.
          </p>

          <button
            className="artisan-add-product-btn"
            onClick={() =>
              navigate(
                "/artisan/products/add"
              )
            }
          >
            + Add Product
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
                  {product.description}
                </p>

                <div className="artisan-product-info">

                  <strong>
                    ₹
                    {Number(
                      product.price
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  <span
                    className={
                      Number(
                        product.stock
                      ) === 0
                        ? "artisan-stock-out"
                        : Number(
                            product.stock
                          ) <= 3
                        ? "artisan-stock-low"
                        : "artisan-stock-good"
                    }
                  >
                    Stock:{" "}
                    {product.stock}
                  </span>

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
                      handleDelete(
                        product.id
                      )
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

export default ArtisanProducts;