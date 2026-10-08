import Hero from "../../components/Hero";
import CategoryCard from "../../components/CategoryCard";
import ProductCard from "../../components/ProductCard";

function Home() {

  const categories = [
    { name: "Pottery", icon: "🏺" },
    { name: "Jewelry", icon: "💍" },
    { name: "Paintings", icon: "🎨" },
    { name: "Textiles", icon: "🧵" }
  ];

  const products = [
    {
      name: "Handmade Clay Pot",
      artisan: "Priya Arts",
      price: 599
    },
    {
      name: "Traditional Necklace",
      artisan: "Crafts by Riya",
      price: 899
    },
    {
      name: "Hand Painted Canvas",
      artisan: "Art by Meera",
      price: 1299
    },
    {
      name: "Handwoven Scarf",
      artisan: "Kala Crafts",
      price: 749
    }
  ];

  return (
    <main>

      <Hero />

      {/* Categories */}

      <section className="categories-section">

        <div className="section-heading">
          <p>EXPLORE</p>
          <h2>Shop by Category</h2>
        </div>

        <div className="category-grid">

          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              icon={category.icon}
            />
          ))}

        </div>

      </section>


      {/* Featured Products */}

      <section className="products-section">

        <div className="section-heading">
          <p>OUR COLLECTION</p>
          <h2>Featured Products</h2>
        </div>

        <div className="product-grid">

          {products.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
            />
          ))}

        </div>

      </section>

    </main>
  );
}

export default Home;