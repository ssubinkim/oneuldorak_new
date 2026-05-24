import { createPortal } from 'react-dom'
import './VoteConfirmModal.css'

type VoteConfirmModalProps = {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

function VoteConfirmModal({ isOpen, onCancel, onConfirm }: VoteConfirmModalProps) {
  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="vote-confirm-modal" role="presentation" onClick={onCancel}>
      <section
        className="vote-confirm-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vote-confirm-title"
        aria-describedby="vote-confirm-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="vote-confirm-title">이대로 투표할까요?</h2>
        <p id="vote-confirm-desc">투표 후에는 선택을 바꿀 수 없어요.</p>
        <div className="vote-confirm-modal__actions">
          <button type="button" className="vote-confirm-modal__cancel" onClick={onCancel}>
            취소
          </button>
          <button type="button" className="vote-confirm-modal__confirm" onClick={onConfirm}>
            확인
          </button>
        </div>
      </section>
    </div>,
    document.body
  )
}

export default VoteConfirmModal
