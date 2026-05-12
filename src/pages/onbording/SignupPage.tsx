import { useState, type FormEvent } from 'react'
import SignupCharacterBanner from '../../components/onbording/signuppage/SignupCharacterBanner'
import SignupInputField from '../../components/onbording/signuppage/SignupInputField'
import SocialLoginOptions from '../../components/onbording/loginpage/SocialLoginOptions'
import { saveUserProfile } from '../../components/common/useUserProfile'
import '../../styles/Tailwind.css'
import './SignupPage.css'

const dummySignupAccount = {
  name: '도락이',
  nickname: '도락프렌즈',
  email: 'dorak_friends@oneuldorak.com',
  password: 'saijohjyo123',
}

function SignupPage() {
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleDummyAccountClick = () => {
    setName(dummySignupAccount.name)
    setNickname(dummySignupAccount.nickname)
    setEmail(dummySignupAccount.email)
    setPassword(dummySignupAccount.password)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    saveUserProfile({
      email,
      name,
      nickname,
    })
    window.location.hash = '#/onboarding'
  }

  return (
    <div className="app-shell">
      <main className="app-screen signup-page-screen">
        <section className="signup-page" aria-label="회원가입">
          <SignupCharacterBanner />

          <header className="signup-page__header">
            <h1>회원가입</h1>
            <p>오늘도락과 함께해요!</p>
          </header>

          <form className="signup-page__form" onSubmit={handleSubmit}>
            <SignupInputField label="이름" type="text" value={name} onChange={setName} />
            <SignupInputField
              label="닉네임"
              type="text"
              value={nickname}
              onChange={setNickname}
              actionLabel="중복확인"
            />
            <SignupInputField label="이메일 주소" type="email" value={email} onChange={setEmail} />
            <SignupInputField label="비밀번호" type="password" value={password} onChange={setPassword} />

            <button className="signup-page__dummy-button" type="button" onClick={handleDummyAccountClick}>
              더미 계정 넣기
              <span aria-hidden="true">›</span>
            </button>

            <button className="signup-page__submit" type="submit">
              시작하기
            </button>
          </form>

          <SocialLoginOptions />
        </section>
      </main>
    </div>
  )
}

export default SignupPage
