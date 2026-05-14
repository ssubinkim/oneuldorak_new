export type MypageCardTarget = {
  kind: 'recipe' | 'board'
  id: string
}

const MYPAGE_CARD_TARGET_STORAGE_KEY = 'oneuldorak:mypage-card-target:v1'

function isMypageCardTarget(value: unknown): value is MypageCardTarget {
  if (!value || typeof value !== 'object') {
    return false
  }

  const target = value as Partial<MypageCardTarget>

  return (target.kind === 'recipe' || target.kind === 'board') && typeof target.id === 'string'
}

export function openMypageCardTarget(target?: MypageCardTarget) {
  if (!target) {
    return
  }

  window.sessionStorage.setItem(MYPAGE_CARD_TARGET_STORAGE_KEY, JSON.stringify(target))

  const searchParam = target.kind === 'recipe' ? 'recipeId' : 'boardId'
  window.location.hash = `#/community?${searchParam}=${encodeURIComponent(target.id)}`
}

export function consumeMypageCardTarget(): MypageCardTarget | null {
  const rawTarget = window.sessionStorage.getItem(MYPAGE_CARD_TARGET_STORAGE_KEY)

  if (!rawTarget) {
    return null
  }

  window.sessionStorage.removeItem(MYPAGE_CARD_TARGET_STORAGE_KEY)

  try {
    const parsedTarget = JSON.parse(rawTarget)

    return isMypageCardTarget(parsedTarget) ? parsedTarget : null
  } catch {
    return null
  }
}
