import './StoreCategoryTabs.css'

const TABS = ['추천', '베스트', '가성비', '밀키트', '밀프랩', '도시락 용품']

type Props = {
  active: string
  onChange?: (tab: string) => void
}

function StoreCategoryTabs({ active, onChange }: Props) {
  return (
    <div className="store-tabs">
      <div className="store-tabs__track">
        {TABS.map(tab => (
          <button
            key={tab}
            type="button"
            className={`store-tab${active === tab ? ' is-active' : ''}`}
            disabled={tab !== TABS[0]}
            onClick={() => onChange?.(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

export default StoreCategoryTabs
