import { useEffect, useMemo, useState } from 'react'
import './SequentialHighlightList.css'

export type SequentialHighlightItem = {
  id: number | string
  title: string
  likes?: number
  comments?: number
  thumbnailColor?: string
  thumbnailImage?: string
}

type SequentialHighlightListProps = {
  items: SequentialHighlightItem[]
  className?: string
  intervalMs?: number
  startIndex?: number
  loop?: boolean
  autoplay?: boolean
  onActiveIndexChange?: (index: number) => void
}

function CommentIcon() {
  return (
    <svg className="sequential-highlight-list__comment-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2.5 2.5h11v7.5h-4.8L5.3 13.2v-3.2H2.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function getSafeStartIndex(index: number, itemCount: number): number {
  if (itemCount <= 0) return 0
  if (index < 0) return 0
  if (index >= itemCount) return itemCount - 1
  return index
}

function SequentialHighlightList({
  items,
  className = '',
  intervalMs = 900,
  startIndex = 0,
  loop = true,
  autoplay = true,
  onActiveIndexChange,
}: SequentialHighlightListProps) {
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
    <section className={`sequential-highlight-list ${className}`.trim()}>
      <ol className="sequential-highlight-list__items" aria-label="순차 강조 목록">
        {safeItems.map((item, index) => {
          const isActive = index === normalizedActiveIndex

          return (
            <li
              key={item.id}
              className={`sequential-highlight-list__item${isActive ? ' is-active' : ''}`}
            >
              <span className="sequential-highlight-list__rank">{index + 1}</span>
              <span
                className="sequential-highlight-list__thumbnail"
                style={item.thumbnailColor ? { background: item.thumbnailColor } : undefined}
                aria-hidden="true"
              >
                {item.thumbnailImage && (
                  <img src={item.thumbnailImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                )}
              </span>
              <div className="sequential-highlight-list__content">
                <p className="sequential-highlight-list__title">{item.title}</p>
                <p className="sequential-highlight-list__meta">
                  <span className="sequential-highlight-list__heart">♡</span>
                  <span>{item.likes ?? 0}</span>
                  <span className="sequential-highlight-list__dot">·</span>
                  <CommentIcon />
                  <span>{item.comments ?? 0}</span>
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default SequentialHighlightList
