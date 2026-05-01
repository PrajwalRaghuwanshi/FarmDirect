import { getStatusStepIndex, statusFlow as steps } from '../utils/orderStatus'

export default function OrderStatusStepper({ status }) {
  const activeIndex = getStatusStepIndex(status)

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => {
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
