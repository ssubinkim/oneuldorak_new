import './CommunitySearchBar.css'

type CommunitySearchBarProps = {
  value: string
  onChange: (value: string) => void
  onClose: () => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
  showCloseButton?: boolean
  onBlur?: () => void
}

function CommunitySearchBar({
  value,
  onChange,
  onClose,
  placeholder = '댓글을 입력하세요.',
  autoFocus = false,
  className,
  showCloseButton = true,
  onBlur,
}: CommunitySearchBarProps) {
  const rootClassName = ['community-search-bar', className].filter(Boolean).join(' ')

  return (
    <div className={rootClassName}>
      <label className="community-search-bar__field">
        <span className="community-search-bar__sr-only">커뮤니티 검색</span>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
        <span className="community-search-bar__icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
      </label>

      {showCloseButton ? (
        <button type="button" className="community-search-bar__close" aria-label="검색 닫기" onClick={onClose}>
          ×
        </button>
      ) : null}
    </div>
  )
}

export default CommunitySearchBar
