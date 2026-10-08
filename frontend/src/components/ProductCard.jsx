function ProductCard({ product }) {
  return (
    <div className="product-card">

      <div className="product-image">
        Product Image
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="product-artisan">
          by {product.artisan}
        </p>

        <p className="product-price">
          ₹{product.price}
        </p>
      </div>

    </div>
  );
}

export default ProductCard;