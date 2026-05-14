import WriteTopIcon from './WriteTopIcon'
import WriteSelectRow from './WriteSelectRow'
import WriteTextareaField from './WriteTextareaField'
import WriteTextField from './WriteTextField'
import {
  MAX_VOTE_OPTION_COUNT,
  normalizeVoteOption,
  type VoteWriteData,
} from './writeTypes'
import './WriteFormCommon.css'
import './VoteWriteForm.css'

type VoteWriteFormProps = {
  value: VoteWriteData
  onChange: (value: VoteWriteData) => void
}

const voteDurationOptions = ['오늘까지', '1일', '3일', '7일']

function VoteWriteForm({ value, onChange }: VoteWriteFormProps) {
  const voteOptions = value.options.slice(0, MAX_VOTE_OPTION_COUNT)

  const updateOption = (index: number, optionValue: string) => {
    const normalizedOptionValue = normalizeVoteOption(optionValue)
    const hasSameOption = normalizedOptionValue
      ? voteOptions.some(
          (option, optionIndex) =>
            optionIndex !== index && normalizeVoteOption(option) === normalizedOptionValue,
        )
      : false

    if (hasSameOption) {
      return
    }

    onChange({
      ...value,
      options: voteOptions.map((option, optionIndex) => (optionIndex === index ? optionValue : option)),
    })
  }

  const addOption = () => {
    if (voteOptions.length >= MAX_VOTE_OPTION_COUNT) {
      return
    }

    onChange({ ...value, options: [...voteOptions, ''] })
  }

  const removeOption = (index: number) => {
    if (voteOptions.length <= 2) {
      return
    }

    onChange({
      ...value,
      options: voteOptions.filter((_, optionIndex) => optionIndex !== index),
    })
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
        {voteOptions.map((option, optionIndex) => {
          const canRemoveOption = voteOptions.length > 2
          const rowClassName = [
            'community-write-option-row',
            optionIndex > 0 ? 'community-write-option-row--nested' : '',
            canRemoveOption ? 'is-removable' : '',
          ].filter(Boolean).join(' ')

          return (
            <div className={rowClassName} key={optionIndex}>
              {optionIndex === 0 && <span>보기</span>}
              <input
                type="text"
                placeholder="입력해주세요."
                value={option}
                onChange={(event) => updateOption(optionIndex, event.target.value)}
              />
              {canRemoveOption && (
                <button
                  type="button"
                  className="community-write-option-remove"
                  aria-label={`${option || `보기 ${optionIndex + 1}`} 삭제`}
                  onClick={() => removeOption(optionIndex)}
                >
                  <WriteTopIcon kind="remove" />
                </button>
              )}
            </div>
          )
        })}

        {voteOptions.length < MAX_VOTE_OPTION_COUNT && (
          <button type="button" className="community-write-option-add" onClick={addOption}>
            <WriteTopIcon kind="plus" />
            보기 추가
          </button>
        )}

        <p className="community-write-helper">
          <span aria-hidden="true">✓</span>
          2개 이상, 최대 5개까지 적어주세요
        </p>
      </section>

      <section className="community-write-section community-write-vote-duration">
        <WriteSelectRow
          label="기간"
          value={value.duration}
          options={voteDurationOptions}
          onChange={(duration) => onChange({ ...value, duration })}
        />
      </section>
    </>
  )
}

export default VoteWriteForm
