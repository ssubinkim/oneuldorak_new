import { useRef, useState } from 'react'
import { awardVotePoint } from '../../common/usePoints'
import VoteCompleteModal from '../common/VoteCompleteModal'
import { useVoteSelections } from './useVoteSelections'
import './VoteList.css'

export type VoteFilter = 'active' | 'ended'

export type VoteOption = {
  label: string
  votes: number
  highlighted?: boolean
}

export type VoteCardItem = {
  id: string
  heading?: string
  question: string
  subtitle?: string
  reward?: string
  participants: number
  deadline: string | (() => string)
  options: VoteOption[]
}

type VoteListProps = {
  filter: VoteFilter
  variant?: 'featured' | 'list'
  extraVotes?: VoteCardItem[]
}

const DAY_MS = 24 * 60 * 60 * 1000

function getSeoulDate(dayOffset = 0) {
  const targetDate = new Date(Date.now() + dayOffset * DAY_MS)
  const dateParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(targetDate)
  const year = dateParts.find((part) => part.type === 'year')?.value ?? ''
  const month = dateParts.find((part) => part.type === 'month')?.value ?? ''
  const day = dateParts.find((part) => part.type === 'day')?.value ?? ''

  return `${year}.${month}.${day}`
}

function getDeadline(dayOffset: number, time = '18:00') {
  return `~ ${getSeoulDate(dayOffset)} ${time}`
}

const voteCards: VoteCardItem[] = [
  {
    id: 'vote-today',
    heading: '오늘의 투표',
    question: '오늘 점심 도시락으로 뭐가 좋을까요?',
    reward: '+1p',
    participants: 53,
    deadline: () => getDeadline(0),
    options: [
      { label: '에그마요 샌드위치', votes: 18 },
      { label: '치킨 브리또 도시락', votes: 13 },
      { label: '참치 주먹밥', votes: 12 },
      { label: '샐러드 도시락', votes: 10 },
    ],
  },
  {
    id: 'vote-fail',
    question: '가장 실패 없는 도시락 메뉴는?',
    subtitle: '실패 경험을 공유해요',
    reward: '+1p',
    participants: 44,
    deadline: () => getDeadline(2),
    options: [
      { label: '불고기 덮밥', votes: 16 },
      { label: '계란말이 도시락', votes: 15 },
      { label: '소시지 야채볶음', votes: 13 },
    ],
  },
  {
    id: 'vote-monday',
    question: '월요일 점심 메뉴는?',
    subtitle: '한 주를 시작할 때 가장 먹고 싶은 도시락을 골라주세요',
    reward: '+1p',
    participants: 62,
    deadline: () => getDeadline(4, '12:00'),
    options: [
      { label: '참치마요 덮밥', votes: 22 },
      { label: '샐러드 파스타', votes: 21 },
      { label: '소시지 볶음밥', votes: 19 },
    ],
  },
  {
    id: 'vote-side',
    question: '도시락 필수 반찬은?',
    subtitle: '하나만 넣을 수 있다면 무엇을 고를까요?',
    reward: '+1p',
    participants: 48,
    deadline: () => getDeadline(6),
    options: [
      { label: '계란말이', votes: 18 },
      { label: '멸치볶음', votes: 16 },
      { label: '진미채', votes: 14 },
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
  {
    id: 'vote-ended-breakfast',
    question: '아침 도시락으로 가장 든든했던 메뉴는?',
    subtitle: '지난 투표에서 많이 선택된 메뉴예요',
    participants: 68,
    deadline: '종료',
    options: [
      { label: '계란말이 주먹밥', votes: 31, highlighted: true },
      { label: '참치마요 샌드위치', votes: 22 },
      { label: '과일컵', votes: 15 },
    ],
  },
  {
    id: 'vote-ended-budget',
    question: '가성비 도시락 재료 1위는?',
    subtitle: '오늘도락 유저들이 고른 절약 재료예요',
    participants: 74,
    deadline: '종료',
    options: [
      { label: '두부', votes: 24 },
      { label: '계란', votes: 36, highlighted: true },
      { label: '콩나물', votes: 14 },
    ],
  },
  {
    id: 'vote-ended-side',
    question: '냉장고에 있으면 든든한 밑반찬은?',
    subtitle: '종료된 밑반찬 선호도 결과예요',
    participants: 61,
    deadline: '종료',
    options: [
      { label: '진미채', votes: 18 },
      { label: '멸치볶음', votes: 27, highlighted: true },
      { label: '무생채', votes: 16 },
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

const getRewardPointAmount = (reward?: string) => {
  const rewardAmount = Number(reward?.match(/\d+/)?.[0] ?? 1)

  return Number.isFinite(rewardAmount) ? rewardAmount : 1
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
  const deadlineText = typeof card.deadline === 'function' ? card.deadline() : card.deadline
  const participantCount = selectedOption ? card.participants + 1 : card.participants

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
        <span>현재 참여자 {participantCount}명</span>
        <span>{deadlineText}</span>
      </footer>
    </article>
  )
}

function VoteList({ filter, variant = 'list', extraVotes = [] }: VoteListProps) {
  const { selectedVotes, selectVoteOption } = useVoteSelections()
  const [voteModal, setVoteModal] = useState<{
    question: string
    selectedOption: string
    reward?: string
  } | null>(null)
  const shownVoteModalIdsRef = useRef<Set<string>>(new Set())
  const activeVoteCards = [...extraVotes, ...voteCards]

  const handleVote = (cardId: string, optionLabel: string) => {
    const selectedCard = activeVoteCards.find((card) => card.id === cardId)

    selectVoteOption(cardId, optionLabel)

    if (selectedCard && !shownVoteModalIdsRef.current.has(cardId)) {
      shownVoteModalIdsRef.current.add(cardId)

      if (awardVotePoint(cardId, getRewardPointAmount(selectedCard.reward))) {
        setVoteModal({
          question: selectedCard.question,
          selectedOption: optionLabel,
          reward: selectedCard.reward,
        })
      }
    }
  }

  const cards = (() => {
    if (variant === 'featured') {
      return voteCards.slice(0, 1)
    }

    if (filter === 'ended') {
      return endedVoteCards
    }

    return [...extraVotes, ...voteCards.slice(1)]
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

      <VoteCompleteModal
        isOpen={voteModal !== null}
        question={voteModal?.question ?? ''}
        selectedOption={voteModal?.selectedOption ?? ''}
        reward={voteModal?.reward}
        onClose={() => setVoteModal(null)}
      />
    </section>
  )
}

export default VoteList
