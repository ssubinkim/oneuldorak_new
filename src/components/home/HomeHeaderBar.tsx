import './HomeHeaderBar.css'

function HomeHeaderBar() {
  return (
    <div className="home-header-bar font-pretendard">
      <span className="home-header-bar__title">오늘도락</span>
      <button className="home-header-bar__notification" type="button" aria-label="알림 열기">
        <svg className="home-header-bar__notification-icon" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M15.35 14.15H4.65c.85-.93 1.35-2.15 1.35-3.45V8.55a4 4 0 0 1 8 0v2.15c0 1.3.5 2.52 1.35 3.45Z" />
          <path d="M8.25 16.15a1.85 1.85 0 0 0 3.5 0" />
          <path d="M9.2 4.05a1 1 0 0 1 1.6 0" />
        </svg>
      </button>
    </div>
  )
}

export default HomeHeaderBar
