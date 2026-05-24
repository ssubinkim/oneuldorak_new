import { useEffect, useState } from 'react'

const DEFAULT_BASE_TOTAL_POINTS = 245
const DEFAULT_BASE_MONTHLY_POINTS = 133
const POINT_PROFILE_STORAGE_KEY = 'oneuldorak:points-profile:v1'
const POINT_STATE_STORAGE_KEY = 'oneuldorak:points-state:v1'
const POINTS_CHANGED_EVENT = 'oneuldorak:points-changed'

export type PointProfile = 'default' | 'signup'

export type PointHistoryEntry = {
  id: string
  label: string
  point: number
  createdAt: string
}

const MAX_POINT_HISTORY_LENGTH = 200

const ACTIVITY_POINT_LABELS: Record<string, string> = {
  'post-write': '게시글 작성',
  'comment-write': '댓글 작성',
  'vote-write': '선착순 투표 작성',
  'shopping-review-write': '쇼핑 후 리뷰 작성',
  'popular-post-register': '인기글 등록',
  'attendance-complete': '출석 완료 보상',
  'kakao-share': '카카오톡 공유',
}

const VOTE_POINT_LABEL = '선착순 투표 작성'

type PointState = {
  earnedPoints: number
  monthlyEarnedPoints: number
  awardedVoteIds: string[]
  awardedActivityKeys: string[]
  pointHistory: PointHistoryEntry[]
}

function createDefaultPointState(): PointState {
  return {
    earnedPoints: 0,
    monthlyEarnedPoints: 0,
    awardedVoteIds: [],
    awardedActivityKeys: [],
    pointHistory: [],
  }
}

function toPointNumber(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0
  }

  return Math.max(0, Math.trunc(value))
}

function readStoredPointProfile(): PointProfile {
  if (typeof window === 'undefined') {
    return 'default'
  }

  const storedPointProfile = window.localStorage.getItem(POINT_PROFILE_STORAGE_KEY)

  if (storedPointProfile === 'signup') {
    return 'signup'
  }

  return 'default'
}

function readStoredPointState() {
  if (typeof window === 'undefined') {
    return createDefaultPointState()
  }

  const storedPointState = window.localStorage.getItem(POINT_STATE_STORAGE_KEY)

  if (!storedPointState) {
    return createDefaultPointState()
  }

  try {
    const parsedPointState = JSON.parse(storedPointState) as Partial<PointState>
    const parsedPointHistory = Array.isArray(parsedPointState.pointHistory)
      ? parsedPointState.pointHistory
          .filter(
            (entry): entry is PointHistoryEntry =>
              Boolean(entry) &&
              typeof entry === 'object' &&
              typeof entry.id === 'string' &&
              typeof entry.label === 'string' &&
              typeof entry.point === 'number' &&
              Number.isFinite(entry.point) &&
              typeof entry.createdAt === 'string',
          )
          .map((entry) => ({
            id: entry.id,
            label: entry.label,
            point: toPointNumber(entry.point),
            createdAt: entry.createdAt,
          }))
      : []

    return {
      earnedPoints: toPointNumber(parsedPointState.earnedPoints),
      monthlyEarnedPoints: toPointNumber(parsedPointState.monthlyEarnedPoints),
      awardedVoteIds: Array.isArray(parsedPointState.awardedVoteIds)
        ? parsedPointState.awardedVoteIds.filter((voteId): voteId is string => typeof voteId === 'string')
        : [],
      awardedActivityKeys: Array.isArray(parsedPointState.awardedActivityKeys)
        ? parsedPointState.awardedActivityKeys.filter((key): key is string => typeof key === 'string')
        : [],
      pointHistory: parsedPointHistory.slice(0, MAX_POINT_HISTORY_LENGTH),
    }
  } catch {
    return createDefaultPointState()
  }
}

let currentPointProfile = readStoredPointProfile()
let currentPointState = readStoredPointState()

function readPointProfile(): PointProfile {
  return currentPointProfile
}

function getBasePointBalance(profile = readPointProfile()) {
  if (profile === 'signup') {
    return {
      total: 0,
      monthly: 0,
    }
  }

  return {
    total: DEFAULT_BASE_TOTAL_POINTS,
    monthly: DEFAULT_BASE_MONTHLY_POINTS,
  }
}

function readPointState(): PointState {
  return currentPointState
}

function notifyPointStateChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(POINTS_CHANGED_EVENT))
  }
}

function writePointProfile(nextPointProfile: PointProfile) {
  currentPointProfile = nextPointProfile

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(POINT_PROFILE_STORAGE_KEY, nextPointProfile)
  }

  notifyPointStateChanged()
}

function writePointState(nextPointState: PointState) {
  currentPointState = nextPointState

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(POINT_STATE_STORAGE_KEY, JSON.stringify(nextPointState))
  }

  notifyPointStateChanged()
}

function createPointHistoryEntry(label: string, point: number): PointHistoryEntry {
  return {
    id: `point-history-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    label,
    point: toPointNumber(point),
    createdAt: new Date().toISOString(),
  }
}

function appendPointHistoryEntry(
  pointState: PointState,
  label: string,
  point: number,
) {
  const nextPointHistoryEntry = createPointHistoryEntry(label, point)

  return [nextPointHistoryEntry, ...pointState.pointHistory].slice(0, MAX_POINT_HISTORY_LENGTH)
}

function getPointBalance() {
  const pointProfile = readPointProfile()
  const pointState = readPointState()
  const basePointBalance = getBasePointBalance(pointProfile)

  return {
    totalPoints: basePointBalance.total + pointState.earnedPoints,
    monthlyPoints: basePointBalance.monthly + pointState.monthlyEarnedPoints,
  }
}

export function getPointStateSnapshot() {
  return readPointState()
}

export function getPointBalanceSnapshot() {
  return getPointBalance()
}

export function getPointProfileSnapshot() {
  return readPointProfile()
}

export function getPointHistorySnapshot() {
  return readPointState().pointHistory
}

export function initializePointsForSignup() {
  writePointState(createDefaultPointState())
  writePointProfile('signup')
}

export function initializePointsForLogin() {
  writePointProfile('default')
}

export function awardActivityPoint(activityId: string, amount: number, uniqueKey?: string) {
  const pointAmount = toPointNumber(amount)

  if (!activityId || pointAmount === 0) {
    return false
  }

  const pointState = readPointState()
  const activityUniqueKey = uniqueKey ? `${activityId}:${uniqueKey}` : null

  if (activityUniqueKey && pointState.awardedActivityKeys.includes(activityUniqueKey)) {
    return false
  }

  const pointLabel = ACTIVITY_POINT_LABELS[activityId] ?? activityId

  writePointState({
    earnedPoints: pointState.earnedPoints + pointAmount,
    monthlyEarnedPoints: pointState.monthlyEarnedPoints + pointAmount,
    awardedVoteIds: pointState.awardedVoteIds,
    awardedActivityKeys: activityUniqueKey
      ? [...pointState.awardedActivityKeys, activityUniqueKey]
      : pointState.awardedActivityKeys,
    pointHistory: appendPointHistoryEntry(pointState, pointLabel, pointAmount),
  })

  return true
}

export function awardVotePoint(voteId: string, amount = 1) {
  const pointAmount = toPointNumber(amount)

  if (!voteId || pointAmount === 0) {
    return false
  }

  const pointState = readPointState()

  if (pointState.awardedVoteIds.includes(voteId)) {
    return false
  }

  writePointState({
    earnedPoints: pointState.earnedPoints + pointAmount,
    monthlyEarnedPoints: pointState.monthlyEarnedPoints + pointAmount,
    awardedVoteIds: [...pointState.awardedVoteIds, voteId],
    awardedActivityKeys: pointState.awardedActivityKeys,
    pointHistory: appendPointHistoryEntry(pointState, VOTE_POINT_LABEL, pointAmount),
  })

  return true
}

export function usePointBalance() {
  const [pointBalance, setPointBalance] = useState(getPointBalance)

  useEffect(() => {
    const syncPointBalance = () => {
      currentPointProfile = readStoredPointProfile()
      currentPointState = readStoredPointState()
      setPointBalance(getPointBalance())
    }

    window.addEventListener(POINTS_CHANGED_EVENT, syncPointBalance)
    window.addEventListener('storage', syncPointBalance)
    syncPointBalance()

    return () => {
      window.removeEventListener(POINTS_CHANGED_EVENT, syncPointBalance)
      window.removeEventListener('storage', syncPointBalance)
    }
  }, [])

  return pointBalance
}

export function usePointProfile() {
  const [pointProfile, setPointProfile] = useState(readPointProfile)

  useEffect(() => {
    const syncPointProfile = () => {
      currentPointProfile = readStoredPointProfile()
      setPointProfile(currentPointProfile)
    }

    window.addEventListener(POINTS_CHANGED_EVENT, syncPointProfile)
    window.addEventListener('storage', syncPointProfile)
    syncPointProfile()

    return () => {
      window.removeEventListener(POINTS_CHANGED_EVENT, syncPointProfile)
      window.removeEventListener('storage', syncPointProfile)
    }
  }, [])

  return pointProfile
}

export function usePointHistory() {
  const [pointHistory, setPointHistory] = useState(() => readPointState().pointHistory)

  useEffect(() => {
    const syncPointHistory = () => {
      currentPointState = readStoredPointState()
      setPointHistory(currentPointState.pointHistory)
    }

    window.addEventListener(POINTS_CHANGED_EVENT, syncPointHistory)
    window.addEventListener('storage', syncPointHistory)
    syncPointHistory()

    return () => {
      window.removeEventListener(POINTS_CHANGED_EVENT, syncPointHistory)
      window.removeEventListener('storage', syncPointHistory)
    }
  }, [])

  return pointHistory
}
