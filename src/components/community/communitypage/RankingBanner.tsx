import './RankingBanner.css'
import rankHat1Image from '../../../assets/images/rank_hat/rank_1.svg'
import rankHat2Image from '../../../assets/images/rank_hat/rank_2.svg'
import rankHat3Image from '../../../assets/images/rank_hat/rank_3.svg'

type DorakRank = {
  rank: number
  name: string
}

type RankingBannerProps = {
  rankings?: DorakRank[]
}

const rankHatImageByRank: Record<number, string> = {
  1: rankHat1Image,
  2: rankHat2Image,
  3: rankHat3Image,
}

function RankingBanner({
  rankings = [
    { rank: 1, name: '도시락락락' },
    { rank: 2, name: '냉털전문가' },
    { rank: 3, name: '도락쿵야' },
  ],
}: RankingBannerProps) {
  return (
    <section className="dorak-ranking">
      <div className="dorak-ranking__header">
        <h2>도락Pick ! 명예의 전당</h2>
        <button type="button">내 순위 보기 ›</button>
      </div>
      <p className="dorak-ranking__subtitle">이번 주 댓글·저장·좋아요 기준</p>
      <div className="dorak-ranking__cards">
        {rankings.map((item) => (
          <div
            key={item.rank}
            className={`dorak-ranking__card${item.rank === 1 ? ' dorak-ranking__card--first' : ''}`}
          >
            <span className="dorak-ranking__rank">{item.rank}</span>
            <div className="dorak-ranking__avatar">
              <img src={rankHatImageByRank[item.rank] ?? rankHat3Image} alt="" aria-hidden="true" />
            </div>
            <span className="dorak-ranking__name">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RankingBanner
