import { weeklyMenuData } from './mealData'
import './RecipeCarousel.css'

const RECIPES = weeklyMenuData
  .filter((m) => m.image !== null)
  .map((m) => ({
    id: m.date,
    name: m.name,
    image: m.image!,
    time: m.time ?? '15분',
    usage: m.usage,
  }))

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 3.5v2.5l1.5 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function DishIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" stroke="#333" strokeWidth="1.5" />
      <circle cx="9" cy="9" r="4" stroke="#333" strokeWidth="1.5" />
      <path d="M9 2v2M9 14v2M2 9h2M14 9h2" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function usageBadgeStyle(usage: number | null): React.CSSProperties {
  if (usage === null) return { background: '#f0f0f0', color: '#bbb' }
  if (usage >= 90) return { background: '#FFDB78', color: '#7a5000' }
  if (usage >= 60) return { background: '#b8f0d0', color: '#1a7a4a' }
  return { background: '#ffd0d0', color: '#cc3333' }
}

function RecipeCarousel() {
  return (
    <section className="rc-section">
      <div className="rc-header">
        <DishIcon />
        <span className="rc-title">내 재료로 만들 수 있는 메뉴</span>
        <button className="rc-more-btn">더보기 &gt;</button>
      </div>

      <div className="rc-scroll">
        {RECIPES.map((recipe) => (
          <div key={recipe.id} className="rc-card">
            <div className="rc-img-wrap">
              <img src={recipe.image} alt={recipe.name} className="rc-img" />
            </div>
            <div className="rc-info">
              <p className="rc-name">{recipe.name}</p>
              <p className="rc-time">
                <ClockIcon />
                약 {recipe.time}
              </p>
              <span className="rc-badge" style={usageBadgeStyle(recipe.usage)}>
                {recipe.usage !== null ? `활용도 ${recipe.usage}%` : '활용도 %'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RecipeCarousel
