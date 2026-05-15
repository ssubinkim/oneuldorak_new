import { useUserProfile } from '../../common/useUserProfile'
import './MyPageProfile.css'

type MyPageProfileProps = {
  profileImg: string
}

function MyPageProfile({ profileImg }: MyPageProfileProps) {
  const { nickname } = useUserProfile()
  const displayName = nickname.includes('?') ? '도시락 러버' : nickname

  return (
    <div className="mypage-profile">
      <div className="mypage-avatar">
        <img src={profileImg} alt="프로필" />
      </div>
      <div className="mypage-user-summary">
        <div className="mypage-user-level">
          <span className="mypage-level-badge" aria-hidden="true" />
          재료줍줍
        </div>
        <div className="mypage-user-name">{displayName}</div>
      </div>
    </div>
  )
}

export default MyPageProfile
