import { useState } from 'react'
import './VoteList.css'

export type VoteFilter = 'active' | 'ended'

type VoteOption = {
  label: string
  votes: number
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
  options: VoteOption[]
}

type VoteListProps = {
  filter: VoteFilter
}

const getTotalVotes = (options: VoteOption[]) => (
  options.reduce((total, option) => total + option.votes, 0)
)

const getVotePercent = (votes: number, totalVotes: number) => {
  if (totalVotes === 0) {
    return 0
  }

  return (votes / totalVotes) * 100
}

const voteCards: VoteCardItem[] = [
  {
    id: 'vote-1',
    title: '내일 뭐 싸지?',
    subtitle: '내일 점심 도시락 메뉴 추천해주세요',
    reward: '1P',
    highlighted: true,
    participants: 742,
    remaining: '23시간',
    options: [
      { label: '김치볶음밥', votes: 218 },
      { label: '불고기 덮밥', votes: 301 },
      { label: '계란말이 도시락', votes: 223 },
    ],
  },
  {
    id: 'vote-2',
    title: '가장 실패한 도시락은?',
    subtitle: '실패 경험 공유해요',
    reward: '1P',
    participants: 879,
    remaining: '5시간',
    options: [
      { label: '물기 많은 반찬', votes: 354 },
      { label: '비린내 나는 생선', votes: 285 },
      { label: '식어서 굳은 밥', votes: 240 },
    ],
  },
  {
    id: 'vote-3',
    title: '월요일 점심 메뉴는?',
    subtitle: '한 주 시작에 가장 먹고 싶은 도시락을 골라주세요',
    reward: '1P',
    participants: 516,
    remaining: '2일',
    options: [
      { label: '참치마요 덮밥', votes: 197 },
      { label: '닭가슴살 샐러드', votes: 129 },
      { label: '소시지 야채볶음', votes: 190 },
    ],
  },
  {
    id: 'vote-4',
    title: '도시락 필수 반찬은?',
    subtitle: '하나만 넣을 수 있다면 무엇을 고를까요?',
    participants: 638,
    remaining: '3일',
    options: [
      { label: '계란말이', votes: 267 },
      { label: '멸치볶음', votes: 143 },
      { label: '진미채', votes: 228 },
    ],
  },
  {
    id: 'vote-5',
    title: '아침 준비 시간은?',
    subtitle: '도시락 준비에 쓸 수 있는 현실적인 시간을 알려주세요',
    reward: '2P',
    participants: 421,
    remaining: '12시간',
    options: [
      { label: '10분 안에 끝내기', votes: 181 },
      { label: '20분 정도는 가능', votes: 165 },
      { label: '전날 밤에 미리 준비', votes: 75 },
    ],
  },
]

const endedVoteOptions: VoteOption[] = [
  { label: '비빔밥', votes: 456 },
  { label: '냉국수', votes: 623, highlighted: true },
  { label: '샐러드', votes: 234 },
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
  const totalVotes = getTotalVotes(endedVoteOptions)

  return (
    <article className="vote-card vote-card--result">
      <h2>여름철 도시락 추천</h2>
      <p className="vote-card-subtitle">더울 때 먹기 좋은 메뉴는?</p>

      <div className="vote-result-list">
        {endedVoteOptions.map((option) => {
          const percent = getVotePercent(option.votes, totalVotes)

          return (
            <VoteResultItem
              key={option.label}
              option={option}
              percent={percent}
              isHighlighted={option.highlighted}
            />
          )
        })}
      </div>

      <div className="vote-card-meta">
        <span>
          <VoteMetaIcon kind="people" />
          {totalVotes}명
        </span>
        <span>
          <VoteMetaIcon kind="clock" />
          종료
        </span>
      </div>
    </article>
  )
}

function VoteResultItem({
  option,
  percent,
  isHighlighted,
}: {
  option: VoteOption
  percent: number
  isHighlighted?: boolean
}) {
  return (
    <article className={`vote-result-item${isHighlighted ? ' is-highlighted' : ''}`}>
      <span className="vote-result-item__progress" style={{ width: `${percent}%` }} />
      <div className="vote-result-item__row">
        <strong>{option.label}</strong>
        <span>{percent.toFixed(1)}% · {option.votes}표</span>
      </div>
    </article>
  )
}

function VoteResultList({
  options,
  selectedOption,
}: {
  options: VoteOption[]
  selectedOption?: string
}) {
  const totalVotes = getTotalVotes(options)

  return (
    <div className="vote-result-list">
      {options.map((option) => (
        <VoteResultItem
          key={option.label}
          option={option}
          percent={getVotePercent(option.votes, totalVotes)}
          isHighlighted={option.highlighted || option.label === selectedOption}
        />
      ))}
    </div>
  )
}

function getVotedOptions(options: VoteOption[], selectedOption?: string) {
  if (!selectedOption) {
    return options
  }

  return options.map((option) => ({
    ...option,
    votes: option.label === selectedOption ? option.votes + 1 : option.votes,
  }))
}

function ActiveVoteCard({
  card,
  selectedOption,
  onVote,
}: {
  card: VoteCardItem
  selectedOption?: string
  onVote: (cardId: string, optionLabel: string) => void
}) {
  const votedOptions = getVotedOptions(card.options, selectedOption)
  const totalParticipants = getTotalVotes(votedOptions)

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

      {selectedOption ? (
        <VoteResultList options={votedOptions} selectedOption={selectedOption} />
      ) : (
        <div className="vote-choice-list">
          {card.options.map((option) => (
            <button
              type="button"
              key={option.label}
              onClick={() => onVote(card.id, option.label)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      <div className="vote-card-footer">
        <div className="vote-card-meta">
          <span>
            <VoteMetaIcon kind="people" />
            {totalParticipants}명
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
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({})

  const handleVote = (cardId: string, optionLabel: string) => {
    setSelectedVotes((prevSelectedVotes) => ({
      ...prevSelectedVotes,
      [cardId]: optionLabel,
    }))
  }

  return (
    <section className="vote-page-list" aria-label="투표 목록">
      {filter === 'ended' && <EndedVoteCard />}

      {filter === 'active' && voteCards.map((card) => (
        <ActiveVoteCard
          key={card.id}
          card={card}
          selectedOption={selectedVotes[card.id]}
          onVote={handleVote}
        />
        ))}
    </section>
  )
}

export default VoteList
