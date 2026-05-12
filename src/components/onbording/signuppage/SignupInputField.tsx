import { useState } from 'react'
import './SignupInputField.css'

type SignupInputFieldProps = {
  actionLabel?: string
  label: string
  onChange: (value: string) => void
  type: 'email' | 'password' | 'text'
  value: string
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M2.8 12s3.4-5.5 9.2-5.5 9.2 5.5 9.2 5.5-3.4 5.5-9.2 5.5S2.8 12 2.8 12Z" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  )
}

function SignupInputField({ actionLabel, label, onChange, type, value }: SignupInputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && isPasswordVisible ? 'text' : type

  return (
    <label className="signup-input-field">
      <input
        className="signup-input-field__input"
        type={inputType}
        placeholder={label}
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />

      {actionLabel ? (
        <button className="signup-input-field__action" type="button">
          {actionLabel}
        </button>
      ) : null}

      {isPassword ? (
        <button
          className="signup-input-field__toggle"
          type="button"
          aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
          onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
        >
          <EyeIcon />
        </button>
      ) : null}
    </label>
  )
}

export default SignupInputField
