export default function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div className="category-tabs" role="tablist" aria-label="Project categories">
      {categories.map((category, index) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={activeCategory === category}
          className={`category-tab ${activeCategory === category ? "active" : ""}`}
          onClick={() => onChange(category)}
        >
          {index === 0 ? category : `${index}. ${category}`}
        </button>
      ))}
    </div>
  );
}
