import { useState, useRef } from 'react'
import { useUserProfile, saveUserProfile, getUserProfile } from '../../components/common/useUserProfile'
import profileImg from '../../assets/icons/profile 1.svg?url'
import arrowLeftIcon from '../../assets/icons/arrow_left.svg?url'
import './ProfileEditPage.css'

export default function ProfileEditPage() {
  const { nickname, email, password } = useUserProfile()
  const [nicknameVal, setNicknameVal] = useState(nickname)
  const [avatarSrc, setAvatarSrc] = useState<string>(profileImg)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatarSrc(url)
  }
  const [idVal, setIdVal] = useState('dorak_2030')
  const [idCheckDone, setIdCheckDone] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)

  const initialNickname = nickname
  const initialId = 'dorak_2030'

  const hasChanges = nicknameVal !== initialNickname || idVal !== initialId || avatarSrc !== profileImg

  const handleBack = () => {
    if (hasChanges) {
      setShowLeaveModal(true)
    } else {
      window.history.back()
    }
  }
  const [showPwModal, setShowPwModal] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwDone, setPwDone] = useState(false)

  const handleIdCheck = () => {
    setIdCheckDone(true)
  }

  const handlePwModalClose = () => {
    setShowPwModal(false)
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
    setPwError('')
  }

  const handlePwChange = () => {
    if (!currentPw || !newPw || !confirmPw) {
      setPwError('모든 항목을 입력해주세요.')
      return
    }
    const storedPw = getUserProfile().password ?? 'saijohjyo123'
    if (currentPw !== storedPw) {
      setPwError('현재 비밀번호가 올바르지 않아요.')
      return
    }
    if (newPw !== confirmPw) {
      setPwError('새 비밀번호가 일치하지 않아요.')
      return
    }
    saveUserProfile({ password: newPw })
    setPwDone(true)
    handlePwModalClose()
  }

  const handleSave = () => {
    saveUserProfile({ nickname: nicknameVal })
    sessionStorage.setItem('profile_saved', 'true')
    window.location.hash = '#/mypage'
  }

  return (
    <div className="app-shell">
      <div className="app-screen profile-edit-screen">

        <header className="profile-edit-topbar">
          <button
            type="button"
            className="profile-edit-topbar__btn"
            aria-label="뒤로가기"
            onClick={handleBack}
          >
            <img src={arrowLeftIcon} alt="" />
          </button>
          <h1 className="profile-edit-topbar__title">프로필 수정</h1>
          <div className="profile-edit-topbar__btn" aria-hidden="true" />
        </header>

        <div className="profile-edit-scroll">

          <div className="profile-edit-avatar-wrap">
            <div className="profile-edit-avatar">
              <img src={avatarSrc} alt="프로필" />
            </div>
            <button
              type="button"
              className="profile-edit-camera-btn"
              aria-label="사진 변경"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>

          <div className="profile-edit-body">

            <div className="profile-edit-section">
              <label className="profile-edit-label">닉네임</label>
              <div className="profile-edit-input profile-edit-nickname-wrap">
                <input
                  className="profile-edit-nickname-input"
                  value={nicknameVal}
                  maxLength={10}
                  onChange={(e) => setNicknameVal(e.target.value.slice(0, 10))}
                />
                <span className="profile-edit-char-count">{nicknameVal.length}/10</span>
              </div>
            </div>

            <div className="profile-edit-section">
              <label className="profile-edit-label">아이디</label>
              <div className="profile-edit-input-row">
                <input
                  className="profile-edit-input profile-edit-input--flex"
                  value={idVal}
                  onChange={(e) => { setIdVal(e.target.value); setIdCheckDone(false) }}
                />
                <button
                  type="button"
                  className={`profile-edit-action-btn${idCheckDone ? ' profile-edit-action-btn--done' : ''}`}
                  onClick={handleIdCheck}
                >
                  {idCheckDone ? '확인 완료' : '중복 확인'}
                </button>
              </div>
              {idCheckDone ? (
                <p className="profile-edit-id-success">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  아이디 수정이 완료되었어요!
                </p>
              ) : (
                <p className="profile-edit-hint">아이디는 14일에 1회 변경할 수 있어요.</p>
              )}
            </div>

            <div className="profile-edit-section">
              <label className="profile-edit-label">이메일</label>
              <div className="profile-edit-input profile-edit-input--disabled">
                <span className="profile-edit-email-text">{email}</span>
              </div>
            </div>

            <div className="profile-edit-section">
              <div className="profile-edit-label-row">
                <label className="profile-edit-label">비밀번호</label>
                <button
                  type="button"
                  className={`profile-edit-pw-link${pwDone ? ' done' : ''}`}
                  onClick={() => setShowPwModal(true)}
                >
                  {pwDone ? '변경 완료 ✓' : '변경하기'}
                </button>
              </div>
              <div className="profile-edit-input profile-edit-password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={showPassword ? (password ?? 'saijohjyo123') : '*'.repeat((password ?? 'saijohjyo123').length)}
                  readOnly
                />
                <button
                  type="button"
                  className="profile-edit-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="비밀번호 보기"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="button" className="profile-edit-withdraw">회원탈퇴</button>

          </div>

          <div className="profile-edit-footer">
            <button type="button" className="profile-edit-save-btn" onClick={handleSave}>
              저장하기
            </button>
          </div>

        </div>

        {/* 나가기 확인 모달 */}
        {showLeaveModal && (
          <div className="leave-modal-overlay">
            <div className="leave-modal">
              <p className="leave-modal-title">프로필 수정을 그만두시겠어요?</p>
              <p className="leave-modal-sub">변경한 내용은 저장되지 않아요.</p>
              <div className="leave-modal-actions">
                <button
                  type="button"
                  className="leave-modal-btn leave-modal-btn--leave"
                  onClick={() => window.history.back()}
                >
                  나가기
                </button>
                <button
                  type="button"
                  className="leave-modal-btn leave-modal-btn--stay"
                  onClick={() => setShowLeaveModal(false)}
                >
                  계속 수정하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 비밀번호 변경 모달 */}
        {showPwModal && (
          <div className="pw-modal-overlay" onClick={handlePwModalClose}>
            <div className="pw-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="pw-modal-title">비밀번호 변경</h2>

              <div className="pw-modal-field">
                <label className="pw-modal-label">현재 비밀번호</label>
                <input
                  type="password"
                  className="pw-modal-input"
                  placeholder="현재 비밀번호를 입력하세요"
                  value={currentPw}
                  onChange={(e) => { setCurrentPw(e.target.value); setPwError('') }}
                />
              </div>

              <div className="pw-modal-field">
                <label className="pw-modal-label">새 비밀번호</label>
                <input
                  type="password"
                  className="pw-modal-input"
                  placeholder="새 비밀번호를 입력하세요"
                  value={newPw}
                  onChange={(e) => { setNewPw(e.target.value); setPwError('') }}
                />
              </div>

              <div className="pw-modal-field">
                <label className="pw-modal-label">새 비밀번호 확인</label>
                <input
                  type="password"
                  className="pw-modal-input"
                  placeholder="새 비밀번호를 다시 입력하세요"
                  value={confirmPw}
                  onChange={(e) => { setConfirmPw(e.target.value); setPwError('') }}
                />
              </div>

              {pwError && <p className="pw-modal-error">{pwError}</p>}

              <div className="pw-modal-actions">
                <button type="button" className="pw-modal-btn pw-modal-btn--cancel" onClick={handlePwModalClose}>취소</button>
                <button type="button" className="pw-modal-btn pw-modal-btn--confirm" onClick={handlePwChange}>변경하기</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
