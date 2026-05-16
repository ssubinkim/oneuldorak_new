import './MyPageMenuSections.css'

export type MyPageMenuItem = {
  label: string
  aside?: string
  muted?: boolean
}

export type MyPageMenuSection = {
  title: string
  items: MyPageMenuItem[]
}

const DEFAULT_MENU_SECTIONS: MyPageMenuSection[] = [
  {
    title: '스토어',
    items: [
      { label: '주문내역', aside: '장바구니' },
      { label: '정기배송' },
    ],
  },
  {
    title: '멤버십',
    items: [
      { label: '구독', aside: '정보' },
      { label: '혜택' },
      { label: '쿠폰', muted: true },
    ],
  },
  {
    title: '설정 / 관리',
    items: [
      { label: '계정 설정', muted: true },
      { label: '약관 정책', muted: true },
      { label: '앱 환경 설정', muted: true },
    ],
  },
]

type MyPageMenuSectionsProps = {
  sections?: MyPageMenuSection[]
}

function MyPageMenuSections({ sections = DEFAULT_MENU_SECTIONS }: MyPageMenuSectionsProps) {
  const handleLogoutClick = () => {
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
              >
                <span className="mypage-menu-icon-slot" aria-label={`${item.label} 아이콘 자리`} />
                <span className="mypage-menu-label">{item.label}</span>
                {item.aside && <span className="mypage-menu-aside">{item.aside}</span>}
                <span className="mypage-menu-chevron" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      ))}

      <button type="button" className="mypage-logout" onClick={handleLogoutClick}>
        로그아웃
      </button>
    </div>
  )
}

export default MyPageMenuSections
