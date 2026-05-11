import './RankingBanner.css'

type DorakRank = {
  rank: number
  name: string
}

type RankingBannerProps = {
  rankings?: DorakRank[]
}

function RankingBanner({
  rankings = [
    { rank: 1, name: '도시락락락' },
    { rank: 2, name: '냉털전문가' },
    { rank: 3, name: '지쳤나요?네니오' },
  ],
}: RankingBannerProps) {
  return (
    <section className="dorak-ranking">
      <div className="dorak-ranking__header">
        <h2>모두가 주목한 도락이</h2>
        <button type="button">내 순위 보기 ›</button>
      </div>
      <p className="dorak-ranking__subtitle">이번 주 댓글·서강·좋아요 기준</p>
      <div className="dorak-ranking__cards">
        {rankings.map((item) => (
          <div
            key={item.rank}
            className={`dorak-ranking__card${item.rank === 1 ? ' dorak-ranking__card--first' : ''}`}
          >
            <span className="dorak-ranking__rank">{item.rank}</span>
            <div className="dorak-ranking__avatar">🍱</div>
            <span className="dorak-ranking__name">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RankingBanner
