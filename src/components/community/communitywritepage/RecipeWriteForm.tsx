import { useState } from 'react'
import starOffIcon from '../../../assets/icons/star_off.svg'
import starOnIcon from '../../../assets/icons/star_on.svg'
import { ingredientOptions } from '../../onboarding/onboardingpage/onboardingQuestionData'
import MediaActions from './MediaActions'
import { difficultyLevels } from './writeFormData'
import WriteInlineInputRow from './WriteInlineInputRow'
import WriteSelectRow from './WriteSelectRow'
import WriteTextareaField from './WriteTextareaField'
import WriteTextField from './WriteTextField'
import type { RecipeWriteData } from './writeTypes'
import './WriteFormCommon.css'
import './RecipeWriteForm.css'

const REMOVE_FEEDBACK_MS = 140

type RecipeWriteFormProps = {
  value: RecipeWriteData
  onChange: (value: RecipeWriteData) => void
}

function getSelectedIngredients(value: string) {
  return value
    .split(',')
    .map((ingredient) => ingredient.trim())
    .filter(Boolean)
}

function RecipeWriteForm({ value, onChange }: RecipeWriteFormProps) {
  const [toolText, setToolText] = useState('')
  const [isIngredientPickerOpen, setIsIngredientPickerOpen] = useState(false)
  const [removingIngredients, setRemovingIngredients] = useState<string[]>([])
  const [removingTools, setRemovingTools] = useState<string[]>([])
  const selectedIngredients = getSelectedIngredients(value.ingredient)

  const updateValue = (nextValue: Partial<RecipeWriteData>) => {
    onChange({ ...value, ...nextValue })
  }

  const updateIngredients = (nextIngredients: string[]) => {
    updateValue({ ingredient: nextIngredients.join(', ') })
  }

  const handleToggleIngredientPicker = () => {
    setIsIngredientPickerOpen((isOpen) => !isOpen)
  }

  const handleToggleIngredient = (ingredient: string) => {
    const nextIngredients = selectedIngredients.includes(ingredient)
      ? selectedIngredients.filter((item) => item !== ingredient)
      : [...selectedIngredients, ingredient]

    updateIngredients(nextIngredients)
  }

  const handleRemoveIngredient = (ingredient: string) => {
    if (removingIngredients.includes(ingredient)) {
      return
    }

    setRemovingIngredients((items) => [...items, ingredient])
    window.setTimeout(() => {
      updateIngredients(selectedIngredients.filter((item) => item !== ingredient))
      setRemovingIngredients((items) => items.filter((item) => item !== ingredient))
    }, REMOVE_FEEDBACK_MS)
  }

  const handleAddTool = () => {
    const nextTool = toolText.trim()

    if (!nextTool || value.tools.includes(nextTool)) {
      setToolText('')
      return
    }

    updateValue({ tools: [...value.tools, nextTool] })
    setToolText('')
  }

  const handleRemoveTool = (tool: string) => {
    if (removingTools.includes(tool)) {
      return
    }

    setRemovingTools((items) => [...items, tool])
    window.setTimeout(() => {
      updateValue({ tools: value.tools.filter((item) => item !== tool) })
      setRemovingTools((items) => items.filter((item) => item !== tool))
    }, REMOVE_FEEDBACK_MS)
  }

  return (
    <>
      <WriteTextField
        label="제목"
        placeholder="예) 10분대로 만드는 직장인 만능 도시락"
        maxLength={50}
        value={value.title}
        onChange={(event) => updateValue({ title: event.target.value })}
      />

      <WriteTextareaField
        label="내용"
        placeholder="레시피 메뉴에 대한 설명을 간단하게 적어주세요."
        maxLength={100}
        value={value.content}
        onChange={(event) => updateValue({ content: event.target.value })}
      />

      <MediaActions value={value.media} onChange={(media) => updateValue({ media })} />

      <section className="community-write-section community-write-recipe-info">
        <h2>도시락 정보 </h2>

        <div className="community-write-info-row">
          <span>난이도</span>
          <div className="community-write-stars" aria-label={`난이도 ${value.difficulty}점`}>
            {difficultyLevels.map((level) => {
              const isActive = level <= value.difficulty

              return (
                <button
                  key={level}
                  type="button"
                  className={isActive ? 'is-active' : undefined}
                  aria-label={`난이도 ${level}점`}
                  onClick={() => updateValue({ difficulty: level })}
                >
                  <img src={isActive ? starOnIcon : starOffIcon} alt="" aria-hidden="true" />
                </button>
              )
            })}
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
          placeholder="재료를 선택해주세요."
          addLabel="재료 추가"
          value={value.ingredient}
          readOnly
          onClick={() => setIsIngredientPickerOpen(true)}
          onAdd={handleToggleIngredientPicker}
        />

        {isIngredientPickerOpen && (
          <div className="community-write-ingredient-picker" aria-label="재료 선택">
            {ingredientOptions.map((ingredient) => {
              const isSelected = selectedIngredients.includes(ingredient.label)

              return (
                <button
                  type="button"
                  className={isSelected ? 'is-selected' : undefined}
                  aria-pressed={isSelected}
                  key={ingredient.label}
                  onClick={() => handleToggleIngredient(ingredient.label)}
                >
                  {ingredient.icon ? (
                    <img src={ingredient.icon} alt="" aria-hidden="true" />
                  ) : (
                    <span className="community-write-ingredient-picker__spacer" aria-hidden="true" />
                  )}
                  <span>{ingredient.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {selectedIngredients.length > 0 && (
          <div className="community-write-chip-list" aria-label="선택한 재료">
            {selectedIngredients.map((ingredient) => (
              <span
                key={ingredient}
                className={[
                  'community-write-chip',
                  removingIngredients.includes(ingredient) ? 'is-removing' : '',
                ].filter(Boolean).join(' ')}
              >
                {ingredient}
                <button
                  type="button"
                  aria-label={`${ingredient} 삭제`}
                  onClick={() => handleRemoveIngredient(ingredient)}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        )}

        <WriteInlineInputRow
          label="도구"
          placeholder="예) 프라이팬"
          addLabel="조리 도구 추가"
          value={toolText}
          onChange={(event) => setToolText(event.target.value)}
          onAdd={handleAddTool}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleAddTool()
            }
          }}
        />

        {value.tools.length > 0 && (
          <div className="community-write-chip-list" aria-label="추가한 조리 도구">
            {value.tools.map((tool) => (
              <span
                key={tool}
                className={[
                  'community-write-chip',
                  removingTools.includes(tool) ? 'is-removing' : '',
                ].filter(Boolean).join(' ')}
              >
                {tool}
                <button type="button" aria-label={`${tool} 삭제`} onClick={() => handleRemoveTool(tool)}>
                  x
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

    </>
  )
}

export default RecipeWriteForm
