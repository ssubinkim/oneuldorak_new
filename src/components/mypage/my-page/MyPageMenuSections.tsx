import './MyPageMenuSections.css'

export type MyPageMenuSection = {
  title: string
  items: string[][]
}

const DEFAULT_MENU_SECTIONS: MyPageMenuSection[] = [
  {
    title: '스토어',
    items: [['구매 내역', '정기 배송']],
  },
  {
    title: '멤버십',
    items: [['멤버십 혜택', '구독 현황']],
  },
  {
    title: '설정 / 관리',
    items: [
      ['계정 설정', '알림 설정'],
      ['구독·결제', '앱 환경 설정'],
      ['약관·정책', '고객지원 센터'],
    ],
  },
]

type MyPageMenuSectionsProps = {
  sections?: MyPageMenuSection[]
}

function MyPageMenuSections({ sections = DEFAULT_MENU_SECTIONS }: MyPageMenuSectionsProps) {
  return (
    <div className="mypage-menus">
      {sections.map((section) => (
        <div key={section.title} className="mypage-menu-section">
          <div className="mypage-menu-title">{section.title}</div>
          {section.items.map((row, index) => (
            <div key={`${section.title}-${index}`} className="mypage-menu-row">
              {row.map((item) => (
                <div key={item} className="mypage-menu-item">
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default MyPageMenuSections
