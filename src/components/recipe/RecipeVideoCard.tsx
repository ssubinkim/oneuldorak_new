import './WeeklyRecipeVideoSection.css'

export type VideoRecipe = {
  id: string
  title: string
  price: string
  time: string
  difficulty: string
  likes: number
  video: string
  poster: string
  recipeId?: string
}

type RecipeVideoCardProps = {
  recipe: VideoRecipe
  isActive: boolean
  videoRef: (el: HTMLVideoElement | null) => void
}

function RecipeVideoCard({ recipe, isActive, videoRef }: RecipeVideoCardProps) {
  return (
    <div className={`recipe-video-card${isActive ? ' recipe-video-card--active' : ''}`}>
      <video
        ref={videoRef}
        className="recipe-video-card__video"
        src={recipe.video}
        poster={recipe.poster}
        muted
        playsInline
        loop
        preload="metadata"
      />
      <div className="recipe-video-card__overlay">
        <div className={`recipe-video-card__info${isActive ? ' recipe-video-card__info--visible' : ''}`}>
          <h3 className="recipe-video-card__title">{recipe.title}</h3>
          <div className="recipe-video-card__meta">
            <span>{recipe.price}</span>
            <span className="recipe-video-card__dot">·</span>
            <span>{recipe.time}</span>
            <span className="recipe-video-card__dot">·</span>
            <span>{recipe.difficulty}</span>
          </div>
          <span className="recipe-video-card__likes">
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314Z" />
            </svg>
            {recipe.likes}
          </span>
        </div>
      </div>
    </div>
  )
}

export default RecipeVideoCard
