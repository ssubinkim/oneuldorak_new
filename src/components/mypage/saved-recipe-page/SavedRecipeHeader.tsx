import './SavedRecipeHeader.css'

type SavedRecipeHeaderProps = {
  onBack: () => void
}

function SavedRecipeHeader({ onBack }: SavedRecipeHeaderProps) {
  return (
    <header className="saved-header">
      <button className="saved-header-back" onClick={onBack} aria-label="뒤로가기">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path
            d="M9 1L1 9L9 17"
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <span className="saved-header-title">저장한 레시피</span>
    </header>
  )
}

export default SavedRecipeHeader
