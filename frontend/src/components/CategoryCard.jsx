function CategoryCard({ name, icon }) {
  return (
    <div className="category-card">
      <div className="category-icon">
        {icon}
      </div>

      <h3>{name}</h3>
    </div>
  );
}

export default CategoryCard;