import './MyActivityHeader.css'

type MyActivityHeaderProps = {
  title: string
  onBack: () => void
}

function MyActivityHeader({ title, onBack }: MyActivityHeaderProps) {
  return (
    <header className="my-activity-header">
      <button className="my-activity-header__back" onClick={onBack} aria-label="뒤로가기">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true">
          <path d="M9 1L1 9L9 17" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="my-activity-header__title">{title}</h1>
    </header>
  )
}

export default MyActivityHeader
