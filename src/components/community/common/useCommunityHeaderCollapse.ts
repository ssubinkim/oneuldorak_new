import { useCallback, useEffect, useRef, useState, type UIEvent } from 'react'

const COMPACT_SHADOW_SCROLL_TOP = 280

function useCommunityHeaderCollapse() {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false)
  const isHeaderCompactRef = useRef(false)
  const pageRef = useRef<HTMLElement | null>(null)
  const compactTriggerRef = useRef<HTMLDivElement | null>(null)

  const handleCommunityScroll = useCallback((event: UIEvent<HTMLElement>) => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      return
    }

    const scrollTop = event.currentTarget.scrollTop
    const shouldCompact = scrollTop > COMPACT_SHADOW_SCROLL_TOP

    if (shouldCompact === isHeaderCompactRef.current) {
      return
    }

    isHeaderCompactRef.current = shouldCompact
    setIsHeaderCompact(shouldCompact)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return
    }

    const root = pageRef.current
    const target = compactTriggerRef.current

    if (!root || !target) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldCompact = !entry.isIntersecting

        if (shouldCompact === isHeaderCompactRef.current) {
          return
        }

        isHeaderCompactRef.current = shouldCompact
        setIsHeaderCompact(shouldCompact)
      },
      {
        root,
        threshold: 0,
        rootMargin: '-56px 0px 0px 0px',
      },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [])

  return { isHeaderCompact, pageRef, compactTriggerRef, handleCommunityScroll }
}

export default useCommunityHeaderCollapse
