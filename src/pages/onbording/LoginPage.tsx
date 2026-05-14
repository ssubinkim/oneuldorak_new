import { useState, type FormEvent } from 'react'
import LoginActionButtons from '../../components/onbording/loginpage/LoginActionButtons'
import LoginInputField from '../../components/onbording/loginpage/LoginInputField'
import LoginWelcome from '../../components/onbording/loginpage/LoginWelcome'
import SocialLoginOptions from '../../components/onbording/loginpage/SocialLoginOptions'
import { saveUserProfile } from '../../components/common/useUserProfile'
import '../../styles/Tailwind.css'
import './LoginPage.css'

const dummyAccount = {
  id: 'dorak_friends@oneuldorak.com',
  nickname: '도락프렌즈',
  password: 'saijohjyo123',
}

const LOGIN_REQUIRED_MESSAGE = '아이디와 비밀번호를 입력해주세요.'

function LoginPage() {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const clearLoginError = () => {
    if (loginError) {
      setLoginError('')
    }
  }

  const handleLoginIdChange = (value: string) => {
    setLoginId(value)
    clearLoginError()
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    clearLoginError()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedLoginId = loginId.trim()
    const trimmedPassword = password.trim()

    if (!trimmedLoginId || !trimmedPassword) {
      setLoginError(LOGIN_REQUIRED_MESSAGE)
      return
    }

    saveUserProfile({
      email: trimmedLoginId,
      nickname: dummyAccount.nickname,
    })
    window.location.hash = '#/home'
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
              onChange={handleLoginIdChange}
            />
            <LoginInputField
              label="비밀번호"
              icon="lock"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />

            <p className="login-page__error" role="alert">{loginError}</p>

            <LoginActionButtons />
          </form>

          <SocialLoginOptions />
        </section>
      </main>
    </div>
  )
}

export default LoginPage
