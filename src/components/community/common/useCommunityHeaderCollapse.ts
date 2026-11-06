import { useCallback, useEffect, useRef, useState, type UIEvent } from 'react'

const COMPACT_SHADOW_SCROLL_TOP = 200

function useCommunityHeaderCollapse() {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false)
  const isHeaderCompactRef = useRef(false)
  const pageRef = useRef<HTMLElement | null>(null)
  const compactTriggerRef = useRef<HTMLDivElement | null>(null)
  const stickyHeaderRef = useRef<HTMLElement | null>(null)

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

    let observer: IntersectionObserver | undefined

    const updateHeaderMetrics = () => {
      const header = stickyHeaderRef.current
      const style = header ? window.getComputedStyle(header) : null
      // Use layout pixels: getBoundingClientRect includes the phone preview zoom.
      const headerHeight = style ? Number.parseFloat(style.height) || 58 : 58
      const headerTopInset = style ? Number.parseFloat(style.top) || 0 : 0

      root.style.setProperty('--commu-header-height', `${headerHeight}px`)
      observer?.disconnect()
      observer = new IntersectionObserver(
        ([entry]) => {
          const shouldCompact = !entry.isIntersecting
          if (shouldCompact === isHeaderCompactRef.current) return
          isHeaderCompactRef.current = shouldCompact
          setIsHeaderCompact(shouldCompact)
        },
        {
          root,
          threshold: 0,
          rootMargin: `-${headerHeight + headerTopInset}px 0px 0px 0px`,
        },
      )
      observer.observe(target)
    }

    updateHeaderMetrics()
    const resizeObserver = new ResizeObserver(updateHeaderMetrics)
    if (stickyHeaderRef.current) resizeObserver.observe(stickyHeaderRef.current)
    window.addEventListener('resize', updateHeaderMetrics)

    return () => {
      observer?.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateHeaderMetrics)
    }
  }, [])

  return { isHeaderCompact, pageRef, compactTriggerRef, stickyHeaderRef, handleCommunityScroll }
}

export default useCommunityHeaderCollapse
