import type { TextareaHTMLAttributes } from 'react'
import FieldLabel from './FieldLabel'
import './WriteFormCommon.css'

type WriteTextareaFieldProps = {
  label: string
} & TextareaHTMLAttributes<HTMLTextAreaElement>

function WriteTextareaField({ label, ...textareaProps }: WriteTextareaFieldProps) {
  const maxLength = typeof textareaProps.maxLength === 'number' ? textareaProps.maxLength : undefined
  const valueLength = getFieldValueLength(textareaProps.value ?? textareaProps.defaultValue)

  return (
    <div className="community-write-field">
      <FieldLabel>{label}</FieldLabel>
      <textarea {...textareaProps} />
      {maxLength ? (
        <span className="community-write-counter">
          {valueLength} / {maxLength}
        </span>
      ) : null}
    </div>
  )
}

function getFieldValueLength(value: unknown) {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).length
  }

  return 0
}

export default WriteTextareaField
