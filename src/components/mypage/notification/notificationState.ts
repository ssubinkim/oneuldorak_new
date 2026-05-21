const STORAGE_KEY = 'oneuldorak:read-notifications'

export function getReadIds(): Set<number> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return new Set(stored ? (JSON.parse(stored) as number[]) : [])
  } catch {
    return new Set()
  }
}

export function markAsRead(id: number): void {
  const ids = getReadIds()
  ids.add(id)
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

export function hasUnreadNotifications(ids: number[]): boolean {
  const readIds = getReadIds()
  return ids.some(id => !readIds.has(id))
}
