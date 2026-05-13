type RecipeDetailMethodProps = {
  heroImage: string
  stepIcon: string
  steps: string[]
}

function RecipeDetailMethod({ heroImage, stepIcon, steps }: RecipeDetailMethodProps) {
  return (
    <section className="recipe-detail-section recipe-detail-method">
      <h2>조리 방법</h2>

      <button type="button" className="recipe-detail-video" aria-label="숏츠로 먼저 보기">
        <img src={heroImage} alt="" aria-hidden="true" />
        <span className="recipe-detail-video__play" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m9 7 8 5-8 5V7Z" />
          </svg>
        </span>
        <span>숏츠로 먼저 보기</span>
      </button>

      <div className="recipe-detail-step-list">
        {steps.map((step, index) => (
          <article className="recipe-detail-step" key={step}>
            <div className="recipe-detail-step__copy">
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
            <div className="recipe-detail-step__image" aria-hidden="true">
              <img src={stepIcon} alt="" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RecipeDetailMethod
