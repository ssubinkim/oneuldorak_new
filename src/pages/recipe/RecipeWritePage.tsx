import { useState } from 'react'
import RecipeWriteForm from '../../components/community/communitywritepage/RecipeWriteForm'
import WriteTopIcon from '../../components/community/communitywritepage/WriteTopIcon'
import type { RecipeWriteData } from '../../components/community/communitywritepage/writeTypes'
import '../../pages/community/CommunityWritePage.css'

const emptyRecipeData: RecipeWriteData = {
  title: '',
  content: '',
  difficulty: 0,
  budget: '',
  time: '',
  ingredient: '',
  tools: [],
  media: [],
}

export default function RecipeWritePage() {
  const [formValues, setFormValues] = useState<RecipeWriteData>(emptyRecipeData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBack = () => { window.location.hash = '#/recipe' }

  const handleSubmit = () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    window.alert('레시피가 등록되었어요!')
    window.location.hash = '#/recipe'
  }

  return (
    <div className="app-shell">
      <main className="app-screen page-scroll community-write-page" style={{ top: 0, paddingBottom: 0 }}>
        <div className="community-write-hero" style={{ paddingTop: 16 }}>
          <div className="community-write-hero-main">
            <button className="community-write-top-button" type="button" aria-label="뒤로가기" onClick={handleBack}>
              <WriteTopIcon kind="back" />
            </button>
            <div className="community-write-hero-copy">
              <p>나만의 레시피를 공유해보세요!</p>
            </div>
          </div>
        </div>

        <section className="community-write-card">
          <div className="community-write-form">
            <RecipeWriteForm value={formValues} onChange={setFormValues} />
          </div>
          <button
            className="community-write-submit"
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            등록하기
          </button>
        </section>
      </main>
    </div>
  )
}
