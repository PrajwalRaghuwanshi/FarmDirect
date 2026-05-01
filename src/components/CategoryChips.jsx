export default function CategoryChips({
  categories,
  selectedCategory,
  onSelect,
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const isActive = category === selectedCategory

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'border-emerald-700 bg-emerald-700 text-white shadow'
                : 'border-emerald-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-100 dark:hover:bg-slate-700'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
