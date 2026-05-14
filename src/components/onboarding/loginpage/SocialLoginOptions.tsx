import googleIcon from '../../../assets/icons/google.svg'
import kakaoIcon from '../../../assets/icons/kakao.svg'
import naverIcon from '../../../assets/icons/naver.svg'
import './SocialLoginOptions.css'

const socialOptions = [
  { label: '구글 로그인', icon: googleIcon, className: 'social-login-options__button--google' },
  { label: '네이버 로그인', icon: naverIcon, className: 'social-login-options__button--naver' },
  { label: '카카오 로그인', icon: kakaoIcon, className: 'social-login-options__button--kakao' },
]

function SocialLoginOptions() {
  return (
    <div className="social-login-options" aria-label="소셜 로그인">
      <div className="social-login-options__divider">
        <span>또는</span>
      </div>

      <div className="social-login-options__list">
        {socialOptions.map((option) => (
          <button
            className={`social-login-options__button ${option.className}`}
            type="button"
            aria-label={option.label}
            key={option.label}
          >
            <img src={option.icon} alt="" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default SocialLoginOptions
