import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const demoProducts = [
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
      "A traditional handmade necklace designed with beautiful handcrafted details.",
  },
  {
    id: "3",
    name: "Hand Painted Canvas",
    artisan: "Art by Meera",
    price: 1299,
    category: "Paintings",
    description:
      "A unique hand-painted canvas created by a talented local artist.",
  },
  {
    id: "4",
    name: "Handwoven Scarf",
    artisan: "Kala Crafts",
    price: 749,
    category: "Textiles",
    description:
      "Soft and elegant handwoven scarf made using traditional weaving techniques.",
  },
  {
    id: "5",
    name: "Terracotta Vase",
    artisan: "Mitti Studio",
    price: 799,
    category: "Pottery",
    description:
      "Traditional terracotta vase handcrafted by skilled artisans.",
  },
  {
    id: "6",
    name: "Beaded Handmade Earrings",
    artisan: "Riya Handcrafts",
    price: 499,
    category: "Jewelry",
    description:
      "Beautiful handmade earrings featuring colourful handcrafted beads.",
  },
  {
    id: "7",
    name: "Village Landscape Painting",
    artisan: "Meera Creations",
    price: 1599,
    category: "Paintings",
    description:
      "A detailed handmade painting inspired by the beauty of rural India.",
  },
  {
    id: "8",
    name: "Traditional Cotton Dupatta",
    artisan: "Kala Weaves",
    price: 999,
    category: "Textiles",
    description:
      "Traditional cotton dupatta with beautiful handcrafted patterns.",
  },
];

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    const artisanProducts = JSON.parse(
      localStorage.getItem("artisanHubProducts") || "[]"
    );

    const allProducts = [
      ...demoProducts,
      ...artisanProducts,
    ];

    const foundProduct = allProducts.find(
      (item) => String(item.id) === String(id)
    );

    if (!foundProduct) {
      setProduct(null);
      return;
    }

    setProduct(foundProduct);

    /*
     * Artisan products have actual stock.
     * Demo products don't, so we give them
     * a large display stock for the prototype.
     */
    setStock(
      Number(foundProduct.stock ?? 20)
    );
  }, [id]);

  const increaseQuantity = () => {
    if (quantity >= stock) {
      return;
    }

    setQuantity((previous) => previous + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((previous) =>
      Math.max(1, previous - 1)
    );
  };

  const updateProductStock = (
    productId,
    quantityToRemove
  ) => {
    const artisanProducts = JSON.parse(
      localStorage.getItem("artisanHubProducts") || "[]"
    );

    const updatedProducts =
      artisanProducts.map((item) => {
        if (
          String(item.id) ===
          String(productId)
        ) {
          return {
            ...item,
            stock:
              Number(item.stock || 0) -
              quantityToRemove,
          };
        }

        return item;
      });

    localStorage.setItem(
      "artisanHubProducts",
      JSON.stringify(updatedProducts)
    );
  };

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    if (stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    if (quantity > stock) {
      alert(
        `Only ${stock} item${
          stock === 1 ? "" : "s"
        } available.`
      );
      return;
    }

    const cart = JSON.parse(
      localStorage.getItem("artisanHubCart") || "[]"
    );

    const existingItemIndex =
      cart.findIndex(
        (item) => item.id === product.id
      );

    const existingQuantity =
      existingItemIndex >= 0
        ? Number(
            cart[existingItemIndex].quantity || 0
          )
        : 0;

    /*
     * Important:
     * Don't allow the cart to contain
     * more items than available stock.
     */
    if (
      existingQuantity + quantity >
      stock
    ) {
      alert(
        `Only ${stock} item${
          stock === 1 ? "" : "s"
        } available.`
      );
      return;
    }

    if (existingItemIndex >= 0) {
      cart[existingItemIndex] = {
        ...cart[existingItemIndex],
        quantity:
          existingQuantity + quantity,
      };
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

    /*
     * Decrease actual artisan product stock.
     *
     * This is done only for products created
     * by an artisan.
     */
    if (product.artisanId) {
      updateProductStock(
        product.id,
        quantity
      );
    }

    setStock((previous) =>
      Math.max(0, previous - quantity)
    );

    setQuantity(1);

    alert("Product added to cart!");

    navigate("/cart");
  };

  const handleBuyNow = () => {
    if (!product) {
      return;
    }

    if (stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    /*
     * Same stock logic as Add to Cart.
     */
    const cart = JSON.parse(
      localStorage.getItem("artisanHubCart") || "[]"
    );

    const existingItemIndex =
      cart.findIndex(
        (item) => item.id === product.id
      );

    const existingQuantity =
      existingItemIndex >= 0
        ? Number(
            cart[existingItemIndex].quantity || 0
          )
        : 0;

    if (
      existingQuantity + quantity >
      stock
    ) {
      alert(
        `Only ${stock} item${
          stock === 1 ? "" : "s"
        } available.`
      );
      return;
    }

    if (existingItemIndex >= 0) {
      cart[existingItemIndex] = {
        ...cart[existingItemIndex],
        quantity:
          existingQuantity + quantity,
      };
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

    if (product.artisanId) {
      updateProductStock(
        product.id,
        quantity
      );
    }

    navigate("/checkout");
  };

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>

        <button
          onClick={() => navigate("/products")}
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  const total =
    Number(product.price) * quantity;

  return (
    <div className="product-details-page">

      <button
        className="product-details-back"
        onClick={() => navigate("/products")}
      >
        ← Back to Products
      </button>

      <div className="product-details-card">

        {/* Product Image */}

        <div className="product-details-image">
          <span>
            {product.category}
          </span>
        </div>

        {/* Product Information */}

        <div className="product-details-info">

          <p className="product-details-category">
            {product.category}
          </p>

          <h1>
            {product.name}
          </h1>

          <p className="product-details-artisan">
            Handmade by{" "}
            <strong>
              {product.artisan}
            </strong>
          </p>

          <div className="product-details-price">
            ₹
            {Number(
              product.price
            ).toLocaleString("en-IN")}
          </div>

          <p className="product-details-description">
            {product.description}
          </p>

          <div
            className={`product-stock ${
              stock === 0
                ? "out-of-stock"
                : stock <= 3
                ? "low-stock"
                : ""
            }`}
          >
            {stock === 0
              ? "Out of stock"
              : `${stock} available`}
          </div>

          {stock > 0 && (
            <>
              <div className="product-quantity-section">

                <span>
                  Quantity
                </span>

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= 1
                    }
                  >
                    −
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      quantity >= stock
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              <div className="product-details-total">
                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div className="product-details-actions">

                <button
                  className="product-add-cart-btn"
                  onClick={
                    handleAddToCart
                  }
                >
                  Add to Cart
                </button>

                <button
                  className="product-buy-now-btn"
                  onClick={
                    handleBuyNow
                  }
                >
                  Buy Now
                </button>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;