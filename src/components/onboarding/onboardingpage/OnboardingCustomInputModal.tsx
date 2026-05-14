import './OnboardingCustomInputModal.css'

type OnboardingCustomInputModalProps = {
  draftText: string
  label?: string
  onClose: () => void
  onConfirm: () => void
  onDraftChange: (value: string) => void
}

function OnboardingCustomInputModal({
  draftText,
  label = '기타 사항을 입력해주세요',
  onClose,
  onConfirm,
  onDraftChange,
}: OnboardingCustomInputModalProps) {
  return (
    <div className="onboarding-custom-modal">
      <div className="onboarding-custom-modal__backdrop" onClick={onClose} />
      <div className="onboarding-custom-modal__sheet">
        <p className="onboarding-custom-modal__label">{label}</p>
        <input
          className="onboarding-custom-modal__input"
          type="text"
          placeholder="직접 입력해주세요"
          value={draftText}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onConfirm()}
          autoFocus
        />
        <button className="onboarding-custom-modal__confirm" type="button" onClick={onConfirm}>
          확인
        </button>
      </div>
    </div>
  )
}

export default OnboardingCustomInputModal
