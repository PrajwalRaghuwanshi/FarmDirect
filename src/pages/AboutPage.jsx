export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-white dark:bg-slate-800 p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">About Harvest Hub</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">Building a fairer route from farm to table</h1>
        <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-400">Harvest Hub is a farmer-to-consumer marketplace that helps local growers, dairies, and co-ops reach households more directly. We focus on transparent sourcing, fresher produce, and better visibility into where food comes from.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            'Direct farmer partnerships with better margins and clearer demand signals.',
            'Localized supply chains that reduce middlemen and shorten delivery timelines.',
            'Seasonal, traceable food choices that help households shop with confidence.',
          ].map((item) => (
            <div key={item} className="rounded-3xl bg-emerald-50 dark:bg-slate-700 p-5 text-sm leading-7 text-slate-700 dark:text-slate-300">{item}</div>
          ))}
        </div>
      </div>
    </section>
  )
}
