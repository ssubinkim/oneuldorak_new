import { useEffect, useRef, useState } from 'react'
import communityOffIcon from '../../../assets/icons/Community_off.svg'
import communityOnIcon from '../../../assets/icons/Community_on.svg'
import myOffIcon from '../../../assets/icons/my_off.svg'
import myOnIcon from '../../../assets/icons/my_on.svg'
import mydorakOffIcon from '../../../assets/icons/mydorak_off.svg'
import mydorakOnIcon from '../../../assets/icons/mydorak_on.svg'
import storeOffIcon from '../../../assets/icons/store_off.svg'
import storeOnIcon from '../../../assets/icons/store_on.svg'
import chatbotIcon from '../../chatbot/images/chatbot .svg'
import './BottomNav.css'

export type BottomNavRoute = 'home' | 'meal' | 'community' | 'store' | 'mypage' | 'chatbot'

type NavItem = {
  label: string
  route: BottomNavRoute
  offIcon: string
  onIcon: string
  isCenter?: boolean
}

const navItems: NavItem[] = [
  { label: '오늘도락', route: 'meal', offIcon: mydorakOffIcon, onIcon: mydorakOnIcon },
  { label: '커뮤니티', route: 'community', offIcon: communityOffIcon, onIcon: communityOnIcon },
  { label: '챗봇', route: 'chatbot', offIcon: chatbotIcon, onIcon: chatbotIcon, isCenter: true },
  { label: '도락마켓', route: 'store', offIcon: storeOffIcon, onIcon: storeOnIcon },
  { label: '마이', route: 'mypage', offIcon: myOffIcon, onIcon: myOnIcon },
]

const NAV_SHAPE_DEFAULT_WIDTH = 390
const NAV_SHAPE_HEIGHT = 72
const NAV_SHAPE_HORIZONTAL_INSET = 0
const NAV_SHAPE_CORNER_RADIUS = 12
const NAV_SHAPE_NOTCH_RADIUS = 52
const NAV_SHAPE_NOTCH_CORNER_RADIUS = 12

function buildBottomNavShapePath(width: number): string {
  const safeWidth = Math.max(width, 320)
  const mid = safeWidth / 2
  const height = NAV_SHAPE_HEIGHT
  const radius = NAV_SHAPE_CORNER_RADIUS
  const notchRadius = NAV_SHAPE_NOTCH_RADIUS
  const cornerRadius = NAV_SHAPE_NOTCH_CORNER_RADIUS
  const cornerLeftCenterX = mid - notchRadius - cornerRadius
  const cornerRightCenterX = mid + notchRadius + cornerRadius
  const distance = Math.sqrt((mid - cornerLeftCenterX) ** 2 + cornerRadius ** 2)
  const tangentLeftX = cornerLeftCenterX + ((mid - cornerLeftCenterX) * cornerRadius) / distance
  const tangentY = cornerRadius - (cornerRadius * cornerRadius) / distance
  const tangentRightX = mid + (mid - tangentLeftX)

  return [
    `M${radius} 0`,
    `L${cornerLeftCenterX} 0`,
    `A${cornerRadius} ${cornerRadius} 0 0 1 ${tangentLeftX.toFixed(2)} ${tangentY.toFixed(2)}`,
    `A${notchRadius} ${notchRadius} 0 0 0 ${mid} ${notchRadius}`,
    `A${notchRadius} ${notchRadius} 0 0 0 ${tangentRightX.toFixed(2)} ${tangentY.toFixed(2)}`,
    `A${cornerRadius} ${cornerRadius} 0 0 1 ${cornerRightCenterX} 0`,
    `L${safeWidth - radius} 0`,
    `Q${safeWidth} 0 ${safeWidth} ${radius}`,
    `L${safeWidth} ${height}`,
    `L0 ${height}`,
    `L0 ${radius}`,
    `Q0 0 ${radius} 0`,
    'Z',
  ].join(' ')
}

function getCurrentRoute(): BottomNavRoute {
  const route = window.location.hash.replace('#/', '') as BottomNavRoute

  if (navItems.some((item) => item.route === route)) {
    return route
  }

  return 'meal'
}

function NavIcon({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const icon = isActive ? item.onIcon : item.offIcon

  return (
    <span className="bottom-nav__icon-slot" aria-hidden="true">
      <img className="bottom-nav__icon" src={icon} alt="" />
    </span>
  )
}

function BottomNav() {
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute)
  const [shapeWidth, setShapeWidth] = useState(NAV_SHAPE_DEFAULT_WIDTH)
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getCurrentRoute())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    const navElement = navRef.current

    if (!navElement) return

    const updateWidth = () => {
      setShapeWidth(navElement.getBoundingClientRect().width - NAV_SHAPE_HORIZONTAL_INSET)
    }

    updateWidth()

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(navElement)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <nav ref={navRef} className="bottom-nav" aria-label="하단 메뉴">
      <svg
        className="bottom-nav__shape"
        viewBox={`0 0 ${shapeWidth} ${NAV_SHAPE_HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path className="bottom-nav__shape-path" d={buildBottomNavShapePath(shapeWidth)} />
      </svg>
      {navItems.map((item) => {
        const isActive = item.route === currentRoute

        return (
          <a
            className={`bottom-nav__link${item.isCenter ? ' bottom-nav__link--home' : ''}`}
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
