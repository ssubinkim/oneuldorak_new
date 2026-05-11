import './MyPageProfile.css'

type MyPageProfileProps = {
  profileImg: string
}

function MyPageProfile({ profileImg }: MyPageProfileProps) {
  return (
    <div className="mypage-profile">
      <div className="mypage-avatar">
        <img src={profileImg} alt="프로필" />
      </div>
      <div>
        <div className="mypage-user-level">LV.재료좀줌</div>
        <div className="mypage-user-name">도시락 러버</div>
        <div className="mypage-user-email">hyseah@gmail.com</div>
      </div>
    </div>
  )
}

export default MyPageProfile
