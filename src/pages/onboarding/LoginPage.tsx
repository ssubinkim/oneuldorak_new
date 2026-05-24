import { useState, type FormEvent } from 'react'
import LoginActionButtons from '../../components/onboarding/loginpage/LoginActionButtons'
import LoginInputField from '../../components/onboarding/loginpage/LoginInputField'
import LoginSignupModal from '../../components/onboarding/loginpage/LoginSignupModal'
import LoginWelcome from '../../components/onboarding/loginpage/LoginWelcome'
import SocialLoginOptions from '../../components/onboarding/loginpage/SocialLoginOptions'
import { saveUserProfile } from '../../components/common/useUserProfile'
import { initializePointsForLogin } from '../../components/common/usePoints'
import { markAttendanceStampPending } from '../../components/mypage/mypageAttendance'
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
      initializePointsForLogin()
      markAttendanceStampPending('login')
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

      <LoginSignupModal
        open={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onGoSignup={handleGoToOnboarding}
      />
    </div>
  )
}

export default LoginPage
