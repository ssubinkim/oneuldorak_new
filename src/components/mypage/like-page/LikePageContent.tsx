import SavedRecipeCard from '../saved-recipe-page/SavedRecipeCard'
import type { SavedRecipe } from '../saved-recipe-page/SavedRecipeCard'
import LikePostCard from './LikePostCard'
import type { LikePost } from './LikePostCard'
import type { LikePageTab } from './LikePageTabs'
import './LikePageContent.css'

type LikePageContentProps = {
  activeTab: LikePageTab
  likedPosts: LikePost[]
  savedRecipes: SavedRecipe[]
}

function LikePageContent({
  activeTab,
  likedPosts,
  savedRecipes,
}: LikePageContentProps) {
  const isLikesTab = activeTab === 'likes'

  return (
    <div className="page-scroll">
      <div className="like-page">
        <div className="like-list">
          {isLikesTab
            ? likedPosts.map((post) => <LikePostCard key={post.id} post={post} />)
            : savedRecipes.map((recipe) => (
                <SavedRecipeCard key={recipe.id} recipe={recipe} />
              ))}
        </div>
      </div>
    </div>
  )
}

export default LikePageContent
