import MediaActions from './MediaActions'
import { boardCategories } from './writeFormData'
import WriteTextareaField from './WriteTextareaField'
import WriteTextField from './WriteTextField'
import type { BoardWriteData } from './writeTypes'
import './WriteFormCommon.css'
import './BoardWriteForm.css'

type BoardWriteFormProps = {
  value: BoardWriteData
  onChange: (value: BoardWriteData) => void
}

function BoardWriteForm({ value, onChange }: BoardWriteFormProps) {
  const updateValue = (nextValue: Partial<BoardWriteData>) => {
    onChange({ ...value, ...nextValue })
  }

  return (
    <>
      <section className="community-write-section community-write-section--compact">
        <h2>카테고리</h2>
        <div className="community-write-category-row">
          {boardCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={value.category === category ? 'is-active' : undefined}
              onClick={() => updateValue({ category })}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <WriteTextField
        label="제목"
        placeholder="예 ) 요플레 유통기한이 내일까지에요."
        maxLength={50}
        value={value.title}
        onChange={(event) => updateValue({ title: event.target.value })}
      />

      <WriteTextareaField
        label="내용"
        placeholder="도시락 이야기, 꿀팁, 궁금한 점을 자유롭게 적어주세요."
        maxLength={100}
        value={value.content}
        onChange={(event) => updateValue({ content: event.target.value })}
      />

      <MediaActions value={value.media} onChange={(media) => updateValue({ media })} />
    </>
  )
}

export default BoardWriteForm
