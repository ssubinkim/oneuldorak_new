function BackIcon() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
      <path d="M9 1L1 9L9 17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type StorageHeaderProps = {
  onBack: () => void
}

function StorageHeader({ onBack }: StorageHeaderProps) {
  return (
    <div className="sp-header">
      <button className="sp-back-btn" onClick={onBack} aria-label="뒤로가기">
        <BackIcon />
      </button>
      <span className="sp-header-title">내 재료 보관함</span>
    </div>
  )
}

export default StorageHeader
