import { getStatusStepIndex, statusFlow as steps } from '../utils/orderStatus'

export default function OrderStatusStepper({ status }) {
  if (status === 'Cancelled') {
    return (
      <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 text-center">
        <p className="text-red-700 dark:text-red-400 font-bold uppercase tracking-wider text-sm">
          This Order Has Been Cancelled
        </p>
      </div>
    )
  }

  const activeIndex = getStatusStepIndex(status)
  const filteredSteps = steps.filter(s => s !== 'Cancelled')

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-4">
        {filteredSteps.map((step, index) => {
          const isComplete = index <= activeIndex

          return (
            <div key={step} className="flex items-center gap-3 md:flex-col md:items-start">
              <div className="flex w-full items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    isComplete
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {index + 1}
                </span>
                {index < steps.length - 1 && (
                  <span
                    className={`hidden h-1 flex-1 rounded-full md:block ${
                      index < activeIndex ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  isComplete ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
