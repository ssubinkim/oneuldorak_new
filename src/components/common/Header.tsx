import '../../styles/Header.css'

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 16.3H6c1.2-1.3 1.7-3.3 1.7-6a4.3 4.3 0 0 1 8.6 0c0 2.7.5 4.7 1.7 6Z" />
      <path d="M10.1 18.5a2.1 2.1 0 0 0 3.8 0" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="18" cy="5.6" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.4" r="2.5" />
      <path d="m8.3 10.9 7.4-4.1M8.3 13.1l7.4 4.1" />
    </svg>
  )
}

function StatusIcons() {
  return (
    <div className="app-header__status-icons">
      <span className="app-header__signal">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="app-header__wifi" />
      <span className="app-header__battery">80</span>
    </div>
  )
}

type HeaderProps = {
  showActions?: boolean
}

function Header({ showActions = false }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__status" aria-hidden="true">
        <span>9:41</span>
        <StatusIcons />
      </div>

      {showActions && (
        <div className="app-header__actions" aria-label="상단 빠른 메뉴">
          <button type="button" aria-label="알림">
            <BellIcon />
          </button>
          <button type="button" aria-label="공유">
            <ShareIcon />
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
