import { useEffect, useState } from 'react'
import communityOffIcon from '../../../assets/icons/Community_off.svg'
import communityOnIcon from '../../../assets/icons/Community_on.svg'
import homeOffIcon from '../../../assets/icons/home_off.svg'
import homeOnIcon from '../../../assets/icons/home_on.svg'
import myOffIcon from '../../../assets/icons/my_off.svg'
import myOnIcon from '../../../assets/icons/my_on.svg'
import mydorakOffIcon from '../../../assets/icons/mydorak_off.svg'
import mydorakOnIcon from '../../../assets/icons/mydorak_on.svg'
import storeOffIcon from '../../../assets/icons/store_off.svg'
import storeOnIcon from '../../../assets/icons/store_on.svg'
import './BottomNav.css'

export type BottomNavRoute = 'home' | 'meal' | 'community' | 'store' | 'mypage'

type NavItem = {
  label: string
  route: BottomNavRoute
  offIcon: string
  onIcon: string
}

const navItems: NavItem[] = [
  { label: '오늘도락', route: 'meal', offIcon: mydorakOffIcon, onIcon: mydorakOnIcon },
  { label: '커뮤니티', route: 'community', offIcon: communityOffIcon, onIcon: communityOnIcon },
  { label: '홈', route: 'home', offIcon: homeOffIcon, onIcon: homeOnIcon },
  { label: '스토어', route: 'store', offIcon: storeOffIcon, onIcon: storeOnIcon },
  { label: '마이', route: 'mypage', offIcon: myOffIcon, onIcon: myOnIcon },
]

function getCurrentRoute(): BottomNavRoute {
  const route = window.location.hash.replace('#/', '') as BottomNavRoute

  if (navItems.some((item) => item.route === route)) {
    return route
  }

  return 'home'
}

function NavIcon({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const icon = isActive ? item.onIcon : item.offIcon

  return <img className="bottom-nav__icon" src={icon} alt="" aria-hidden="true" />
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
            className={`bottom-nav__link${item.route === 'home' ? ' bottom-nav__link--home' : ''}`}
            href={`#/${item.route}`}
            aria-current={isActive ? 'page' : undefined}
            key={item.route}
          >
            <NavIcon item={item} isActive={isActive} />
            <span className="bottom-nav__label">{item.label}</span>
          </a>
        )
      })}
    </nav>
  )
}

export default BottomNav
