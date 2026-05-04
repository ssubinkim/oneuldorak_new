type RecipePreviewCardProps = {
  title: string
}

// 인기글 레시피 탭에서 가로로 보여주는 레시피 미리보기 카드입니다.
export function RecipePreviewCard({ title }: RecipePreviewCardProps) {
  return (
    <article className="recipe-preview-card">
      <div className="recipe-preview-card__image" aria-hidden="true" />
      <p>{title}</p>
    </article>
  )
}
