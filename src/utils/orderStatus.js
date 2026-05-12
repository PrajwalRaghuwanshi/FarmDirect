export const statusFlow = [
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
]

export function getStatusStepIndex(status) {
  const index = statusFlow.indexOf(status)
  return index === -1 ? 0 : index
}

export function advanceStatus(status) {
  const currentIndex = getStatusStepIndex(status)
  const nextIndex = Math.min(currentIndex + 1, statusFlow.length - 1)
  return statusFlow[nextIndex]
}
