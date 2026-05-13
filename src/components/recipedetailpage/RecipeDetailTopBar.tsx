import { BackIcon, IconButton, StatIcon } from './RecipeDetailIcons'

type RecipeDetailTopBarProps = {
  onBack: () => void
}

function RecipeDetailTopBar({ onBack }: RecipeDetailTopBarProps) {
  return (
    <section className="recipe-detail-topbar" aria-label="레시피 상세 메뉴">
      <IconButton label="레시피 목록으로 돌아가기" onClick={onBack}>
        <BackIcon />
      </IconButton>

      <div className="recipe-detail-topbar__actions">
        <IconButton label="좋아요">
          <StatIcon type="heart" />
        </IconButton>
        <IconButton label="북마크">
          <StatIcon type="bookmark" />
        </IconButton>
        <IconButton label="공유하기">
          <StatIcon type="share" />
        </IconButton>
      </div>
    </section>
  )
}

export default RecipeDetailTopBar
