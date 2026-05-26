import { notifyMyActivityChanged } from '../../common/myActivityEvents'

const BOARD_REACTION_STORAGE_KEY = 'oneuldorak:board-detail-reactions:v1'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function getBoardReactionKey(postId: string, userId: string) {
  return `${userId}:${postId}`
}

export function readPersistedBoardLikeKeys() {
  if (!isBrowser()) {
    return []
  }

  const rawValue = window.localStorage.getItem(BOARD_REACTION_STORAGE_KEY)

  if (!rawValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(rawValue)

    return Array.isArray(parsedValue)
      ? parsedValue.filter((reactionKey): reactionKey is string => typeof reactionKey === 'string')
      : []
  } catch {
    return []
  }
}

export function savePersistedBoardLikeKeys(reactionKeys: string[]) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(BOARD_REACTION_STORAGE_KEY, JSON.stringify(reactionKeys))
  notifyMyActivityChanged()
}
