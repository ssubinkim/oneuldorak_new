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
  heading?: string
  question: string
  subtitle?: string
  reward?: string
  participants: number
  deadline: string
  options: VoteOption[]
}

type VoteListProps = {
  filter: VoteFilter
  variant?: 'featured' | 'list'
}

const voteCards: VoteCardItem[] = [
  {
    id: 'vote-today',
    heading: '오늘의 투표',
    question: '여름철 도시락으로 뭐가 더 좋을까요?',
    reward: '+1p',
    participants: 53,
    deadline: '~ 2026.05.18 18:00',
    options: [
      { label: '샐러드 파스타', votes: 18 },
      { label: '사과 브리치즈 샌드위치', votes: 13 },
      { label: '오이 참치 주먹밥', votes: 12 },
      { label: '닭가슴살 샐러드 랩', votes: 10 },
    ],
  },
  {
    id: 'vote-fail',
    question: '가장 실패한 도시락은?',
    subtitle: '실패 경험 공유해요ㅎㅎㅎ',
    reward: '+1p',
    participants: 53,
    deadline: '~ 2026.05.18 18:00',
    options: [
      { label: '물기 많은 반찬', votes: 20 },
      { label: '비린내 나는 생선', votes: 17 },
      { label: '식어서 굳은 밥', votes: 16 },
    ],
  },
  {
    id: 'vote-monday',
    question: '월요일 점심 메뉴는?',
    subtitle: '한 주 시작에 가장 먹고 싶은 도시락을 골라주세요',
    reward: '+1p',
    participants: 53,
    deadline: '~ 2026.05.18 18:00',
    options: [
      { label: '참치마요 덮밥', votes: 19 },
      { label: '닭가슴살 샐러드', votes: 18 },
      { label: '소시지 야채볶음', votes: 16 },
    ],
  },
  {
    id: 'vote-side',
    question: '도시락 필수 반찬은?',
    subtitle: '하나만 넣을 수 있다면 무엇을 고를까요?',
    reward: '+1p',
    participants: 53,
    deadline: '~ 2026.05.18 18:00',
    options: [
      { label: '계란말이', votes: 21 },
      { label: '멸치볶음', votes: 15 },
      { label: '진미채', votes: 17 },
    ],
  },
]

const endedVoteCards: VoteCardItem[] = [
  {
    id: 'vote-ended-summer',
    question: '지난주 가장 인기 있었던 여름 도시락은?',
    subtitle: '종료된 투표 결과예요',
    reward: '+1p',
    participants: 53,
    deadline: '종료',
    options: [
      { label: '비빔밥', votes: 14 },
      { label: '냉국수', votes: 25, highlighted: true },
      { label: '샐러드', votes: 14 },
    ],
  },
]

const getTotalVotes = (options: VoteOption[]) => (
  options.reduce((total, option) => total + option.votes, 0)
)

const getVotePercent = (votes: number, totalVotes: number) => {
  if (totalVotes === 0) {
    return 0
  }

  return (votes / totalVotes) * 100
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

function VoteResultItem({
  option,
  percent,
  isHighlighted,
  onSelect,
}: {
  option: VoteOption
  percent: number
  isHighlighted?: boolean
  onSelect?: (optionLabel: string) => void
}) {
  const content = (
    <>
      <span className="vote-result-item__progress" style={{ width: `${percent}%` }} />
      <div className="vote-result-item__row">
        <strong>{option.label}</strong>
        <span>{percent.toFixed(1)}% · {option.votes}표</span>
      </div>
    </>
  )

  if (onSelect) {
    return (
      <button
        type="button"
        className={`vote-result-item${isHighlighted ? ' is-highlighted' : ''}`}
        onClick={() => onSelect(option.label)}
      >
        {content}
      </button>
    )
  }

  return (
    <article className={`vote-result-item${isHighlighted ? ' is-highlighted' : ''}`}>
      {content}
    </article>
  )
}

function VoteResultList({
  options,
  selectedOption,
  onSelect,
}: {
  options: VoteOption[]
  selectedOption?: string
  onSelect?: (optionLabel: string) => void
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
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

function VoteCard({
  card,
  selectedOption,
  onVote,
  isEnded,
}: {
  card: VoteCardItem
  selectedOption?: string
  onVote: (cardId: string, optionLabel: string) => void
  isEnded?: boolean
}) {
  const votedOptions = getVotedOptions(card.options, selectedOption)

  return (
    <article className={`vote-card${card.heading ? ' vote-card--featured' : ''}`}>
      <div className="vote-card-title-wrap">
        <h2>{card.heading || `Q. ${card.question}`}</h2>
        {card.reward && <span className="vote-card-reward">{card.reward}</span>}
      </div>

      {card.heading && <p className="vote-card-question">Q. {card.question}</p>}
      {card.subtitle && <p className="vote-card-subtitle">{card.subtitle}</p>}

      {selectedOption || isEnded ? (
        <VoteResultList
          options={votedOptions}
          selectedOption={selectedOption}
          onSelect={isEnded ? undefined : (optionLabel) => onVote(card.id, optionLabel)}
        />
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

      <footer className="vote-card-footer">
        <span>현재 참여자 {card.participants}명</span>
        <span>{card.deadline}</span>
      </footer>
    </article>
  )
}

function VoteList({ filter, variant = 'list' }: VoteListProps) {
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({})

  const handleVote = (cardId: string, optionLabel: string) => {
    setSelectedVotes((prevSelectedVotes) => ({
      ...prevSelectedVotes,
      [cardId]: optionLabel,
    }))
  }

  const cards = (() => {
    if (variant === 'featured') {
      return voteCards.slice(0, 1)
    }

    if (filter === 'ended') {
      return endedVoteCards
    }

    return voteCards.slice(1)
  })()

  return (
    <section
      className={`vote-page-list vote-page-list--${variant}`}
      aria-label={variant === 'featured' ? '오늘의 투표' : '투표 목록'}
    >
      {cards.map((card) => (
        <VoteCard
          key={card.id}
          card={card}
          selectedOption={selectedVotes[card.id]}
          onVote={handleVote}
          isEnded={filter === 'ended'}
        />
      ))}
    </section>
  )
}

export default VoteList
