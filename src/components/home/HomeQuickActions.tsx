import maintab1 from './images/maintab_1.svg'
import maintab2 from './images/maintab_2.svg'
import maintab3 from './images/maintab_3.svg'
import maintab4 from './images/maintab_4.svg'
import './HomeQuickActions.css'

const quickActions = [
  { label: '10분 요리', icon: maintab1 },
  { label: '간단재료', icon: maintab2 },
  { label: '밀프랩', icon: maintab3 },
  { label: '다이어트', icon: maintab4 },
]

function HomeQuickActions() {
  return (
    <section className="quick-section">
      <section className="quick-grid">
        {quickActions.map((action) => (
          <button className="quick-card" type="button" key={action.label}>
            <span className="quick-card__icon" aria-hidden="true">
              <img src={action.icon} alt="" width={44} height={44} loading="lazy" decoding="async" fetchPriority="low" />
            </span>
            <span>{action.label}</span>
          </button>
        ))}
      </section>
    </section>
  )
}

export default HomeQuickActions
