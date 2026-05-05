import './RecipeDetailPage.css'

type RecipeDetailPageProps = {
  recipeId: string | null
  onBack: () => void
}

const ingredients = ['밥1공기', '김치1/2컵', '참기름1큰술', '계란1개', '김가루약간']

const steps = [
  '팬에 참기름을 두르고 김치를 볶습니다.',
  '김치가 익으면 밥을 넣고 같이 볶습니다.',
  '계란 프라이를 만듭니다.',
  '볶음밥을 도시락에 담고 계란을 올립니다.',
  '김가루를 뿌려 완성합니다.',
]

const comments = [
  { user: '요리왕', time: '10분 전', text: '진짜 맛있어요! 내일 당장 해먹을게요' },
  { user: '도시락러버', time: '1시간 전', text: '참기름 대신 들기름 써도 되나요?' },
  { user: '절약왕', time: '2시간 전', text: '3000원이면 진짜 저렴하네요' },
]

function RecipeDetailPage({ recipeId, onBack }: RecipeDetailPageProps) {
  const recipeName = recipeId === 'recipe-2'
    ? '냉동실 파먹기 레시피'
    : recipeId === 'recipe-3'
      ? '5분 완성 간단 볶음밥'
      : '3000원으로 만드는 도시락'

  return (
    <main className="page-scroll recipe-detail-page">
      <section className="recipe-detail-topbar">
        <button type="button" aria-label="레시피 목록으로 돌아가기" onClick={onBack}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m14.7 5.6-6.2 6.2 6.2 6.2" />
          </svg>
        </button>
        <div className="recipe-detail-topbar__actions">
          <button type="button" aria-label="공유하기">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="6" cy="12" r="2" />
              <circle cx="17.5" cy="6" r="2" />
              <circle cx="17.5" cy="18" r="2" />
              <path d="M7.8 11.1 15.7 7M7.8 12.9 15.7 17" />
            </svg>
          </button>
          <button type="button" aria-label="북마크">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.1 4.8h9.8a1.4 1.4 0 0 1 1.4 1.4v13.9l-6.3-3.4-6.3 3.4V6.2a1.4 1.4 0 0 1 1.4-1.4Z" />
            </svg>
          </button>
        </div>
      </section>

      <div className="recipe-detail-hero" aria-label="레시피 대표 이미지">
        레시피 이미지
      </div>

      <section className="recipe-detail-content">
        <div className="recipe-detail-title-row">
          <h1>{recipeName}</h1>
          <span>↗</span>
        </div>

        <p className="recipe-detail-meta">절약킹 · 2시간 전</p>

        <div className="recipe-detail-stats">
          <span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.8 5.6a5 5 0 0 0-7 0L12 7.4l-1.7-1.8a5 5 0 0 0-7.1 7l1.8 1.8L12 21l7.1-6.6 1.7-1.8a5 5 0 0 0 0-7Z" />
            </svg>
            156
          </span>
          <span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4.5 6.2h15a1.7 1.7 0 0 1 1.7 1.7v8.4a1.7 1.7 0 0 1-1.7 1.7H9.8L5.4 21V7.9a1.7 1.7 0 0 1 1.7-1.7Z" />
            </svg>
            42
          </span>
        </div>

        <p className="recipe-detail-summary">
          저렴한 재료로 든든하게 만들 수 있는 도시락이에요. 김치만 있으면 뚝딱!
        </p>

        <div className="recipe-detail-info-grid">
          <article>
            <p>🕒 조리시간</p>
            <strong>15분</strong>
          </article>
          <article>
            <p>💲 예상식비</p>
            <strong className="is-price">3,000원</strong>
          </article>
          <article>
            <p>👩🏻‍🍳 난이도</p>
            <strong>쉬움</strong>
          </article>
        </div>

        <h2>재료</h2>
        <ul className="recipe-detail-ingredients">
          {ingredients.map((ingredient) => (
            <li key={ingredient}>
              <span>{ingredient}</span>
              <button type="button" aria-label={`${ingredient} 장바구니 추가`}>
                +
              </button>
            </li>
          ))}
        </ul>

        <p className="recipe-detail-tip">💡 재료를 장바구니에 담으면 오늘도락 페이지에서 확인할 수 있어요</p>

        <button type="button" className="recipe-detail-cart-button">
          🛒 전체 재료 장바구니 담기 (0/5)
        </button>

        <h2 className="recipe-detail-method-title">조리 방법</h2>
        <div className="recipe-detail-method-list">
          {steps.map((step, index) => (
            <article className="recipe-detail-step" key={`${step}-${index}`}>
              <span className="recipe-detail-step__index">{index + 1}</span>
              <div className="recipe-detail-step__image">레시피 이미지</div>
              <p>{step}</p>
            </article>
          ))}
        </div>

        <div className="recipe-detail-comments">
          <div className="recipe-detail-comments__header">
            <h2>댓글 3</h2>
            <span>댓글 작성 시 1P 적립</span>
          </div>
          <div className="recipe-detail-comments__list">
            {comments.map((comment) => (
              <article key={`${comment.user}-${comment.time}`}>
                <h3>
                  {comment.user}
                  <span>{comment.time}</span>
                </h3>
                <p>{comment.text}</p>
              </article>
            ))}
          </div>

          <div className="recipe-detail-comment-input">
            <input type="text" placeholder="댓글을 입력하세요" />
            <button type="button">작성</button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default RecipeDetailPage
