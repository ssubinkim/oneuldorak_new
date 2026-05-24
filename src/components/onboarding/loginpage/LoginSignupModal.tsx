type LoginSignupModalProps = {
  open: boolean
  onClose: () => void
  onGoSignup: () => void
}

function LoginSignupModal({ open, onClose, onGoSignup }: LoginSignupModalProps) {
  if (!open) return null

  return (
    <div className="login-signup-modal" role="presentation" onClick={onClose}>
      <section
        className="login-signup-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="login-signup-modal__emoji" aria-hidden="true">🚀</p>
        <h2 id="signup-modal-title" className="login-signup-modal__title">
          아직 도락이가 아니에요!
        </h2>
        <p className="login-signup-modal__desc">
          회원가입하고 나만의 도시락 추천을 받아보세요.
        </p>
        <div className="login-signup-modal__actions">
          <button
            className="login-signup-modal__button login-signup-modal__button--primary"
            type="button"
            onClick={onGoSignup}
          >
            회원가입 하러가기
          </button>
          <button
            className="login-signup-modal__button login-signup-modal__button--secondary"
            type="button"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </section>
    </div>
  )
}

export default LoginSignupModal
