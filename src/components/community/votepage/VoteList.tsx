import './VoteList.css'

export type VoteFilter = 'active' | 'ended'

type VoteOption = {
  label: string
  percent: number
  highlighted?: boolean
}

type VoteCardItem = {
  id: string
  title: string
  subtitle: string
  reward?: string
  highlighted?: boolean
  participants: number
  remaining: string
  options: string[]
}

type VoteListProps = {
  filter: VoteFilter
}

const seasonalVoteOptions: VoteOption[] = [
  { label: '비빔밥', percent: 34.7 },
  { label: '냉국수', percent: 47.4, highlighted: true },
  { label: '샐러드', percent: 17.8 },
]

const voteCards: VoteCardItem[] = [
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

function EndedVoteCard() {
  return (
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
  )
}

function ActiveVoteCard({
  card,
}: {
  card: VoteCardItem
}) {
  return (
    <article className="vote-card">
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
      </div>
    </article>
  )
}

function VoteList({ filter }: VoteListProps) {
  return (
    <section className="vote-page-list" aria-label="투표 목록">
      {filter === 'ended' && <EndedVoteCard />}

      {filter === 'active' && voteCards.map((card) => (
        <ActiveVoteCard
          key={card.id}
          card={card}
        />
      ))}
    </section>
  )
}

export default VoteList
