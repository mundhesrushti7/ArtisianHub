import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "Pottery",
    price: "",
    stock: "",
    description: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem(
        "artisanHubCurrentUser"
      ) || "null"
    );

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "artisan") {
      navigate("/");
      return;
    }

    const products = JSON.parse(
      localStorage.getItem(
        "artisanHubProducts"
      ) || "[]"
    );

    const product = products.find(
      (item) =>
        String(item.id) === String(id)
    );

    if (!product) {
      setError("Product not found.");
      return;
    }

    /*
     * Make sure the artisan can edit
     * only their own product.
     */
    if (
      String(product.artisanId) !==
      String(currentUser.id)
    ) {
      setError(
        "You are not authorized to edit this product."
      );
      return;
    }

    setFormData({
      name: product.name || "",
      category:
        product.category || "Pottery",
      price: product.price || "",
      stock: product.stock ?? "",
      description:
        product.description || "",
    });
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name =
      formData.name.trim();

    const description =
      formData.description.trim();

    const price =
      Number(formData.price);

    const stock =
      Number(formData.stock);

    if (!name) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (!price || price <= 0) {
      setError(
        "Price must be greater than 0."
      );
      return;
    }

    if (
      formData.stock === "" ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      setError(
        "Stock must be a whole number 0 or greater."
      );
      return;
    }

    if (!description) {
      setError(
        "Product description is required."
      );
      return;
    }

    const products = JSON.parse(
      localStorage.getItem(
        "artisanHubProducts"
      ) || "[]"
    );

    const currentUser = JSON.parse(
      localStorage.getItem(
        "artisanHubCurrentUser"
      ) || "null"
    );

    const productIndex =
      products.findIndex(
        (item) =>
          String(item.id) ===
          String(id) &&
          String(item.artisanId) ===
            String(currentUser.id)
      );

    if (productIndex === -1) {
      setError(
        "Product could not be found."
      );
      return;
    }

    const updatedProduct = {
      ...products[productIndex],
      name,
      category: formData.category,
      price,
      stock,
      description,
      updatedAt:
        new Date().toISOString(),
    };

    const updatedProducts = [
      ...products,
    ];

    updatedProducts[productIndex] =
      updatedProduct;

    localStorage.setItem(
      "artisanHubProducts",
      JSON.stringify(
        updatedProducts
      )
    );

    alert(
      "Product updated successfully!"
    );

    navigate("/artisan/products");
  };

  if (error && !formData.name) {
    return (
      <div className="artisan-edit-error-page">
        <h2>{error}</h2>

        <button
          onClick={() =>
            navigate(
              "/artisan/products"
            )
          }
        >
          ← Back to My Products
        </button>
      </div>
    );
  }

  return (
    <div className="artisan-edit-product-page">

      <div className="artisan-edit-product-header">

        <div>
          <p>
            Artisan / Seller
          </p>

          <h1>
            Edit Product
          </h1>

          <span>
            Update the details of your
            handmade product.
          </span>
        </div>

        <button
          className="artisan-secondary-btn"
          onClick={() =>
            navigate(
              "/artisan/products"
            )
          }
        >
          ← My Products
        </button>

      </div>

      <form
        className="artisan-edit-product-form"
        onSubmit={handleSubmit}
      >

        {error && (
          <div className="artisan-form-error">
            {error}
          </div>
        )}

        <div className="artisan-form-field">

          <label htmlFor="name">
            Product Name *
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
          />

        </div>

        <div className="artisan-form-field">

          <label htmlFor="category">
            Category *
          </label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Pottery">
              Pottery
            </option>

            <option value="Jewelry">
              Jewelry
            </option>

            <option value="Paintings">
              Paintings
            </option>

            <option value="Textiles">
              Textiles
            </option>

            <option value="Woodwork">
              Woodwork
            </option>

            <option value="Handicrafts">
              Handicrafts
            </option>

            <option value="Other">
              Other
            </option>
          </select>

        </div>

        <div className="artisan-form-row">

          <div className="artisan-form-field">

            <label htmlFor="price">
              Price (₹) *
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="1"
              value={formData.price}
              onChange={handleChange}
              placeholder="899"
            />

          </div>

          <div className="artisan-form-field">

            <label htmlFor="stock">
              Stock *
            </label>

            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={formData.stock}
              onChange={handleChange}
              placeholder="10"
            />

          </div>

        </div>

        <div className="artisan-form-field">

          <label htmlFor="description">
            Description *
          </label>

          <textarea
            id="description"
            name="description"
            value={
              formData.description
            }
            onChange={handleChange}
            placeholder="Describe your handmade product..."
            rows="6"
          />

        </div>

        <div className="artisan-edit-product-actions">

          <button
            type="button"
            className="artisan-cancel-btn"
            onClick={() =>
              navigate(
                "/artisan/products"
              )
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="artisan-save-product-btn"
          >
            Save Changes
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditProduct;