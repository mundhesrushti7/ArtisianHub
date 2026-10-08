import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-tagline">HANDMADE • UNIQUE • LOCAL</p>

        <h1>
          Discover the beauty of
          <span> handmade creations.</span>
        </h1>

        <p className="hero-description">
          Explore unique products crafted with passion by talented
          local artisans.
        </p>

        <button
          className="hero-button"
          onClick={() => navigate("/products")}
        >
          Explore Products
        </button>
      </div>

      <div className="hero-image">
        <div className="hero-image-placeholder">
          Artisan
        </div>
      </div>
    </section>
  );
}

export default Hero;