import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const defaultProducts = [
  {
    id: "1",
    name: "Handmade Clay Pot",
    artisan: "Priya Arts",
    price: 599,
    category: "Pottery",
    description:
      "Beautiful handmade clay pot crafted using traditional pottery techniques.",
  },
  {
    id: "2",
    name: "Traditional Necklace",
    artisan: "Crafts by Riya",
    price: 899,
    category: "Jewelry",
    description:
      "Traditional handmade necklace designed with beautiful handcrafted details.",
  },
  {
    id: "3",
    name: "Hand Painted Canvas",
    artisan: "Art by Meera",
    price: 1299,
    category: "Paintings",
    description:
      "A hand-painted canvas created by a skilled local artist.",
  },
  {
    id: "4",
    name: "Handwoven Scarf",
    artisan: "Kala Crafts",
    price: 749,
    category: "Textiles",
    description:
      "Soft handwoven scarf made using traditional weaving techniques.",
  },
  {
    id: "5",
    name: "Terracotta Vase",
    artisan: "Mitti Studio",
    price: 799,
    category: "Pottery",
    description:
      "Elegant terracotta vase handcrafted by traditional artisans.",
  },
  {
    id: "6",
    name: "Beaded Handmade Earrings",
    artisan: "Riya Handcrafts",
    price: 499,
    category: "Jewelry",
    description:
      "Beautiful handmade earrings decorated with colorful beads.",
  },
  {
    id: "7",
    name: "Village Landscape Painting",
    artisan: "Meera Creations",
    price: 1599,
    category: "Paintings",
    description:
      "A beautiful handmade painting inspired by Indian village landscapes.",
  },
  {
    id: "8",
    name: "Traditional Cotton Dupatta",
    artisan: "Kala Weaves",
    price: 999,
    category: "Textiles",
    description:
      "Traditional cotton dupatta made using handwoven fabric.",
  },
];

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => {
    const artisanProducts = JSON.parse(
      localStorage.getItem("artisanHubProducts") || "[]"
    );

    const allProducts = [
      ...defaultProducts,
      ...artisanProducts,
    ];

    return allProducts.find(
      (item) => String(item.id) === String(id)
    );
  }, [id]);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>

        <p>
          The product you are looking for does not exist.
        </p>

        <button onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  const total = product.price * quantity;

  const handleAddToCart = () => {
    const cart = JSON.parse(
      localStorage.getItem("artisanHubCart") || "[]"
    );

    const existingItem = cart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + quantity,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          quantity,
        },
      ];
    }

    localStorage.setItem(
      "artisanHubCart",
      JSON.stringify(updatedCart)
    );

    alert("Product added to cart!");

    navigate("/cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
  };

  return (
    <div className="product-details-page">
      <button
        className="product-details-back"
        onClick={() => navigate("/products")}
      >
        ← Back to Products
      </button>

      <div className="product-details-container">
        <div className="product-details-image">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
            />
          ) : (
            <span>{product.category}</span>
          )}
        </div>

        <div className="product-details-content">
          <p className="product-details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <p className="product-details-artisan">
            Handmade by{" "}
            <strong>
              {product.artisanName || product.artisan}
            </strong>
          </p>

          <h2 className="product-details-price">
            ₹{product.price}
          </h2>

          <p className="product-details-description">
            {product.description ||
              "A beautiful handmade product created by a talented artisan."}
          </p>

          {product.stock !== undefined && (
            <p className="product-details-stock">
              {product.stock > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </p>
          )}

          <div className="product-details-quantity">
            <span>Quantity</span>

            <div>
              <button
                onClick={() =>
                  setQuantity(
                    Math.max(1, quantity - 1)
                  )
                }
              >
                −
              </button>

              <strong>{quantity}</strong>

              <button
                onClick={() =>
                  setQuantity(
                    product.stock
                      ? Math.min(
                          product.stock,
                          quantity + 1
                        )
                      : quantity + 1
                  )
                }
                disabled={
                  product.stock !== undefined &&
                  product.stock <= quantity
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="product-details-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          <div className="product-details-actions">
            <button
              className="product-details-cart-btn"
              onClick={handleAddToCart}
              disabled={
                product.stock !== undefined &&
                product.stock <= 0
              }
            >
              Add to Cart
            </button>

            <button
              className="product-details-buy-btn"
              onClick={handleBuyNow}
              disabled={
                product.stock !== undefined &&
                product.stock <= 0
              }
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;