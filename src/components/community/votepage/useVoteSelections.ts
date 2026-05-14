import { useEffect, useState } from 'react'

export type VoteSelections = Record<string, string>

const VOTE_SELECTIONS_CHANGED_EVENT = 'oneuldorak:vote-selections-changed'

let currentVoteSelections: VoteSelections = {}

function readVoteSelections() {
  return currentVoteSelections
}

function writeVoteSelections(nextVoteSelections: VoteSelections) {
  currentVoteSelections = nextVoteSelections

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(VOTE_SELECTIONS_CHANGED_EVENT))
  }
}

export function selectVoteOption(cardId: string, optionLabel: string) {
  if (!cardId || !optionLabel) {
    return false
  }

  if (currentVoteSelections[cardId] === optionLabel) {
    const { [cardId]: _removedOption, ...restSelections } = currentVoteSelections
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
