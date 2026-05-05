import './VotePage.css'
import type { CommunityTabRoute } from './RecipePage'

type VotePageProps = {
  onBack: () => void
  onSelectTab: (tab: CommunityTabRoute) => void
}

type VoteOption = {
  label: string
  percent: number
  highlighted?: boolean
}

type VoteCard = {
  id: string
  title: string
  subtitle: string
  reward?: string
  highlighted?: boolean
  participants: number
  remaining: string
  options: string[]
}

const tabs: { id: CommunityTabRoute; label: string }[] = [
  { id: 'recipe', label: '레시피 공유' },
  { id: 'free', label: '자유게시판' },
  { id: 'vote', label: '투표' },
]

const seasonalVoteOptions: VoteOption[] = [
  { label: '비빔밥', percent: 34.7 },
  { label: '냉국수', percent: 47.4, highlighted: true },
  { label: '샐러드', percent: 17.8 },
]

const voteCards: VoteCard[] = [
  {
    id: 'vote-1',
    title: '내일 뭐 싸지?',
    subtitle: '내일 점심 도시락 메뉴 추천해주세요',
    reward: '1P',
    highlighted: true,
    participants: 742,
    remaining: '23시간',
    options: ['김치볶음밥', '불고기 덮밥', '계란말이 도시락'],
  },
  {
    id: 'vote-2',
    title: '가장 실패한 도시락은?',
    subtitle: '실패 경험 공유해요',
    reward: '1P',
    participants: 879,
    remaining: '5시간',
    options: ['물기 많은 반찬', '비린내 나는 생선', '식어서 굳은 밥'],
  },
]

const weeklyTopVotes = [
  { rank: 1, title: '내일 뭐 싸지?', people: 742 },
  { rank: 2, title: '여름철 도시락 추천', people: 1313 },
  { rank: 3, title: '가장 실패한 도시락은?', people: 879 },
]

function VoteMetaIcon({ kind }: { kind: 'people' | 'clock' }) {
  if (kind === 'people') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="9" r="2.6" />
        <circle cx="16.3" cy="10" r="2.1" />
        <path d="M4.7 16.5c.6-2.4 2.7-4 5.3-4s4.8 1.6 5.4 4" />
        <path d="M14.3 15.4c.5-1.6 1.8-2.6 3.4-2.8 1.3-.2 2.6.2 3.6 1.2" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.3" />
      <path d="M12 7.7v4.8l3.4 2" />
    </svg>
  )
}

function VotePage({ onBack, onSelectTab }: VotePageProps) {
  return (
    <main className="page-scroll vote-page">
      <section className="vote-page-topbar">
        <button type="button" aria-label="커뮤니티로 돌아가기" onClick={onBack}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m14.7 5.6-6.2 6.2 6.2 6.2" />
          </svg>
        </button>
        <h1>투표</h1>
      </section>

      <div className="vote-page-tabs" role="tablist" aria-label="커뮤니티 카테고리">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === 'vote'}
            onClick={() => onSelectTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="vote-page-filters">
        <button type="button" className="is-active">진행 중</button>
        <button type="button">종료된 투표</button>
      </div>

      <section className="vote-page-list" aria-label="투표 목록">
        <article className="vote-card vote-card--result">
          <h2>여름철 도시락 추천</h2>
          <p className="vote-card-subtitle">더울 때 먹기 좋은 메뉴는?</p>

          <div className="vote-result-list">
            {seasonalVoteOptions.map((option) => (
              <article className={`vote-result-item${option.highlighted ? ' is-highlighted' : ''}`} key={option.label}>
                <span className="vote-result-item__progress" style={{ width: `${option.percent}%` }} />
                <div className="vote-result-item__row">
                  <strong>{option.label}</strong>
                  <span>{option.percent.toFixed(1)}%</span>
                </div>
              </article>
            ))}
          </div>

          <div className="vote-card-meta">
            <span>
              <VoteMetaIcon kind="people" />
              1313명
            </span>
            <span>
              <VoteMetaIcon kind="clock" />
              종료
            </span>
          </div>
        </article>

        {voteCards.map((card, index) => (
          <article className="vote-card" key={card.id}>
            <div className="vote-card-title-row">
              <div className="vote-card-title-wrap">
                <h2>{card.title}</h2>
                {card.reward && <span className="vote-card-reward">{card.reward}</span>}
              </div>
              {card.highlighted && <span className="vote-card-trend">↗</span>}
            </div>

            <p className="vote-card-subtitle">{card.subtitle}</p>

            <div className="vote-choice-list">
              {card.options.map((option) => (
                <button type="button" key={option}>{option}</button>
              ))}
            </div>

            <div className="vote-card-footer">
              <div className="vote-card-meta">
                <span>
                  <VoteMetaIcon kind="people" />
                  {card.participants}명
                </span>
                <span>
                  <VoteMetaIcon kind="clock" />
                  {card.remaining}
                </span>
              </div>
              {index === 0 && (
                <button type="button" className="vote-submit-button">투표하기</button>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="vote-weekly">
        <h2>주간 인기 투표</h2>
        <ol>
          {weeklyTopVotes.map((item) => (
            <li key={item.rank}>
              <span className="vote-weekly-rank">{item.rank}</span>
              <p>{item.title}</p>
              <span className="vote-weekly-count">{item.people}명</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}

export default VotePage
