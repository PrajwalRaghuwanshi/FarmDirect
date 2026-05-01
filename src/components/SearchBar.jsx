export default function SearchBar({ value, onChange }) {
  return (
    <label className="block w-full">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Search products
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by product name"
        className="w-full rounded-full border border-emerald-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-5 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
      />
    </label>
  )
}
