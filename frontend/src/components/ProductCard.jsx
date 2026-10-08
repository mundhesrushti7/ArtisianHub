import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="product-card-image">
        {product.category}
      </div>

      <div className="product-card-content">
        <p className="product-card-category">
          {product.category}
        </p>

        <h3>{product.name}</h3>

        <p className="product-card-artisan">
          {product.artisan}
        </p>

        <div className="product-card-bottom">
          <span>₹{product.price}</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;