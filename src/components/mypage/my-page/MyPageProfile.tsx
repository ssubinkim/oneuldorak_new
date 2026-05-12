import { useUserProfile } from '../../common/useUserProfile'
import './MyPageProfile.css'

type MyPageProfileProps = {
  profileImg: string
}

function MyPageProfile({ profileImg }: MyPageProfileProps) {
  const { email, nickname } = useUserProfile()

  return (
    <div className="mypage-profile">
      <div className="mypage-avatar">
        <img src={profileImg} alt="프로필" />
      </div>
      <div>
        <div className="mypage-user-level">LV.요리조준</div>
        <div className="mypage-user-name">{nickname}</div>
        <div className="mypage-user-email">{email}</div>
      </div>
    </div>
  )
}

export default MyPageProfile
