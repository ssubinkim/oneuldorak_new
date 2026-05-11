import './CommunityBanner.css'
import dorakImage from '../../../pages/community/images/dorak02.png'

function CommunityBanner() {
  return (
    <section className="community-banner">
      <div className="community-banner__header">
        <h1>커뮤니티</h1>
        <div className="community-banner__actions">
          <button type="button" aria-label="검색">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button type="button" aria-label="저장">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>
      <p className="community-banner__subtitle">
        오늘도 바쁜 도락이들의 도시락 이야기<br />
        도시락도 ROCK이다!
      </p>
      <img src={dorakImage} alt="" className="community-banner__image" aria-hidden="true" />
    </section>
  )
}

export default CommunityBanner
