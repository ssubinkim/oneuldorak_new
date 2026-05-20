import maintab1 from '../home/images/maintab_1.svg'
import maintab2 from '../home/images/maintab_2.svg'
import maintab4 from '../home/images/maintab_4.svg'
import './RecipeQuickActions.css'

const quickActions = [
  {
    id: 'quick',
    topLabel: '빠르게',
    mainLabel: '10분요리',
    icon: maintab1,
  },
  {
    id: 'simple',
    topLabel: '누구나',
    mainLabel: '간단재료',
    icon: maintab2,
  },
  {
    id: 'diet',
    topLabel: '가볍게',
    mainLabel: '다이어트',
    icon: maintab4,
  },
]

function RecipeQuickActions() {
  return (
    <section className="recipe-quick-section">
      <div className="recipe-quick-grid">
        {quickActions.map((action) => (
          <button className="recipe-quick-card" type="button" key={action.id}>
            <div className="recipe-quick-card__text">
              <span className="recipe-quick-card__top">{action.topLabel}</span>
              <span className="recipe-quick-card__main">{action.mainLabel}</span>
            </div>
            <span className="recipe-quick-card__icon" aria-hidden="true">
              <img src={action.icon} alt="" />
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default RecipeQuickActions
