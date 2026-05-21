import './Ranking.css'
import no1Mascot from '../common/images/no1blue.png'
import no2Mascot from '../common/images/no2bro.png'
import no3Mascot from '../common/images/no3carrot.png'
import no1Podium from '../common/images/no1.png'
import no2Podium from '../common/images/no2.png'
import no3Podium from '../common/images/no3.png'

type DorakRank = {
  rank: number
  name: string
  likes: number
}

type RankingBannerProps = {
  rankings?: DorakRank[]
}

const mascotByRank: Record<number, string> = {
  1: no1Mascot,
  2: no2Mascot,
  3: no3Mascot,
}

const podiumByRank: Record<number, string> = {
  1: no1Podium,
  2: no2Podium,
  3: no3Podium,
}


const PODIUM_ORDER = [2, 1, 3]

function Ranking({
  rankings = [
    { rank: 1, name: '도시락락락', likes: 88 },
    { rank: 2, name: '냉털전문가', likes: 72 },
    { rank: 3, name: '도락쿵야', likes: 45 },
  ],
}: RankingBannerProps) {
  const podiumItems = PODIUM_ORDER
    .map((rank) => rankings.find((r) => r.rank === rank))
    .filter((item): item is DorakRank => item !== undefined)

  return (
    <section className="dorak-ranking">
      <span className="dorak-ranking__badge">도락Pick!</span>
      <h2 className="dorak-ranking__header">명예의 전당</h2>
      <div className="dorak-ranking__subtitle-row">
        <p className="dorak-ranking__subtitle">지난 배틀의 주인공들을 소개합니다</p>
        <button type="button" className="dorak-ranking__more">더보기 ›</button>
      </div>
      <div className="dorak-ranking__podium">
        {podiumItems.map((item) => (
          <div
            key={item.rank}
            className={`dorak-ranking__podium-item dorak-ranking__podium-item--rank${item.rank}`}
          >
            <img
              className="dorak-ranking__mascot"
              src={mascotByRank[item.rank]}
              alt=""
              aria-hidden="true"
            />
            <img
              className="dorak-ranking__cylinder"
              src={podiumByRank[item.rank]}
              alt=""
              aria-hidden="true"
            />
            <div className="dorak-ranking__info">
              <span className="dorak-ranking__name">{item.name}</span>
              <span className="dorak-ranking__likes">♡ {item.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Ranking
