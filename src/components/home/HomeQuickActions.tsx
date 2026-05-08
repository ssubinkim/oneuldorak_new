import './HomeQuickActions.css'

const quickActions = [
  { label: '10분 요리' },
  { label: '간단재료' },
  { label: '밀프랩' },
  { label: '다이어트' },
]

function HomeQuickActions() {
  return (
    <section className="quick-section" aria-labelledby="quickActionTitle">
      <h2 id="quickActionTitle">도와줘요 도락맨</h2>
      <div className="quick-grid">
        {quickActions.map((action) => (
          <button className="quick-card" type="button" key={action.label}>
            <span className="quick-card__icon" aria-hidden="true" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default HomeQuickActions
