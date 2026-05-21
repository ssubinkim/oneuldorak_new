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

    // 커뮤니티 헤더 실제 높이를 측정해서 rootMargin으로 사용
    // → compact 트리거가 탭이 sticky되는 타이밍과 정확히 맞아떨어짐
    const headerHeight = stickyHeaderRef.current
      ? Math.round(stickyHeaderRef.current.getBoundingClientRect().height)
      : 68

    // Expose exact measured height as a CSS variable so CommunityStickyHeader
    // sticks at the same position, eliminating any hardcoded-68px mismatch gap.
    root.style.setProperty('--community-banner-header-height', `${headerHeight}px`)

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
        rootMargin: `-${headerHeight}px 0px 0px 0px`,
      },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [])

  return { isHeaderCompact, pageRef, compactTriggerRef, stickyHeaderRef, handleCommunityScroll }
}

export default useCommunityHeaderCollapse
