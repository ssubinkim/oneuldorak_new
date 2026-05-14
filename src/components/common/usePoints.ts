import { useEffect, useState } from 'react'

const BASE_TOTAL_POINTS = 245
const BASE_MONTHLY_POINTS = 133
const POINT_STATE_STORAGE_KEY = 'oneuldorak:points-state:v1'
const POINTS_CHANGED_EVENT = 'oneuldorak:points-changed'

type PointState = {
  earnedPoints: number
  monthlyEarnedPoints: number
  awardedVoteIds: string[]
}

function createDefaultPointState(): PointState {
  return {
    earnedPoints: 0,
    monthlyEarnedPoints: 0,
    awardedVoteIds: [],
  }
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

    return {
      earnedPoints: toPointNumber(parsedPointState.earnedPoints),
      monthlyEarnedPoints: toPointNumber(parsedPointState.monthlyEarnedPoints),
      awardedVoteIds: Array.isArray(parsedPointState.awardedVoteIds)
        ? parsedPointState.awardedVoteIds.filter((voteId): voteId is string => typeof voteId === 'string')
        : [],
    }
  } catch {
    return createDefaultPointState()
  }
}

let currentPointState = readStoredPointState()

function toPointNumber(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0
  }

  return Math.max(0, Math.trunc(value))
}

function readPointState(): PointState {
  return currentPointState
}

function writePointState(nextPointState: PointState) {
  currentPointState = nextPointState

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(POINT_STATE_STORAGE_KEY, JSON.stringify(nextPointState))
    window.dispatchEvent(new Event(POINTS_CHANGED_EVENT))
  }
}

function getPointBalance() {
  const pointState = readPointState()

  return {
    totalPoints: BASE_TOTAL_POINTS + pointState.earnedPoints,
    monthlyPoints: BASE_MONTHLY_POINTS + pointState.monthlyEarnedPoints,
  }
}

export function getPointStateSnapshot() {
  return readPointState()
}

export function getPointBalanceSnapshot() {
  return getPointBalance()
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
  })

  return true
}

export function usePointBalance() {
  const [pointBalance, setPointBalance] = useState(getPointBalance)

  useEffect(() => {
    const syncPointBalance = () => {
      setPointBalance(getPointBalance())
    }

    window.addEventListener(POINTS_CHANGED_EVENT, syncPointBalance)
    syncPointBalance()

    return () => {
      window.removeEventListener(POINTS_CHANGED_EVENT, syncPointBalance)
    }
  }, [])

  return pointBalance
}
