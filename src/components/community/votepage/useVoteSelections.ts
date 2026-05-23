import { useEffect, useState } from 'react'

export type VoteSelections = Record<string, string>

const VOTE_SELECTIONS_CHANGED_EVENT = 'oneuldorak:vote-selections-changed'
const VOTE_SELECTIONS_STORAGE_KEY = 'oneuldorak:vote-selections'

function loadVoteSelections(): VoteSelections {
  try {
    const raw = localStorage.getItem(VOTE_SELECTIONS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

let currentVoteSelections: VoteSelections = loadVoteSelections()

function readVoteSelections() {
  return currentVoteSelections
}

function writeVoteSelections(nextVoteSelections: VoteSelections) {
  currentVoteSelections = nextVoteSelections

  try {
    localStorage.setItem(VOTE_SELECTIONS_STORAGE_KEY, JSON.stringify(nextVoteSelections))
  } catch {
    // localStorage 사용 불가 환경에서는 무시
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(VOTE_SELECTIONS_CHANGED_EVENT))
  }
}

export function selectVoteOption(cardId: string, optionLabel: string) {
  if (!cardId || !optionLabel) {
    return false
  }

  if (currentVoteSelections[cardId] === optionLabel) {
    const restSelections = { ...currentVoteSelections }
    delete restSelections[cardId]
    writeVoteSelections(restSelections)
    return false
  }

  writeVoteSelections({
    ...currentVoteSelections,
    [cardId]: optionLabel,
  })

  return true
}

export function useVoteSelections() {
  const [selectedVotes, setSelectedVotes] = useState(readVoteSelections)

  useEffect(() => {
    const syncVoteSelections = () => {
      setSelectedVotes(readVoteSelections())
    }

    window.addEventListener(VOTE_SELECTIONS_CHANGED_EVENT, syncVoteSelections)
    syncVoteSelections()

    return () => {
      window.removeEventListener(VOTE_SELECTIONS_CHANGED_EVENT, syncVoteSelections)
    }
  }, [])

  return {
    selectedVotes,
    selectVoteOption,
  }
}
