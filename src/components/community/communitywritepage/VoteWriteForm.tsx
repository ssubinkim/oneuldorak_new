import WriteTopIcon from './WriteTopIcon'
import WriteTextareaField from './WriteTextareaField'
import WriteTextField from './WriteTextField'
import type { VoteWriteData } from './writeTypes'
import './WriteFormCommon.css'
import './VoteWriteForm.css'

type VoteWriteFormProps = {
  value: VoteWriteData
  onChange: (value: VoteWriteData) => void
}

function VoteWriteForm({ value, onChange }: VoteWriteFormProps) {
  const updateOption = (index: number, optionValue: string) => {
    onChange({
      ...value,
      options: value.options.map((option, optionIndex) => (optionIndex === index ? optionValue : option)),
    })
  }

  const addOption = () => {
    onChange({ ...value, options: [...value.options, ''] })
  }

  return (
    <>
      <WriteTextField
        label="제목"
        placeholder="예 ) 10분 내로 만드는 직장인 만능 도시락"
        value={value.title}
        onChange={(event) => onChange({ ...value, title: event.target.value })}
      />

      <WriteTextareaField
        label="내용"
        placeholder="투표에 대한 설명을 간단하게 적어주세요."
        value={value.content}
        onChange={(event) => onChange({ ...value, content: event.target.value })}
      />

      <section className="community-write-section community-write-vote-options">
        <div className="community-write-option-row">
          <span>보기</span>
          <input
            type="text"
            placeholder="입력해주세요."
            value={value.options[0] ?? ''}
            onChange={(event) => updateOption(0, event.target.value)}
          />
        </div>

        {value.options.slice(1).map((option, index) => {
          const optionIndex = index + 1
          const isLastOption = optionIndex === value.options.length - 1

          return (
            <div className="community-write-option-row community-write-option-row--nested" key={optionIndex}>
              <input
                type="text"
                placeholder="입력해주세요."
                value={option}
                onChange={(event) => updateOption(optionIndex, event.target.value)}
              />
              {isLastOption && (
                <button type="button" aria-label="보기 추가" onClick={addOption}>
                  <WriteTopIcon kind="plus" />
                </button>
              )}
            </div>
          )
        })}

        <p className="community-write-helper">
          <span aria-hidden="true">✓</span>
          2개 이상 적어주세요
        </p>
      </section>
    </>
  )
}

export default VoteWriteForm
