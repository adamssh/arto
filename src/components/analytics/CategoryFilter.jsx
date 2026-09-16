export default function CategoryFilter({ categories, selectedId, onChange }) {
  const expenseCategories = categories.filter(c => c.type === 'expense');

  if (expenseCategories.length === 0) return null;

  return (
    <div className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-2 min-w-max">
        <button
          onClick={() => onChange(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedId === null 
              ? 'bg-text-primary text-surface' 
              : 'bg-surface border border-sage/30 text-text-secondary hover:border-primary/50'
          }`}
        >
          Semua Kategori
        </button>
        {expenseCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedId === cat.id 
                ? 'bg-text-primary text-surface' 
                : 'bg-surface border border-sage/30 text-text-secondary hover:border-primary/50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

