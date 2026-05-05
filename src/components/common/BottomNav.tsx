import { useEffect, useState } from 'react'
import './BottomNav.css'

export type BottomNavRoute = 'home' | 'meal' | 'community' | 'store' | 'mypage'

type NavItem = {
  label: string
  route: BottomNavRoute
}

const navItems: NavItem[] = [
  { label: '홈', route: 'home' },
  { label: '오늘도락', route: 'meal' },
  { label: '커뮤니티', route: 'community' },
  { label: '스토어', route: 'store' },
  { label: '마이', route: 'mypage' },
]

function getCurrentRoute(): BottomNavRoute {
  const route = window.location.hash.replace('#/', '') as BottomNavRoute

  if (navItems.some((item) => item.route === route)) {
    return route
  }

  return 'home'
}

function NavIcon({ route }: { route: BottomNavRoute }) {
  if (route === 'home') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 10.4 12 4l7.5 6.4v8.8a.8.8 0 0 1-.8.8h-4.4v-6.2H9.7V20H5.3a.8.8 0 0 1-.8-.8v-8.8Z" />
      </svg>
    )
  }

  if (route === 'meal') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4.6h10a1 1 0 0 1 1 1v14.2l-6-3.1-6 3.1V5.6a1 1 0 0 1 1-1Z" />
      </svg>
    )
  }

  if (route === 'community') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 5.5h14a1.3 1.3 0 0 1 1.3 1.3v8.4a1.3 1.3 0 0 1-1.3 1.3H9.5L5 20V6.8a1.3 1.3 0 0 1 1.3-1.3Z" />
      </svg>
    )
  }

  if (route === 'store') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 5.4h2.2l1.8 9.2h8.7l1.7-6.2H8" />
        <path d="M9.4 19.1h.1M16.7 19.1h.1" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="7.7" r="3.2" />
      <path d="M5.7 20c.8-3.8 3-5.7 6.3-5.7s5.5 1.9 6.3 5.7" />
    </svg>
  )
}

function BottomNav() {
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getCurrentRoute())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <nav className="bottom-nav" aria-label="하단 메뉴">
      {navItems.map((item) => {
        const isActive = item.route === currentRoute

        return (
          <a
            className="bottom-nav__link"
            href={`#/${item.route}`}
            aria-current={isActive ? 'page' : undefined}
            key={item.route}
          >
            <NavIcon route={item.route} />
            <span>{item.label}</span>
          </a>
        )
      })}
    </nav>
  )
}

export default BottomNav
