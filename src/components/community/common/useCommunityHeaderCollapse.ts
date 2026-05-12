import { useCallback, useRef, useState, type UIEvent } from 'react'

const COLLAPSE_SCROLL_TOP = 96
const EXPAND_SCROLL_TOP = 24

function useCommunityHeaderCollapse() {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false)
  const isHeaderCompactRef = useRef(false)

  const handleCommunityScroll = useCallback((event: UIEvent<HTMLElement>) => {
    const scrollTop = event.currentTarget.scrollTop
    const shouldCompact = isHeaderCompactRef.current
      ? scrollTop > EXPAND_SCROLL_TOP
      : scrollTop > COLLAPSE_SCROLL_TOP

    if (shouldCompact === isHeaderCompactRef.current) {
      return
    }

    isHeaderCompactRef.current = shouldCompact
    setIsHeaderCompact(shouldCompact)
  }, [])

  return { isHeaderCompact, handleCommunityScroll }
}

export default useCommunityHeaderCollapse
