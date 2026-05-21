import { useState, type FormEvent } from 'react'
import LoginActionButtons from '../../components/onboarding/loginpage/LoginActionButtons'
import LoginInputField from '../../components/onboarding/loginpage/LoginInputField'
import LoginWelcome from '../../components/onboarding/loginpage/LoginWelcome'
import SocialLoginOptions from '../../components/onboarding/loginpage/SocialLoginOptions'
import { saveUserProfile } from '../../components/common/useUserProfile'
import '../../styles/Tailwind.css'
import './LoginPage.css'

const dummyAccount = {
  id: 'dorak_friends@oneuldorak.com',
  nickname: '도락프렌즈',
  password: 'saijohjyo123',
}

function LoginPage() {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [showSignupModal, setShowSignupModal] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedLoginId = loginId.trim()
    const trimmedPassword = password.trim()

    if (!trimmedLoginId || !trimmedPassword) return

    if (trimmedLoginId === dummyAccount.id && trimmedPassword === dummyAccount.password) {
      saveUserProfile({
        email: dummyAccount.id,
        nickname: dummyAccount.nickname,
        password: dummyAccount.password,
        isNew: false,
      })
      window.location.hash = '#/home'
      return
    }

    setShowSignupModal(true)
  }

  const handleGoToOnboarding = () => {
    window.location.hash = '#/signup'
  }

  return (
    <div className="app-shell">
      <main className="app-screen login-page-screen">
        <section className="login-page" aria-label="로그인">
          <LoginWelcome />

          <form className="login-page__form" onSubmit={handleSubmit}>
            <LoginInputField
              label="이메일 또는 아이디"
              icon="mail"
              type="text"
              value={loginId}
              onChange={setLoginId}
            />
            <LoginInputField
              label="비밀번호"
              icon="lock"
              type="password"
              value={password}
              onChange={setPassword}
            />

            <button
              className="login-page__dummy-fill"
              type="button"
              onClick={() => {
                setLoginId(dummyAccount.id)
                setPassword(dummyAccount.password)
              }}
            >
              더미 계정 넣기
              <span aria-hidden="true">›</span>
            </button>

<LoginActionButtons />
          </form>

          <SocialLoginOptions />
        </section>
      </main>

      {showSignupModal && (
        <div
          className="login-signup-modal"
          role="presentation"
          onClick={() => setShowSignupModal(false)}
        >
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
                onClick={handleGoToOnboarding}
              >
                회원가입 하러가기
              </button>
              <button
                className="login-signup-modal__button login-signup-modal__button--secondary"
                type="button"
                onClick={() => setShowSignupModal(false)}
              >
                닫기
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default LoginPage
