import { useUserProfile } from '../../common/useUserProfile'
import carrotPro from '../../../assets/food_mascot/carrot_pro.png'
import broPro from '../../../assets/food_mascot/bro_pro.png'
import strawPro from '../../../assets/food_mascot/straw_pro.png'
import eggPro from '../../../assets/food_mascot/egg_pro.png'
import bluePro from '../../../assets/food_mascot/blue_pro.png'
import './MyPageProfile.css'

type MyPageProfileProps = {
  profileImg: string
}

const PRO_MASCOT_OPTIONS = [carrotPro, broPro, strawPro, eggPro, bluePro]

function MyPageProfile({ profileImg }: MyPageProfileProps) {
  const { nickname } = useUserProfile()
  const displayName = nickname.includes('?') ? '도시락 러버' : nickname
  const isProMascot = PRO_MASCOT_OPTIONS.includes(profileImg)

  return (
    <div className="mypage-profile">
      <div className={`mypage-avatar${isProMascot ? ' is-mascot' : ''}`}>
        <img
          src={profileImg}
          alt="프로필"
          width={58}
          height={58}
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          className={`mypage-avatar__image${isProMascot ? ' is-mascot' : ''}`}
        />
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
