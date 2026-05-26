export const MY_ACTIVITY_CHANGED_EVENT = 'oneuldorak:my-activity-changed'

export function notifyMyActivityChanged() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(MY_ACTIVITY_CHANGED_EVENT))
}
