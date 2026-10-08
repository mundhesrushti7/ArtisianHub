import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Pottery",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [productFound, setProductFound] = useState(true);

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

    const products = JSON.parse(
      localStorage.getItem("artisanHubProducts") || "[]"
    );

    const product = products.find(
      (item) =>
        item.id === id && item.artisanId === user.id
    );

    if (!product) {
      setProductFound(false);
      return;
    }

    setFormData({
      name: product.name || "",
      category: product.category || "Pottery",
      price: product.price ?? "",
      stock: product.stock ?? "",
      description: product.description || "",
      image: product.image || "",
    });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }

    if (!formData.price) {
      newErrors.price = "Price is required.";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (formData.stock === "") {
      newErrors.stock = "Stock quantity is required.";
    } else if (Number(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative.";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Product description is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const products = JSON.parse(
      localStorage.getItem("artisanHubProducts") || "[]"
    );

    const updatedProducts = products.map((product) => {
      if (
        product.id === id &&
        product.artisanId === currentUser.id
      ) {
        return {
          ...product,
          name: formData.name.trim(),
          category: formData.category,
          price: Number(formData.price),
          stock: Number(formData.stock),
          description: formData.description.trim(),
          image: formData.image.trim(),
          updatedAt: new Date().toISOString(),
        };
      }

      return product;
    });

    localStorage.setItem(
      "artisanHubProducts",
      JSON.stringify(updatedProducts)
    );

    alert("Product updated successfully!");

    navigate("/artisan/products");
  };

  if (!currentUser) {
    return null;
  }

  if (!productFound) {
    return (
      <div className="artisan-product-not-found">
        <div className="artisan-products-empty-icon">
          📦
        </div>

        <h2>Product Not Found</h2>

        <p>
          This product does not exist or does not belong to
          your store.
        </p>

        <button
          className="artisan-add-product-btn"
          onClick={() =>
            navigate("/artisan/products")
          }
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="artisan-add-product-page">
      <div className="artisan-add-product-header">
        <div>
          <p className="artisan-dashboard-label">
            Artisan / Seller
          </p>

          <h1>Edit Product</h1>

          <p>
            Update the details of your handmade product.
          </p>
        </div>

        <button
          className="artisan-back-btn"
          onClick={() =>
            navigate("/artisan/products")
          }
        >
          ← Back to Products
        </button>
      </div>

      <div className="artisan-add-product-container">
        <form
          className="artisan-product-form"
          onSubmit={handleSubmit}
        >
          <div className="artisan-form-section">
            <h2>Product Information</h2>

            <p>
              Update the information customers will see
              about your product.
            </p>

            <div className="artisan-form-group">
              <label htmlFor="name">
                Product Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Handmade Clay Pot"
                value={formData.name}
                onChange={handleChange}
              />

              {errors.name && (
                <span className="artisan-form-error">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="artisan-form-row">
              <div className="artisan-form-group">
                <label htmlFor="category">
                  Category
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

                {errors.category && (
                  <span className="artisan-form-error">
                    {errors.category}
                  </span>
                )}
              </div>

              <div className="artisan-form-group">
                <label htmlFor="price">
                  Price (₹)
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  placeholder="e.g. 599"
                  value={formData.price}
                  onChange={handleChange}
                />

                {errors.price && (
                  <span className="artisan-form-error">
                    {errors.price}
                  </span>
                )}
              </div>
            </div>

            <div className="artisan-form-group">
              <label htmlFor="stock">
                Available Stock
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                placeholder="e.g. 10"
                value={formData.stock}
                onChange={handleChange}
              />

              {errors.stock && (
                <span className="artisan-form-error">
                  {errors.stock}
                </span>
              )}
            </div>

            <div className="artisan-form-group">
              <label htmlFor="description">
                Product Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Describe your handmade product..."
                value={formData.description}
                onChange={handleChange}
              />

              {errors.description && (
                <span className="artisan-form-error">
                  {errors.description}
                </span>
              )}
            </div>
          </div>

          <div className="artisan-form-section">
            <h2>Product Image</h2>

            <p>
              Update the image URL for your product.
            </p>

            <div className="artisan-form-group">
              <label htmlFor="image">
                Image URL
              </label>

              <input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/product-image.jpg"
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            {formData.image && (
              <div className="artisan-image-preview">
                <img
                  src={formData.image}
                  alt="Product preview"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="artisan-form-actions">
            <button
              type="button"
              className="artisan-form-cancel"
              onClick={() =>
                navigate("/artisan/products")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="artisan-form-submit"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;