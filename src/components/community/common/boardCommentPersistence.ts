import type { BoardComment } from '../boarddetailpage/CommentItem'
import { notifyMyActivityChanged } from '../../common/myActivityEvents'

const BOARD_COMMENT_STORAGE_KEY = 'oneuldorak:board-detail-comments:v1'

export type PersistedBoardComments = Record<string, BoardComment[]>

function isBrowser() {
  return typeof window !== 'undefined'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function isBoardComment(value: unknown): value is BoardComment {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.user === 'string' &&
    (typeof value.authorId === 'string' || typeof value.authorId === 'undefined') &&
    (typeof value.avatar === 'string' || typeof value.avatar === 'undefined') &&
    typeof value.timeAgo === 'string' &&
    typeof value.text === 'string'
  )
}

export function readPersistedBoardComments(): PersistedBoardComments {
  if (!isBrowser()) {
    return {}
  }

  const rawValue = window.localStorage.getItem(BOARD_COMMENT_STORAGE_KEY)

  if (!rawValue) {
    return {}
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown

    if (!isRecord(parsedValue)) {
      return {}
    }

    return Object.entries(parsedValue).reduce<PersistedBoardComments>((commentsByPostId, [postId, comments]) => {
      if (!Array.isArray(comments)) {
        return commentsByPostId
      }

      commentsByPostId[postId] = comments.filter(isBoardComment)
      return commentsByPostId
    }, {})
  } catch {
    return {}
  }
}

export function savePersistedBoardComments(commentsByPostId: PersistedBoardComments) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(BOARD_COMMENT_STORAGE_KEY, JSON.stringify(commentsByPostId))
  notifyMyActivityChanged()
}
