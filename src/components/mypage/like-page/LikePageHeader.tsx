import './LikePageHeader.css'

type Props = { onBack: () => void }

export default function LikePageHeader({ onBack }: Props) {
  return (
    <header className="like-header">
      <button className="like-header-back" onClick={onBack} aria-label="뒤로가기">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="like-header-title">좋아요</h1>
      <button className="like-header-search" aria-label="검색">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </header>
  )
}
