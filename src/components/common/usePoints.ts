import { useEffect, useState } from 'react'

const BASE_TOTAL_POINTS = 245
const BASE_MONTHLY_POINTS = 133
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

let currentPointState = createDefaultPointState()

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
