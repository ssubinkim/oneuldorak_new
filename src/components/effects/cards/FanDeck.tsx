import { useEffect, useMemo, useState } from 'react'
import './FanDeck.css'

export type FanDeckItem = {
  id: number | string
  title: string
  priceText: string
  image: string
  timeText: string
}

type FanDeckProps = {
  items: FanDeckItem[]
  className?: string
  intervalMs?: number
  startIndex?: number
  loop?: boolean
  autoplay?: boolean
  onActiveIndexChange?: (index: number) => void
}

function getSafeStartIndex(index: number, itemCount: number): number {
  if (itemCount <= 0) return 0
  if (index < 0) return 0
  if (index >= itemCount) return itemCount - 1
  return index
}

function getLoopedOffset(index: number, activeIndex: number, itemCount: number): number {
  if (itemCount <= 1) return 0

  let offset = index - activeIndex
  const half = itemCount / 2

  if (offset > half) offset -= itemCount
  if (offset < -half) offset += itemCount

  return offset
}

function FanDeck({
  items,
  className = '',
  intervalMs = 1800,
  startIndex = 0,
  loop = true,
  autoplay = true,
  onActiveIndexChange,
}: FanDeckProps) {
  const safeItems = useMemo(() => items ?? [], [items])
  const [activeIndex, setActiveIndex] = useState(() =>
    getSafeStartIndex(startIndex, safeItems.length)
  )
  const normalizedActiveIndex = getSafeStartIndex(activeIndex, safeItems.length)

  useEffect(() => {
    onActiveIndexChange?.(normalizedActiveIndex)
  }, [normalizedActiveIndex, onActiveIndexChange])

  useEffect(() => {
    if (!autoplay) return
    if (safeItems.length <= 1) return

    const timerId = window.setInterval(() => {
      setActiveIndex((previousIndex) => {
        const previousSafeIndex = getSafeStartIndex(previousIndex, safeItems.length)

        if (previousSafeIndex >= safeItems.length - 1) {
          return loop ? 0 : previousSafeIndex
        }

        return previousSafeIndex + 1
      })
    }, intervalMs)

    return () => {
      window.clearInterval(timerId)
    }
  }, [autoplay, intervalMs, loop, safeItems.length])

  if (safeItems.length === 0) {
    return null
  }

  return (
    <div className={`fan-deck ${className}`.trim()} role="list" aria-label="카드 스택">
      {safeItems.map((item, index) => {
        const offset = getLoopedOffset(index, normalizedActiveIndex, safeItems.length)
        const absoluteOffset = Math.abs(offset)
        const hidden = absoluteOffset > 2
        const scale = absoluteOffset === 0 ? 1 : Math.max(0.74, 1 - absoluteOffset * 0.11)
        const translateX = offset * 56
        const translateY = absoluteOffset * 8
        const rotate = offset * 7
        const opacity = hidden ? 0 : Math.max(0.26, 1 - absoluteOffset * 0.28)
        const isActive = index === normalizedActiveIndex

        return (
          <button
            key={item.id}
            type="button"
            className={`fan-deck__card${isActive ? ' is-active' : ''}`}
            style={{
              opacity,
              zIndex: 100 - absoluteOffset * 10,
              transform: `translateX(calc(-50% + ${translateX}px)) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
            }}
            onClick={() => setActiveIndex(index)}
          >
            <h3 className="fan-deck__title">{item.title}</h3>
            <p className="fan-deck__price">{item.priceText}</p>
            <img className="fan-deck__image" src={item.image} alt={item.title} />
            <div className="fan-deck__meta">
              <svg className="fan-deck__clock-icon" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path d="M8 5.4v2.8l1.9 1.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{item.timeText}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default FanDeck
