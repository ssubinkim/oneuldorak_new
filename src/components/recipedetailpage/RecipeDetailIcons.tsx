import type { ReactNode } from 'react'

type IconButtonProps = {
  label: string
  children: ReactNode
  onClick?: () => void
}

export function IconButton({ label, children, onClick }: IconButtonProps) {
  return (
    <button type="button" className="recipe-detail-icon-button" aria-label={label} onClick={onClick}>
      {children}
    </button>
  )
}

export function StatIcon({ type }: { type: 'heart' | 'comment' | 'bookmark' | 'share' | 'basket' | 'send' }) {
  if (type === 'heart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 5.6a5 5 0 0 0-7 0L12 7.4l-1.7-1.8a5 5 0 0 0-7.1 7l1.8 1.8L12 21l7.1-6.6 1.7-1.8a5 5 0 0 0 0-7Z" />
      </svg>
    )
  }

  if (type === 'comment') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 6.2h15a1.7 1.7 0 0 1 1.7 1.7v8.4a1.7 1.7 0 0 1-1.7 1.7H9.8L5.4 21V7.9a1.7 1.7 0 0 1 1.7-1.7Z" />
      </svg>
    )
  }

  if (type === 'bookmark') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.1 4.8h9.8a1.4 1.4 0 0 1 1.4 1.4v13.9l-6.3-3.4-6.3 3.4V6.2a1.4 1.4 0 0 1 1.4-1.4Z" />
      </svg>
    )
  }

  if (type === 'share') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="6" cy="12" r="2.2" />
        <circle cx="17.5" cy="6.5" r="2.2" />
        <circle cx="17.5" cy="17.5" r="2.2" />
        <path d="m8 11 7.5-3.7M8 13l7.5 3.8" />
      </svg>
    )
  }

  if (type === 'basket') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.8 9.3h10.4l-1 8.4a1.7 1.7 0 0 1-1.7 1.5h-5a1.7 1.7 0 0 1-1.7-1.5l-1-8.4Z" />
        <path d="M9.2 9.2 12 4.8l2.8 4.4" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 14-7-3.8 14-3.1-5.8L5 12Z" />
      <path d="m12.1 13.2 3.8-4.1" />
    </svg>
  )
}

export function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14.7 5.6-6.2 6.4 6.2 6.4" />
    </svg>
  )
}

export function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="recipe-detail-stars" aria-label={`난이도 ${level}점`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span className={index < level ? 'is-active' : undefined} key={index}>
          ★
        </span>
      ))}
    </span>
  )
}
