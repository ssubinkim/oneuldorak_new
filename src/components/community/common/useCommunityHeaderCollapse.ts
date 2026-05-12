import { useCallback, useEffect, useRef, useState, type UIEvent } from 'react'

const COLLAPSE_DISTANCE = 118
const COMPACT_SHADOW_SCROLL_TOP = 16

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function setStyleProperty(element: HTMLElement, name: string, value: string) {
  if (element.style.getPropertyValue(name) !== value) {
    element.style.setProperty(name, value)
  }
}

function useCommunityHeaderCollapse() {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false)
  const isHeaderCompactRef = useRef(false)
  const scrollElementRef = useRef<HTMLElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const updateHeaderProgress = useCallback((element: HTMLElement) => {
    const scrollTop = element.scrollTop
    const progress = clamp(scrollTop / COLLAPSE_DISTANCE, 0, 1)
    const inverseProgress = 1 - progress
    const nextProgress = progress.toFixed(3)

    setStyleProperty(element, '--community-header-progress', nextProgress)
    setStyleProperty(element, '--community-banner-padding-x', `${16 + (4 * progress)}px`)
    setStyleProperty(element, '--community-banner-padding-bottom', `${30 * inverseProgress}px`)
    setStyleProperty(element, '--community-banner-header-margin', `${8 * inverseProgress}px`)
    setStyleProperty(element, '--community-banner-title-size', `${22 + (2 * progress)}px`)
    setStyleProperty(element, '--community-subtitle-max-height', `${48 * inverseProgress}px`)
    setStyleProperty(element, '--community-subtitle-margin-bottom', `${10 * inverseProgress}px`)
    setStyleProperty(element, '--community-collapsible-opacity', inverseProgress.toFixed(3))
    setStyleProperty(element, '--community-image-max-height', `${220 * inverseProgress}px`)
    setStyleProperty(element, '--community-image-margin-bottom', `${-18 * inverseProgress}px`)
    setStyleProperty(element, '--community-tabs-height', `${82 - (8 * progress)}px`)
    setStyleProperty(element, '--community-tabs-margin-top', `${-38 + (38 * progress)}px`)
    setStyleProperty(element, '--community-tabs-padding-top', `${34 - (12 * progress)}px`)

    const shouldCompact = scrollTop > COMPACT_SHADOW_SCROLL_TOP

    if (shouldCompact === isHeaderCompactRef.current) {
      return
    }

    isHeaderCompactRef.current = shouldCompact
    setIsHeaderCompact(shouldCompact)
  }, [])

  const handleCommunityScroll = useCallback((event: UIEvent<HTMLElement>) => {
    scrollElementRef.current = event.currentTarget

    if (animationFrameRef.current !== null) {
      return
    }

    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = null

      if (scrollElementRef.current) {
        updateHeaderProgress(scrollElementRef.current)
      }
    })
  }, [updateHeaderProgress])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return { isHeaderCompact, handleCommunityScroll }
}

export default useCommunityHeaderCollapse
