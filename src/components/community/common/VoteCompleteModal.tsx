import dorakRewardImage from './images/dorak09.png'
import votePointImage from './images/community_vote_point.png'
import './VoteCompleteModal.css'

type VoteCompleteModalProps = {
  isOpen: boolean
  question: string
  selectedOption: string
  reward?: string
  onClose: () => void
}

function VoteCompleteModal({
  isOpen,
  question,
  selectedOption,
  reward,
  onClose,
}: VoteCompleteModalProps) {
  if (!isOpen) {
    return null
  }

  const rewardText = reward?.replace('+', '').replace(/p$/i, 'P') ?? '1P'

  return (
    <div className="vote-complete-modal" role="presentation" onClick={onClose}>
      <section
        className="vote-complete-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vote-complete-modal-title"
        aria-describedby="vote-complete-modal-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="vote-complete-modal__visual" aria-hidden="true">
          <img
            className="vote-complete-modal__burst"
            src={votePointImage}
            alt=""
          />
          <img
            className="vote-complete-modal__image"
            src={dorakRewardImage}
            alt=""
          />
        </div>
        <h2 id="vote-complete-modal-title">{rewardText} 적립 완료!</h2>
        <p id="vote-complete-modal-description">다른 투표도 참여해보세요</p>
        <p className="vote-complete-modal__sr-only">
          {question} 투표에서 {selectedOption} 항목을 선택했습니다.
        </p>
      </section>
    </div>
  )
}

export default VoteCompleteModal
