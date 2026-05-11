import './MenuTabSwitch.css'

type MenuTab = 'today' | 'weekly'

interface Props {
  menuTab: MenuTab
  setMenuTab: (tab: MenuTab) => void
}

const TABS: { key: MenuTab; label: string }[] = [
  { key: 'today', label: '오늘의 메뉴' },
  { key: 'weekly', label: '주간 메뉴' },
]

function MenuTabSwitch({ menuTab, setMenuTab }: Props) {
  return (
    <div className="menu-tab-switch">
      {TABS.map(({ key, label }) => (
        <div
          key={key}
          className={`menu-tab-item ${menuTab === key ? 'active' : ''}`}
          onClick={() => setMenuTab(key)}
        >
          {label}
        </div>
      ))}
    </div>
  )
}

export default MenuTabSwitch
