export default function CustomerServicePage() {
  const contactOptions = [
    { title: 'Call', detail: '+91 90000 12345', copy: 'Speak directly with customer support for delivery, billing, or product issues.', action: 'Call Support', href: 'tel:+919000012345' },
    { title: 'Text', detail: '+91 90000 12345', copy: 'Send a text message for quick questions about orders and delivery windows.', action: 'Text Support', href: 'sms:+919000012345' },
    { title: 'Post', detail: 'Harvest Hub Customer Care, 24 Market Lane, Pune 411001', copy: 'Write to us for formal feedback, partnership documents, or account requests.', action: 'View Mailing Address', href: 'mailto:support@harvesthub.local' },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-white dark:bg-slate-800 p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">Customer Service</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">Reach support the way you prefer</h1>
        <p className="mt-3 max-w-3xl text-base text-slate-600 dark:text-slate-400">Our customer service team helps with delivery updates, refunds, quality concerns, and farmer partnership questions.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {contactOptions.map((option) => (
            <article key={option.title} className="rounded-[1.75rem] bg-emerald-50 dark:bg-slate-700 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">{option.title}</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{option.detail}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{option.copy}</p>
              <a href={option.href} className="mt-6 inline-flex rounded-full bg-slate-900 dark:bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:hover:bg-emerald-600">{option.action}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
