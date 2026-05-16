import { useState } from 'react'
import eyeIcon from '../../../assets/icons/eye.svg'
import eyeOffIcon from '../../../assets/icons/eye-off.svg'
import './SignupInputField.css'

type SignupInputFieldProps = {
  actionLabel?: string
  label: string
  onChange: (value: string) => void
  onActionClick?: () => void
  onShakeEnd?: () => void
  shouldShakeAction?: boolean
  type: 'email' | 'password' | 'text'
  value: string
}


function SignupInputField({ actionLabel, label, onChange, onActionClick, onShakeEnd, shouldShakeAction, type, value }: SignupInputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isActionChecked, setIsActionChecked] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && isPasswordVisible ? 'text' : type

  const handleActionClick = () => {
    if (value.trim()) {
      setIsActionChecked(true)
      onActionClick?.()
    }
  }

  return (
    <label className="signup-input-field">
      <input
        className="signup-input-field__input"
        type={inputType}
        placeholder={label}
        aria-label={label}
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
          setIsActionChecked(false)
        }}
      />

      {actionLabel ? (
        <button
          className={`signup-input-field__action${isActionChecked ? ' signup-input-field__action--checked' : ''}${shouldShakeAction ? ' signup-input-field__action--shake' : ''}`}
          type="button"
          onClick={handleActionClick}
          onAnimationEnd={onShakeEnd}
        >
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
          <img src={isPasswordVisible ? eyeOffIcon : eyeIcon} alt="" />
        </button>
      ) : null}
    </label>
  )
}

export default SignupInputField
