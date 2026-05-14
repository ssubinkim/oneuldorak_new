import { weeklyMenuData } from '../mealData'
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
    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.66699 2.375H6.66699C7.55105 2.375 8.39889 2.70863 9.02402 3.3025C9.64914 3.89636 10.0003 4.70181 10.0003 5.54167V16.625C10.0003 15.9951 9.73693 15.391 9.26809 14.9456C8.79925 14.5002 8.16337 14.25 7.50033 14.25H1.66699V2.375Z" stroke="#3C3C3C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.3333 2.375H13.3333C12.4493 2.375 11.6014 2.70863 10.9763 3.3025C10.3512 3.89636 10 4.70181 10 5.54167V16.625C10 15.9951 10.2634 15.391 10.7322 14.9456C11.2011 14.5002 11.837 14.25 12.5 14.25H18.3333V2.375Z" stroke="#3C3C3C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function usageBadgeStyle(usage: number | null): React.CSSProperties {
  if (usage === null) return { background: '#f0f0f0', color: '#bbb' }
  if (usage === 100) return { background: '#ffe6a1', color: '#7a5000' }
  if (usage === 90)  return { background: '#b4c9ff', color: '#2a4fa8' }
  if (usage >= 60)   return { background: '#FFDB78', color: '#7a5000' }
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
              <div className="rc-meta">
                <p className="rc-time">
                  <ClockIcon />
                  약 {recipe.time}
                </p>
                <span className="rc-badge" style={usageBadgeStyle(recipe.usage)}>
                  {recipe.usage !== null ? `활용도 ${recipe.usage}%` : '활용도 %'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RecipeCarousel
