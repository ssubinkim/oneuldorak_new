import { useCallback, useRef, useState, type UIEvent } from 'react'

const COMPACT_SHADOW_SCROLL_TOP = 280

function useCommunityHeaderCollapse() {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false)
  const isHeaderCompactRef = useRef(false)

  const handleCommunityScroll = useCallback((event: UIEvent<HTMLElement>) => {
    const scrollTop = event.currentTarget.scrollTop
    const shouldCompact = scrollTop > COMPACT_SHADOW_SCROLL_TOP

    if (shouldCompact === isHeaderCompactRef.current) {
      return
    }

    isHeaderCompactRef.current = shouldCompact
    setIsHeaderCompact(shouldCompact)
  }, [])

  return { isHeaderCompact, handleCommunityScroll }
}

export default useCommunityHeaderCollapse
