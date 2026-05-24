import React, { useEffect, useRef, useState } from 'react'
import pointBgImage from './images/pointbg.png'
import { ArrowRightIcon } from '../../common/ui/ArrowRightIcon'
import { awardVotePoint } from '../../common/usePoints'
import VoteCompleteModal from '../common/VoteCompleteModal'
import VoteConfirmModal from '../common/VoteConfirmModal'
import VoteToast from '../common/VoteToast'
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
  description?: string
  author?: string
  authorId?: string
  reward?: string
  participants: number
  duration?: string
  deadline: string | (() => string)
  options: VoteOption[]
}

type VoteListProps = {
  filter: VoteFilter
  variant?: 'featured' | 'list'
  extraVotes?: VoteCardItem[]
  onMoreClick?: () => void
  focusVoteId?: string | null
  onFocusHandled?: () => void
}

const shownVoteModalIds = new Set<string>()

function hasShownVoteModal(voteId: string) {
  return shownVoteModalIds.has(voteId)
}

function markVoteModalShown(voteId: string) {
  shownVoteModalIds.add(voteId)
}

function getDeadline(dayOffset: number) {
  if (dayOffset === 0) return 'D-Day'
  return `D-${dayOffset}`
}

const voteCards: VoteCardItem[] = [
  {
    id: 'vote-today',
    heading: '도락이들의 선택은?',
    question: '오늘 점심 도시락으로 뭐가 좋을까요?',
    subtitle: '취향 투표하고 포인트까지 냠냠',
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
    heading: '도락이들의 선택은?',
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
    deadline: () => getDeadline(4),
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
  {
    id: 'vote-fridge',
    question: '냉장고에서 가장 자주 버리는 재료는?',
    reward: '+1p',
    participants: 41,
    deadline: () => getDeadline(8),
    options: [
      { label: '채소류 (대파, 시금치 등)', votes: 20 },
      { label: '두부', votes: 10 },
      { label: '남은 양념류', votes: 7 },
      { label: '과일', votes: 4 },
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
  if (totalVotes === 0) return 0
  return (votes / totalVotes) * 100
}

const getRewardPointAmount = (reward?: string) => {
  const rewardAmount = Number(reward?.match(/\d+/)?.[0] ?? 1)
  return Number.isFinite(rewardAmount) ? rewardAmount : 1
}

function getVotedOptions(options: VoteOption[], selectedOption?: string) {
  if (!selectedOption) return options
  return options.map((option) => ({
    ...option,
    votes: option.label === selectedOption ? option.votes + 1 : option.votes,
  }))
}

function VoteResultItem({
  option,
  percent,
  isLeading,
  isSelected,
  isDimmed,
  isCardVisible,
  onSelect,
}: {
  option: VoteOption
  percent: number
  isLeading?: boolean
  isSelected?: boolean
  isDimmed?: boolean
  isCardVisible?: boolean
  onSelect?: (optionLabel: string) => void
}) {
  const [isGaugeReady, setIsGaugeReady] = useState(false)

  useEffect(() => {
    if (!isCardVisible) return
    const frameId = window.requestAnimationFrame(() => {
      setIsGaugeReady(true)
    })
    return () => window.cancelAnimationFrame(frameId)
  }, [isCardVisible])

  const className = [
    'vote-result-item',
    isLeading ? 'is-leading' : '',
    isSelected ? 'is-selected' : '',
    isDimmed ? 'is-dimmed' : '',
  ].filter(Boolean).join(' ')

  const content = (
    <>
      <span
        className="vote-result-item__progress"
        style={{ width: isGaugeReady ? `${percent}%` : '0%' }}
      />
      <div className="vote-result-item__row">
        <strong>{option.label}</strong>
        <span>{percent.toFixed(1)}% · {option.votes}표</span>
      </div>
    </>
  )

  if (onSelect) {
    return (
      <button type="button" className={className} onClick={() => onSelect(option.label)}>
        {content}
      </button>
    )
  }

  return (
    <article className={className}>
      {content}
    </article>
  )
}

function VoteResultList({
  options,
  selectedOption,
  isCardVisible,
  onSelect,
}: {
  options: VoteOption[]
  selectedOption?: string
  isCardVisible?: boolean
  onSelect?: (optionLabel: string) => void
}) {
  const totalVotes = getTotalVotes(options)
  const maxVotes = Math.max(...options.map((o) => o.votes))

  return (
    <div className="vote-result-list">
      {options.map((option) => (
        <VoteResultItem
          key={option.label}
          option={option}
          percent={getVotePercent(option.votes, totalVotes)}
          isLeading={option.votes === maxVotes}
          isSelected={option.label === selectedOption}
          isDimmed={false}
          isCardVisible={isCardVisible}
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
  onMoreClick,
  dataVoteId,
  variant,
}: {
  card: VoteCardItem
  selectedOption?: string
  onVote: (cardId: string, optionLabel: string) => void
  isEnded?: boolean
  onMoreClick?: () => void
  dataVoteId?: string
  variant?: 'featured' | 'list'
}) {
  const isFeatured = Boolean(card.heading) && variant !== 'list'
  const cardRef = useRef<HTMLElement | HTMLDivElement>(null)
  const [isCardVisible, setIsCardVisible] = useState(isFeatured)

  useEffect(() => {
    if (isFeatured) return
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsCardVisible(true)
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isFeatured])

  const votedOptions = getVotedOptions(card.options, selectedOption)
  const deadlineText = typeof card.deadline === 'function' ? card.deadline() : card.deadline
  const participantCount = selectedOption ? card.participants + 1 : card.participants

  const choices = selectedOption || isEnded ? (
    <VoteResultList
      options={votedOptions}
      selectedOption={selectedOption}
      isCardVisible={isCardVisible}
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
  )

  const cardFooter = (
    <footer className="vote-card-footer">
      <span>현재 참여자 {participantCount}명</span>
      <span>{isEnded ? '투표 종료' : `투표 마감 ${deadlineText}`}</span>
    </footer>
  )

  if (isFeatured) {
    return (
      <div ref={cardRef as React.RefObject<HTMLDivElement>} className="vote-featured-section">
        <div className="vote-featured-section__header">
          <div className="vote-featured-section__title-group">
            <h2>{card.heading}</h2>
            {card.subtitle && (
              <p className="vote-featured-section__subtitle">{card.subtitle}</p>
            )}
          </div>
          {onMoreClick && (
            <button type="button" className="vote-featured-section__more" onClick={onMoreClick}>
              더보기 <ArrowRightIcon />
            </button>
          )}
        </div>
        <article className="vote-card vote-card--featured">
          <div className="vote-card-title-wrap">
            <p className="vote-card-question">Q. {card.question}</p>
            {card.reward && (
              <div className="vote-card-reward-wrap">
                <img className="vote-card-reward-img" src={pointBgImage} alt="" aria-hidden="true" />
                <span className="vote-card-reward-text">+1P</span>
              </div>
            )}
          </div>
          {choices}
          {cardFooter}
        </article>
      </div>
    )
  }

  return (
    <article ref={cardRef as React.RefObject<HTMLElement>} className="vote-card" data-vote-id={dataVoteId}>
      <div className="vote-card-title-wrap">
        <h3>{`Q. ${card.question}`}</h3>
        {card.reward && (
          <div className="vote-card-reward-wrap">
            <img className="vote-card-reward-img" src={pointBgImage} alt="" aria-hidden="true" />
            <span className="vote-card-reward-text">+1P</span>
          </div>
        )}
      </div>
      {choices}
      {cardFooter}
    </article>
  )
}

function VoteList({
  filter,
  variant = 'list',
  extraVotes = [],
  onMoreClick,
  focusVoteId = null,
  onFocusHandled,
}: VoteListProps) {
  const { selectedVotes, selectVoteOption } = useVoteSelections()
  const listRef = useRef<HTMLElement | null>(null)
  const [voteModal, setVoteModal] = useState<{
    question: string
    selectedOption: string
  } | null>(null)
  const [pendingVote, setPendingVote] = useState<{ cardId: string; optionLabel: string } | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const activeVoteCards = [...extraVotes, ...voteCards]

  const handleVoteClick = (cardId: string, optionLabel: string) => {
    if (selectedVotes[cardId]) {
      setToastMessage('이미 참여한 투표예요!')
      return
    }
    setPendingVote({ cardId, optionLabel })
  }

  const handleVoteCancel = () => {
    setPendingVote(null)
  }

  const handleVoteConfirm = () => {
    if (pendingVote) {
      handleVote(pendingVote.cardId, pendingVote.optionLabel)
    }
    setPendingVote(null)
  }

  const handleVote = (cardId: string, optionLabel: string) => {
    const selectedCard = activeVoteCards.find((card) => card.id === cardId)
    const hasSelectedOption = selectVoteOption(cardId, optionLabel)

    if (!hasSelectedOption) return

    if (selectedCard) {
      awardVotePoint(cardId, getRewardPointAmount(selectedCard.reward))

      if (hasShownVoteModal(cardId)) return

      markVoteModalShown(cardId)

      window.setTimeout(() => {
        setVoteModal({
          question: selectedCard.question,
          selectedOption: optionLabel,
        })
      }, 820)
    }
  }

  const cards = (() => {
    if (variant === 'featured') return voteCards.slice(0, 1)
    if (filter === 'ended') return endedVoteCards
    return [...extraVotes, ...voteCards.slice(1)]
  })()

  const hasFocusTarget =
    variant === 'list' &&
    filter === 'active' &&
    Boolean(focusVoteId && cards.some((card) => card.id === focusVoteId))

  useEffect(() => {
    if (!focusVoteId || !hasFocusTarget) return

    const targetCard = listRef.current?.querySelector<HTMLElement>(`[data-vote-id="${focusVoteId}"]`)
    if (!targetCard) return

    targetCard.classList.add('is-newly-created')
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
    onFocusHandled?.()

    const highlightTimer = window.setTimeout(() => {
      targetCard.classList.remove('is-newly-created')
    }, 2100)

    return () => window.clearTimeout(highlightTimer)
  }, [focusVoteId, hasFocusTarget, onFocusHandled])

  return (
    <section
      ref={listRef}
      className={`vote-page-list vote-page-list--${variant}`}
      aria-label={variant === 'featured' ? '오늘의 투표' : '투표 목록'}
    >
      {cards.map((card) => (
        <VoteCard
          key={card.id}
          card={card}
          selectedOption={selectedVotes[card.id]}
          onVote={handleVoteClick}
          isEnded={filter === 'ended'}
          onMoreClick={variant === 'featured' ? onMoreClick : undefined}
          dataVoteId={variant === 'list' ? card.id : undefined}
          variant={variant}
        />
      ))}

      <VoteToast message={toastMessage} onDismiss={() => setToastMessage(null)} />

      <VoteConfirmModal
        isOpen={pendingVote !== null}
        onCancel={handleVoteCancel}
        onConfirm={handleVoteConfirm}
      />

      <VoteCompleteModal
        isOpen={voteModal !== null}
        question={voteModal?.question ?? ''}
        selectedOption={voteModal?.selectedOption ?? ''}
        onClose={() => setVoteModal(null)}
      />
    </section>
  )
}

export default VoteList
