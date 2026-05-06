import './RankingBanner.css'

function RankingBanner() {
  return (
    <section className="ranking-banner">
      <button type="button" className="ranking-banner__link" aria-label="랭킹 확인하기">
        <div>
          <h2>☆ 랭킹</h2>
          <p>이번 주 나의 순위를 확인하세요</p>
        </div>
        <span>›</span>
      </button>
    </section>
  )
}

export default RankingBanner
