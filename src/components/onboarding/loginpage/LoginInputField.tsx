import { useState } from 'react'
import mailIcon from '../../../assets/icons/mail.svg'
import lockIcon from '../../../assets/icons/lock.svg'
import eyeIcon from '../../../assets/icons/eye.svg'
import eyeOffIcon from '../../../assets/icons/eye-off.svg'
import './LoginInputField.css'

type LoginInputFieldProps = {
  icon: 'mail' | 'lock'
  label: string
  onChange: (value: string) => void
  type: 'text' | 'password'
  value: string
}

function LoginInputField({ icon, label, onChange, type, value }: LoginInputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && isPasswordVisible ? 'text' : type

  return (
    <label className="login-input-field">
      <span className="login-input-field__icon">
        <img src={icon === 'mail' ? mailIcon : lockIcon} alt="" aria-hidden="true" />
      </span>
      <input
        className="login-input-field__input"
        type={inputType}
        placeholder={label}
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {isPassword ? (
        <button
          className="login-input-field__toggle"
          type="button"
          aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
          onClick={() => setIsPasswordVisible((value) => !value)}
        >
          <img src={isPasswordVisible ? eyeOffIcon : eyeIcon} alt="" aria-hidden="true" />
        </button>
      ) : null}
    </label>
  )
}

export default LoginInputField
