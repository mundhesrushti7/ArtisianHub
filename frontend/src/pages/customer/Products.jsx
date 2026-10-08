import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard";

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

function Products() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [artisanProducts, setArtisanProducts] =
    useState([]);

  useEffect(() => {
    const loadProducts = () => {
      try {
        const storedProducts = JSON.parse(
          localStorage.getItem("artisanHubProducts") || "[]"
        );

        const formattedProducts = storedProducts.map(
          (product) => ({
            ...product,
            artisan:
              product.artisanName ||
              product.artisan ||
              "Artisan Seller",
          })
        );

        setArtisanProducts(formattedProducts);
      } catch (error) {
        console.error(
          "Error loading artisan products:",
          error
        );

        setArtisanProducts([]);
      }
    };

    loadProducts();

    window.addEventListener(
      "storage",
      loadProducts
    );

    window.addEventListener(
      "artisanProductsUpdated",
      loadProducts
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadProducts
      );

      window.removeEventListener(
        "artisanProductsUpdated",
        loadProducts
      );
    };
  }, []);

  const allProducts = useMemo(() => {
    return [
      ...defaultProducts,
      ...artisanProducts,
    ];
  }, [artisanProducts]);

  const categories = [
    "All",
    "Pottery",
    "Jewelry",
    "Paintings",
    "Textiles",
    "Woodwork",
    "Handicrafts",
    "Other",
  ];

  const filteredProducts = allProducts.filter(
    (product) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchValue) ||
        String(product.artisan || "")
          .toLowerCase()
          .includes(searchValue) ||
        product.category
          .toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Explore Handmade Products</h1>

        <p>
          Discover unique products created by talented
          artisans.
        </p>
      </div>

      <div className="products-controls">
        <input
          type="text"
          placeholder="Search products, artisans or categories..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="products-result-count">
        Showing {filteredProducts.length} product
        {filteredProducts.length !== 1
          ? "s"
          : ""}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="products-empty">
          <h2>No products found</h2>

          <p>
            Try changing your search or category
            filter.
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;