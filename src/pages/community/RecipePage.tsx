import CommunityTabs from '../../components/community/common/CommunityTabs'
import PopularRecipeSection from '../../components/community/common/PopularRecipeSection'
import CommunityBanner from '../../components/community/communitypage/CommunityBanner'
import { popularRecipes } from '../../components/community/communitypage/communityData'
import RecipeList, { type RecipeItem } from '../../components/community/recipepage/RecipeList'
import type { CommunityTabRoute } from './CommunityTabRoute'
import './RecipePage.css'

type RecipePageProps = {
  onSelectTab: (tab: CommunityTabRoute) => void
  onOpenDetail: (recipeId: string) => void
  extraRecipes?: RecipeItem[]
}

const filters = ['인기순', '최신순', '가격순', '시간순', '난이도순']

function RecipePage({ onSelectTab, onOpenDetail, extraRecipes = [] }: RecipePageProps) {
  return (
    <main className="page-scroll recipe-page">
      <CommunityBanner />

      <CommunityTabs
        activeTab="recipe"
        className="recipe-page__tabs"
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

        <RecipeList onOpenDetail={onOpenDetail} extraItems={extraRecipes} />
      </div>
    </main>
  )
}

export default RecipePage
