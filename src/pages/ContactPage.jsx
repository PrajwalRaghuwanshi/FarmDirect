export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Contact</p>
          <h1 className="mt-3 text-4xl font-bold">Talk to the marketplace team</h1>
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p>Email: support@harvesthub.local</p>
            <p>Phone: +91 90000 12345</p>
            <p>Farmer onboarding: partner@harvesthub.local</p>
          </div>
        </div>

        <form className="rounded-[2rem] bg-white dark:bg-slate-800 p-8 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            {['Name', 'Email', 'Phone', 'Subject'].map((label) => (
              <label key={label} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
                <input type="text" placeholder={label} className="mt-2 w-full rounded-2xl border border-emerald-100 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500" />
              </label>
            ))}
          </div>
          <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Message
            <textarea rows="5" placeholder="Tell us what you need help with" className="mt-2 w-full rounded-2xl border border-emerald-100 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500" />
          </label>
          <button type="button" className="mt-6 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">Send Message</button>
        </form>
      </div>
    </section>
  )
}
