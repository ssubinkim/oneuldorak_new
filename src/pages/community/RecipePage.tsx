import CommunityWriteButton from '../../components/community/common/CommunityWriteButton'
import CommunityTabs from '../../components/community/common/CommunityTabs'
import RecipeList from '../../components/community/recipepage/RecipeList'
import type { CommunityTabRoute } from './CommunityTabRoute'
import './RecipePage.css'

type RecipePageProps = {
  onBack: () => void
  onSelectTab: (tab: CommunityTabRoute) => void
  onOpenDetail: (recipeId: string) => void
}

const filters = ['최신순', '인기순', '저예산', '10분 요리', '냉동 활용']

function RecipePage({ onBack, onSelectTab, onOpenDetail }: RecipePageProps) {
  return (
    <>
      <main className="page-scroll recipe-page">
        <section className="recipe-page__title-bar">
          <button type="button" aria-label="커뮤니티로 돌아가기" onClick={onBack}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14.7 5.6-6.2 6.2 6.2 6.2" />
            </svg>
          </button>
          <h1>레시피 공유</h1>
        </section>

        <CommunityTabs
          activeTab="recipe"
          className="recipe-page__tabs"
          onSelectTab={onSelectTab}
        />

        <div className="recipe-page__filters">
          {filters.map((filter, index) => (
            <button type="button" key={filter} className={index === 0 ? 'is-active' : undefined}>
              {filter}
            </button>
          ))}
        </div>

        <RecipeList onOpenDetail={onOpenDetail} />
      </main>

      <CommunityWriteButton className="recipe-page__fab" aria-label="글쓰기" />
    </>
  )
}

export default RecipePage
