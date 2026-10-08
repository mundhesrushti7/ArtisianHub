import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("artisanHubCurrentUser") || "null"
  );

  const [formData, setFormData] = useState({
    name: "",
    category: "Pottery",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [imageName, setImageName] = useState("");

  if (!currentUser || currentUser.role !== "artisan") {
    navigate("/login");
    return null;
  }

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((previous) => ({
        ...previous,
        image: "Please select a valid image file.",
      }));
      return;
    }

    if (file.size > 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        image: "Image size must be less than 1 MB.",
      }));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((previous) => ({
        ...previous,
        image: reader.result,
      }));

      setImageName(file.name);

      setErrors((previous) => ({
        ...previous,
        image: "",
      }));
    };

    reader.readAsDataURL(file);
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
      newErrors.description = "Product description is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const existingProducts = JSON.parse(
      localStorage.getItem("artisanHubProducts") || "[]"
    );

    const newProduct = {
      id: `AP-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: formData.description.trim(),
      image: formData.image,

      artisanId: currentUser.id,
      artisanName: currentUser.name,

      createdAt: new Date().toISOString(),
    };

    const updatedProducts = [
      ...existingProducts,
      newProduct,
    ];

    localStorage.setItem(
      "artisanHubProducts",
      JSON.stringify(updatedProducts)
    );

    alert("Product added successfully!");

    navigate("/artisan/products");
  };

  return (
    <div className="artisan-add-product-page">

      <div className="artisan-add-product-header">

        <div>
          <p className="artisan-dashboard-label">
            Artisan / Seller
          </p>

          <h1>Add New Product</h1>

          <p>
            Add a handmade product to your ArtisanHub store.
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
              Provide the basic details about your handmade
              product.
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
              Upload a clear image of your handmade product.
            </p>

            <div className="artisan-form-group">

              <label htmlFor="image">
                Product Image
              </label>

              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              <small>
                Supported image files. Maximum size: 1 MB.
              </small>

              {imageName && (
                <p className="artisan-selected-image">
                  Selected: {imageName}
                </p>
              )}

              {errors.image && (
                <span className="artisan-form-error">
                  {errors.image}
                </span>
              )}

            </div>

            {formData.image && (
              <div className="artisan-image-preview">
                <img
                  src={formData.image}
                  alt="Product preview"
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
              Add Product
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddProduct;