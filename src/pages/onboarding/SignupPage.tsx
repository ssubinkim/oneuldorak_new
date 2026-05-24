import { useState, type FormEvent } from 'react'
import SignupCharacterBanner from '../../components/onboarding/signuppage/SignupCharacterBanner'
import SignupInputField from '../../components/onboarding/signuppage/SignupInputField'
import SocialLoginOptions from '../../components/onboarding/loginpage/SocialLoginOptions'
import { saveUserProfile } from '../../components/common/useUserProfile'
import { initializePointsForSignup } from '../../components/common/usePoints'
import { markAttendanceStampPending } from '../../components/mypage/mypageAttendance'
import '../../styles/Tailwind.css'
import './SignupPage.css'

const dummySignupAccount = {
  name: '도락이',
  nickname: '도락프렌즈',
  email: 'dorak_friends@oneuldorak.com',
  password: 'saijohjyo123',
}

function SignupPage() {
  const [name, setName] = useState(dummySignupAccount.name)
  const [nickname, setNickname] = useState(dummySignupAccount.nickname)
  const [email, setEmail] = useState(dummySignupAccount.email)
  const [password, setPassword] = useState(dummySignupAccount.password)
  const [passwordConfirm, setPasswordConfirm] = useState(dummySignupAccount.password)
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim() || !nickname.trim() || !email.trim() || !password.trim() || !passwordConfirm.trim()) return
    if (password !== passwordConfirm) {
      setPasswordError('비밀번호가 일치하지 않아요.')
      return
    }

    saveUserProfile({
      email,
      name,
      nickname,
      isNew: true,
    })
    initializePointsForSignup()
    markAttendanceStampPending('signup')
    window.location.hash = '#/onboarding'
  }

  return (
    <div className="app-shell">
      <main className="app-screen signup-page-screen">
        <section className="signup-page" aria-label="회원가입">
          <div className="signup-page__content">
            <SignupCharacterBanner />
            <header className="signup-page__header">
              <h1>회원가입</h1>
              <p>오늘도락과 함께해요!</p>
            </header>

            <form className="signup-page__form" onSubmit={handleSubmit}>
              <SignupInputField label="이름" type="text" value={name} onChange={setName} />
              <SignupInputField label="닉네임" type="text" value={nickname} onChange={setNickname} />
              <SignupInputField label="이메일 주소" type="email" value={email} onChange={setEmail} />
              <SignupInputField label="비밀번호" type="password" value={password} onChange={(v) => { setPassword(v); setPasswordError('') }} />
              <SignupInputField label="비밀번호 확인" type="password" value={passwordConfirm} onChange={(v) => { setPasswordConfirm(v); setPasswordError('') }} />
              {passwordError && <p className="signup-page__error">{passwordError}</p>}

              <button className="signup-page__submit" type="submit">
                시작하기
              </button>
            </form>
          </div>

          <SocialLoginOptions dividerText="다른 방법으로 가입하기" />
        </section>
      </main>
    </div>
  )
}

export default SignupPage
