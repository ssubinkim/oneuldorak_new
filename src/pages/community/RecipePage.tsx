import CommunityStickyHeader from '../../components/community/common/CommunityStickyHeader'
import PopularRecipeSection from '../../components/community/common/PopularRecipeSection'
import useCommunityHeaderCollapse from '../../components/community/common/useCommunityHeaderCollapse'
import CommunityBanner from '../../components/community/communitypage/CommunityBanner'
import { popularRecipes } from '../../components/community/communitypage/communityData'
import RecipeList, { type RecipeItem } from '../../components/community/recipepage/RecipeList'
import dorakTipMascot from '../../assets/food_mascot_all/dorak07.svg'
import type { CommunityTabRoute } from './CommunityTabRoute'
import './RecipePage.css'

type RecipePageProps = {
  onSelectTab: (tab: CommunityTabRoute) => void
  onOpenDetail: (recipeId: string) => void
  extraRecipes?: RecipeItem[]
}

const filters = ['인기순', '최신순', '가격순', '시간순', '난이도순']

function RecipePage({ onSelectTab, onOpenDetail, extraRecipes = [] }: RecipePageProps) {
  const { isHeaderCompact, handleCommunityScroll } = useCommunityHeaderCollapse()

  return (
    <main className="page-scroll recipe-page" onScroll={handleCommunityScroll}>
      <CommunityBanner />
      <CommunityStickyHeader
        activeTab="recipe"
        tabsClassName="community-tabs"
        isCompact={isHeaderCompact}
        onSelectTab={onSelectTab}
      />

      <div className="recipe-page__body">
        <PopularRecipeSection recipes={popularRecipes} showMore={false} />

        <div className="recipe-page__filters">
          {filters.map((filter, index) => (
            <button type="button" key={filter} className={index === 0 ? 'is-active' : undefined}>
              {filter}
            </button>
          ))}
        </div>

        <section className="recipe-page__tip-card" aria-label="오늘의 냉장고 활용 팁">
          <div className="recipe-page__tip-copy">
            <h3>오늘의 냉장고 활용 TIP</h3>
            <p>
              냉장고 속 재료를 먼저 확인하면
              <br />
              장보기 횟수를 줄일 수 있어요!
            </p>
          </div>
          <img src={dorakTipMascot} alt="" aria-hidden="true" />
        </section>

        <RecipeList onOpenDetail={onOpenDetail} extraItems={extraRecipes} />
      </div>
    </main>
  )
}

export default RecipePage
