import { useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard";

function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const products = [
    {
      id: 1,
      name: "Handmade Clay Pot",
      artisan: "Priya Arts",
      price: 599,
      category: "Pottery",
    },
    {
      id: 2,
      name: "Traditional Necklace",
      artisan: "Crafts by Riya",
      price: 899,
      category: "Jewelry",
    },
    {
      id: 3,
      name: "Hand Painted Canvas",
      artisan: "Art by Meera",
      price: 1299,
      category: "Paintings",
    },
    {
      id: 4,
      name: "Handwoven Scarf",
      artisan: "Kala Crafts",
      price: 749,
      category: "Textiles",
    },
    {
      id: 5,
      name: "Terracotta Vase",
      artisan: "Mitti Studio",
      price: 799,
      category: "Pottery",
    },
    {
      id: 6,
      name: "Beaded Handmade Earrings",
      artisan: "Riya Handcrafts",
      price: 499,
      category: "Jewelry",
    },
    {
      id: 7,
      name: "Village Landscape Painting",
      artisan: "Meera Creations",
      price: 1599,
      category: "Paintings",
    },
    {
      id: 8,
      name: "Traditional Cotton Dupatta",
      artisan: "Kala Weaves",
      price: 999,
      category: "Textiles",
    },
  ];

  const categories = [
    "All",
    "Pottery",
    "Jewelry",
    "Paintings",
    "Textiles",
  ];

  const filteredProducts = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        product.artisan.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <main className="products-page">
      <section className="products-page-header">
        <p>OUR COLLECTION</p>

        <h1>Explore Handmade Products</h1>

        <span>
          Discover unique creations made by talented local artisans.
        </span>
      </section>

      <section className="products-controls">
        <input
          type="text"
          placeholder="Search products or artisans..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="category-filters">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="products-page-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))
        ) : (
          <div className="no-products">
            <h2>No products found</h2>
            <p>Try a different search or category.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Products;