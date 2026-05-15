import './LoginActionButtons.css'

function LoginActionButtons() {
  const handleSignupClick = () => {
    window.location.hash = '#/signup'
  }

  return (
    <div className="login-action-buttons">
      <button className="login-action-buttons__button login-action-buttons__button--primary" type="submit">
        로그인
      </button>
      <button
        className="login-action-buttons__button login-action-buttons__button--secondary"
        type="button"
        onClick={handleSignupClick}
      >
        회원가입
      </button>
    </div>
  )
}

export default LoginActionButtons
