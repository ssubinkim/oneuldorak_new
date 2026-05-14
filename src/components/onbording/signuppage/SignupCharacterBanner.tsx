import signupDorakImage from '../images/signup_dorak.png'
import './SignupCharacterBanner.css'

function SignupCharacterBanner() {
  return (
    <div className="signup-character-banner" aria-hidden="true">
      <img src={signupDorakImage} alt="" />
    </div>
  )
}

export default SignupCharacterBanner
