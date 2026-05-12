import MediaActions from './MediaActions'
import { difficultyLevels } from './writeFormData'
import WriteInlineInputRow from './WriteInlineInputRow'
import WriteSelectRow from './WriteSelectRow'
import WriteTextareaField from './WriteTextareaField'
import WriteTextField from './WriteTextField'
import type { RecipeWriteData } from './writeTypes'
import './WriteFormCommon.css'
import './RecipeWriteForm.css'

type RecipeWriteFormProps = {
  value: RecipeWriteData
  onChange: (value: RecipeWriteData) => void
}

function RecipeWriteForm({ value, onChange }: RecipeWriteFormProps) {
  const updateValue = (nextValue: Partial<RecipeWriteData>) => {
    onChange({ ...value, ...nextValue })
  }

  return (
    <>
      <WriteTextField
        label="제목"
        placeholder="예 ) 10분 내로 만드는 직장인 만능 도시락"
        value={value.title}
        onChange={(event) => updateValue({ title: event.target.value })}
      />

      <WriteTextareaField
        label="내용"
        placeholder="도시락 메뉴에 대한 설명을 간단하게 적어주세요."
        value={value.content}
        onChange={(event) => updateValue({ content: event.target.value })}
      />

      <section className="community-write-section">
        <h2>도시락 정보</h2>

        <div className="community-write-info-row">
          <span>난이도</span>
          <div className="community-write-stars" aria-label={`난이도 ${value.difficulty}점`}>
            {difficultyLevels.map((level) => (
              <button
                key={level}
                type="button"
                className={level <= value.difficulty ? 'is-active' : undefined}
                aria-label={`${level}점`}
                onClick={() => updateValue({ difficulty: level })}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <WriteSelectRow
          label="예산"
          value={value.budget}
          options={['5,000원 이하', '5,000원 ~ 8,000원', '8,000원 이상']}
          onChange={(budget) => updateValue({ budget })}
        />

        <WriteSelectRow
          label="시간"
          value={value.time}
          options={['10분 내외', '20분 내외', '30분 이상']}
          onChange={(time) => updateValue({ time })}
        />

        <WriteInlineInputRow
          label="재료"
          placeholder="입력해주세요."
          addLabel="재료 추가"
          value={value.ingredient}
          onChange={(event) => updateValue({ ingredient: event.target.value })}
        />
      </section>

      <section className="community-write-section">
        <h2>추가 기능</h2>
        <MediaActions />
      </section>
    </>
  )
}

export default RecipeWriteForm
