export type WriteTopIconKind = 'back' | 'heart' | 'bookmark' | 'share' | 'image' | 'video' | 'plus' | 'chevron'

type WriteTopIconProps = {
  kind: WriteTopIconKind
}

function WriteTopIcon({ kind }: WriteTopIconProps) {
  if (kind === 'back') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m14.7 5.6-6.2 6.2 6.2 6.2" />
      </svg>
    )
  }

  if (kind === 'heart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 5.6a5 5 0 0 0-7 0L12 7.4l-1.7-1.8a5 5 0 0 0-7.1 7l1.8 1.8L12 21l7.1-6.6 1.7-1.8a5 5 0 0 0 0-7Z" />
      </svg>
    )
  }

  if (kind === 'bookmark') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.1 4.8h9.8a1.4 1.4 0 0 1 1.4 1.4v13.9l-6.3-3.4-6.3 3.4V6.2a1.4 1.4 0 0 1 1.4-1.4Z" />
      </svg>
    )
  }

  if (kind === 'share') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="6" cy="12" r="2" />
        <circle cx="17.5" cy="6" r="2" />
        <circle cx="17.5" cy="18" r="2" />
        <path d="M7.8 11.1 15.7 7M7.8 12.9 15.7 17" />
      </svg>
    )
  }

  if (kind === 'image') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.8" y="4.8" width="14.4" height="14.4" rx="1.8" />
        <circle cx="9" cy="9" r="1.5" />
        <path d="m6.4 17 4.5-4.6 2.7 2.8 1.4-1.5 2.6 3.3" />
      </svg>
    )
  }

  if (kind === 'video') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="4.8" width="14" height="14.4" rx="1.8" />
        <path d="m10.2 8.5 5.2 3.5-5.2 3.5Z" />
      </svg>
    )
  }

  if (kind === 'plus') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 9 5 5 5-5" />
    </svg>
  )
}

export default WriteTopIcon
