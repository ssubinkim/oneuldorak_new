import './HomeHeaderBar.css'

function HomeHeaderBar() {
  return (
    <div className="home-header-bar">
      <span className="home-header-bar__title">오늘 도락</span>
      <button className="home-header-bar__menu" type="button" aria-label="메뉴 열기">
        <span />
        <span />
        <span />
      </button>
    </div>
  )
}

export default HomeHeaderBar
