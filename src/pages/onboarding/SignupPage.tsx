import { useEffect, useRef, useState, type FormEvent } from 'react'
import SignupCharacterBanner from '../../components/onboarding/signuppage/SignupCharacterBanner'
import SignupInputField from '../../components/onboarding/signuppage/SignupInputField'
import SocialLoginOptions from '../../components/onboarding/loginpage/SocialLoginOptions'
import { saveUserProfile } from '../../components/common/useUserProfile'
import cameraIcon from '../../assets/icons/camera.svg?url'
import arrowRightIcon from '../../assets/icons/arrow_right.svg?url'
import carrotProImage from '../../assets/food_mascot/carrot_pro.png'
import blueProImage from '../../assets/food_mascot/blue_pro.png'
import strawProImage from '../../assets/food_mascot/straw_pro.png'
import eggProImage from '../../assets/food_mascot/egg_pro.png'
import broProImage from '../../assets/food_mascot/bro_pro.png'
import '../../styles/Tailwind.css'
import './SignupPage.css'

const dummySignupAccount = {
  name: '도락이',
  nickname: '도락프렌즈',
  email: 'dorak_friends@oneuldorak.com',
  password: 'saijohjyo123',
}

const avatarCharacterOptions = [
  { id: 'carrot', label: '당근 캐릭터', src: carrotProImage },
  { id: 'blue', label: '블루 캐릭터', src: blueProImage },
  { id: 'straw', label: '딸기 캐릭터', src: strawProImage },
  { id: 'egg', label: '달걀 캐릭터', src: eggProImage },
  { id: 'bro', label: '브로콜리 캐릭터', src: broProImage },
]

function SignupPage() {
  const [name, setName] = useState(dummySignupAccount.name)
  const [nickname, setNickname] = useState(dummySignupAccount.nickname)
  const [email, setEmail] = useState(dummySignupAccount.email)
  const [password, setPassword] = useState(dummySignupAccount.password)
  const [passwordConfirm, setPasswordConfirm] = useState(dummySignupAccount.password)
  const [passwordError, setPasswordError] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarObjectUrl, setAvatarObjectUrl] = useState<string | null>(null)
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null)
  const [isAvatarSheetOpen, setIsAvatarSheetOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (avatarObjectUrl) {
        URL.revokeObjectURL(avatarObjectUrl)
      }
    }
  }, [avatarObjectUrl])

  useEffect(() => {
    if (!isAvatarSheetOpen) return

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAvatarSheetOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscapeKey)

    return () => {
      window.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isAvatarSheetOpen])

  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    const nextAvatarUrl = URL.createObjectURL(selectedFile)
    if (avatarObjectUrl) {
      URL.revokeObjectURL(avatarObjectUrl)
    }

    setAvatarObjectUrl(nextAvatarUrl)
    setAvatarPreview(nextAvatarUrl)
    setSelectedCharacterId(null)
    setIsAvatarSheetOpen(false)
    event.target.value = ''
  }

  const handleCharacterSelect = (characterId: string, characterSrc: string) => {
    if (avatarObjectUrl) {
      URL.revokeObjectURL(avatarObjectUrl)
      setAvatarObjectUrl(null)
    }

    setAvatarPreview(characterSrc)
    setSelectedCharacterId(characterId)
    setIsAvatarSheetOpen(false)
  }

  const handleAlbumSelectClick = () => {
    setIsAvatarSheetOpen(false)
    fileInputRef.current?.click()
  }

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
      avatar: avatarPreview ?? undefined,
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

          <section className="signup-page__profile-section" aria-label="프로필 사진 설정">
            <button
              type="button"
              className="signup-page__avatar-button"
              aria-label="프로필 사진 선택"
              onClick={() => setIsAvatarSheetOpen(true)}
            >
              <span className="signup-page__avatar-surface">
                {avatarPreview ? (
                  <img
                    className={`signup-page__avatar-preview${selectedCharacterId ? ' is-character' : ''}`}
                    src={avatarPreview}
                    alt="선택한 프로필 사진"
                  />
                ) : (
                  <span className="signup-page__avatar-placeholder" aria-hidden="true">
                    <img src={cameraIcon} alt="" />
                  </span>
                )}
              </span>
              <span className="signup-page__avatar-plus" aria-hidden="true">+</span>
            </button>
            <input
              ref={fileInputRef}
              className="signup-page__avatar-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
            />
            <p className="signup-page__profile-title">프로필 사진을 설정해보세요!</p>
            <p className="signup-page__profile-description">나를 나타낼 수 있는 사진으로 프로필을 꾸며보세요.</p>
          </section>

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

          <SocialLoginOptions />
        </section>

        {isAvatarSheetOpen ? (
          <div
            className="signup-avatar-sheet-overlay"
            role="presentation"
            onClick={() => setIsAvatarSheetOpen(false)}
          >
            <section
              className="signup-avatar-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="signup-avatar-sheet-title"
              onClick={(event) => event.stopPropagation()}
            >
              <span className="signup-avatar-sheet__grab-handle" aria-hidden="true" />
              <h2 className="signup-avatar-sheet__title" id="signup-avatar-sheet-title">프로필 사진 선택</h2>
              <p className="signup-avatar-sheet__label">기본 캐릭터 선택</p>

              <ul className="signup-avatar-sheet__character-list">
                {avatarCharacterOptions.map((character) => {
                  const isSelected = selectedCharacterId === character.id
                  return (
                    <li key={character.id}>
                      <button
                        type="button"
                        className={`signup-avatar-sheet__character-button${isSelected ? ' is-selected' : ''}`}
                        aria-label={character.label}
                        onClick={() => handleCharacterSelect(character.id, character.src)}
                      >
                        <img src={character.src} alt="" />
                      </button>
                    </li>
                  )
                })}
              </ul>

              <button type="button" className="signup-avatar-sheet__album-button" onClick={handleAlbumSelectClick}>
                <span className="signup-avatar-sheet__album-content">
                  앨범에서 사진 선택
                </span>
                <img src={arrowRightIcon} alt="" aria-hidden="true" />
              </button>

              <button type="button" className="signup-avatar-sheet__cancel-button" onClick={() => setIsAvatarSheetOpen(false)}>
                취소
              </button>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  )
}

export default SignupPage
