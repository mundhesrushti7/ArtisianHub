import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const products = [
    {
      id: 1,
      name: "Handmade Clay Pot",
      artisan: "Priya Arts",
      price: 599,
      category: "Pottery",
      description:
        "A beautifully handcrafted clay pot made by skilled local artisans. Each piece is unique and carries the traditional charm of Indian pottery.",
    },
    {
      id: 2,
      name: "Traditional Necklace",
      artisan: "Crafts by Riya",
      price: 899,
      category: "Jewelry",
      description:
        "A traditional handmade necklace carefully crafted using locally sourced materials and traditional artistic techniques.",
    },
    {
      id: 3,
      name: "Hand Painted Canvas",
      artisan: "Art by Meera",
      price: 1299,
      category: "Paintings",
      description:
        "An original hand-painted canvas created by a local artist. Perfect for adding an artistic and traditional touch to your home.",
    },
    {
      id: 4,
      name: "Handwoven Scarf",
      artisan: "Kala Crafts",
      price: 749,
      category: "Textiles",
      description:
        "A soft handwoven scarf created using traditional weaving techniques. Every piece reflects the craftsmanship of its artisan.",
    },
    {
      id: 5,
      name: "Terracotta Vase",
      artisan: "Mitti Studio",
      price: 799,
      category: "Pottery",
      description:
        "A traditional terracotta vase handcrafted by experienced artisans using natural clay.",
    },
    {
      id: 6,
      name: "Beaded Handmade Earrings",
      artisan: "Riya Handcrafts",
      price: 499,
      category: "Jewelry",
      description:
        "Beautiful handmade earrings featuring carefully arranged beads and traditional craftsmanship.",
    },
    {
      id: 7,
      name: "Village Landscape Painting",
      artisan: "Meera Creations",
      price: 1599,
      category: "Paintings",
      description:
        "A detailed handmade painting inspired by the beauty and simplicity of traditional Indian village life.",
    },
    {
      id: 8,
      name: "Traditional Cotton Dupatta",
      artisan: "Kala Weaves",
      price: 999,
      category: "Textiles",
      description:
        "A traditionally woven cotton dupatta made with care by skilled local textile artisans.",
    },
  ];

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <main className="product-details-page">
        <div className="product-not-found">
          <h1>Product Not Found</h1>
          <p>The product you are looking for does not exist.</p>

          <button onClick={() => navigate("/products")}>
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    const savedCart = localStorage.getItem("artisanHubCart");

    const cart = savedCart
      ? JSON.parse(savedCart)
      : [];

    const existingItem = cart.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity,
      });
    }

    localStorage.setItem(
      "artisanHubCart",
      JSON.stringify(cart)
    );

    alert(`${product.name} added to cart!`);

    navigate("/cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
  };

  return (
    <main className="product-details-page">
      <button
        className="back-button"
        onClick={() => navigate("/products")}
      >
        ← Back to Products
      </button>

      <section className="product-details-container">
        <div className="product-details-image">
          <div className="product-image-placeholder">
            {product.category}
          </div>
        </div>

        <div className="product-details-content">
          <p className="product-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <p className="product-artisan">
            Crafted by <strong>{product.artisan}</strong>
          </p>

          <h2>₹{product.price}</h2>

          <div className="product-divider"></div>

          <p className="product-description">
            {product.description}
          </p>

          <div className="quantity-section">
            <span>Quantity</span>

            <div className="quantity-controls">
              <button onClick={decreaseQuantity}>
                −
              </button>

              <span>{quantity}</span>

              <button onClick={increaseQuantity}>
                +
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button
              className="add-cart-button"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <button
              className="buy-now-button"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;