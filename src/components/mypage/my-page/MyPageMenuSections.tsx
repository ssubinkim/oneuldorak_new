import { useState } from 'react'
import icon1 from '../images/icon-slot-1.svg'
import icon2 from '../images/icon-slot-2.svg'
import icon3 from '../images/icon-slot-3.svg'
import icon4 from '../images/icon-slot-4.svg'
import icon5 from '../images/icon-slot-5.svg'
import icon6 from '../images/icon-slot-6.svg'
import icon7 from '../images/icon-slot-7.svg'
import icon8 from '../images/icon-slot-8.svg'
import './MyPageMenuSections.css'

export type MyPageMenuItem = {
  label: string
  aside?: string
  asideColor?: string
  muted?: boolean
  icon?: string
  onClick?: () => void
}

export type MyPageMenuSection = {
  title: string
  items: MyPageMenuItem[]
}

const DEFAULT_MENU_SECTIONS: MyPageMenuSection[] = [
  {
    title: '스토어',
    items: [
      { label: '주문내역', aside: '장바구니', icon: icon1, muted: true },
      { label: '정기배송', icon: icon2, muted: true },
    ],
  },
  {
    title: '멤버십',
    items: [
      { label: '구독', aside: '연간구독 중', asideColor: '#4E7FFF', icon: icon3, onClick: () => { window.location.hash = '#/mypage-plus' } },
      { label: '혜택', icon: icon4, onClick: () => { window.location.hash = '#/mypage-plus-benefit' } },
      { label: '쿠폰', muted: true, icon: icon5 },
    ],
  },
  {
    title: '설정 / 관리',
    items: [
      { label: '계정 설정', muted: true, icon: icon6 },
      { label: '약관 정책', muted: true, icon: icon7 },
      { label: '앱 환경 설정', muted: true, icon: icon8 },
    ],
  },
]

type MyPageMenuSectionsProps = {
  sections?: MyPageMenuSection[]
}

function MyPageMenuSections({ sections = DEFAULT_MENU_SECTIONS }: MyPageMenuSectionsProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogoutConfirm = () => {
    window.location.hash = '#/login'
  }

  return (
    <div className="mypage-menus">
      {sections.map((section) => (
        <section key={section.title} className="mypage-menu-section">
          <h2 className="mypage-menu-title">{section.title}</h2>
          <div className="mypage-menu-list">
            {section.items.map((item) => (
              <button
                key={`${section.title}-${item.label}`}
                type="button"
                className={`mypage-menu-row${item.muted ? ' is-muted' : ''}`}
                onClick={item.onClick}
              >
                <span className="mypage-menu-icon-slot" aria-hidden="true">
                  {item.icon && <img src={item.icon} alt="" width={18} height={18} loading="lazy" decoding="async" fetchPriority="low" />}
                </span>
                <span className="mypage-menu-label">{item.label}</span>
                <span className="mypage-menu-right">
                  {item.aside && <span className="mypage-menu-aside" style={item.asideColor ? { color: item.asideColor } : undefined}>{item.aside}</span>}
                  <span className="mypage-menu-chevron" aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}

      <button type="button" className="mypage-logout" onClick={() => setShowLogoutModal(true)}>
        로그아웃
      </button>

      {showLogoutModal && (
        <div className="mypage-logout-overlay">
          <div className="mypage-logout-modal">
            <p className="mypage-logout-modal__title">로그아웃 하시겠어요?</p>
            <p className="mypage-logout-modal__sub">오늘도락 계정에서 로그아웃돼요.</p>
            <div className="mypage-logout-modal__actions">
              <button type="button" className="mypage-logout-modal__btn mypage-logout-modal__btn--cancel" onClick={() => setShowLogoutModal(false)}>
                취소
              </button>
              <button type="button" className="mypage-logout-modal__btn mypage-logout-modal__btn--confirm" onClick={handleLogoutConfirm}>
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyPageMenuSections
