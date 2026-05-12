import type { TextareaHTMLAttributes } from 'react'
import FieldLabel from './FieldLabel'
import './WriteFormCommon.css'

type WriteTextareaFieldProps = {
  label: string
} & TextareaHTMLAttributes<HTMLTextAreaElement>

function WriteTextareaField({ label, ...textareaProps }: WriteTextareaFieldProps) {
  return (
    <div className="community-write-field">
      <FieldLabel>{label}</FieldLabel>
      <textarea {...textareaProps} />
    </div>
  )
}

export default WriteTextareaField
