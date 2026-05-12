import { useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import {
  onionImg, brocollyImg, potatoImg, carrotImg,
  romainImg, beansproutsImg, tofuImg,
  strawberryImg, garlicImg, appleImg, chiliImg, mangoImg,
  getIngredientIconClassName,
} from '../../components/meal/mealData'
import refrigeImg from '../../components/meal/images/refrige.svg'
import bookOpenImg from '../../components/meal/images/book_open.svg'
import indexRedImg from '../../components/meal/images/index_red.svg'
import indexYellowImg from '../../components/meal/images/index_yellow.svg'
import indexGreenImg from '../../components/meal/images/index_green.svg'
import '../../styles/Tailwind.css'
import './StoragePage.css'

type Status = 'urgent' | 'moderate' | 'plenty'
type Category = '전체' | '과일' | '단백질' | '냉동' | '소스' | '채소'

interface FridgeItem {
  id: number
  name: string
  image: string
  isEmoji: boolean
  days: number | null
  status: Status
  category: Category
}

const FRIDGE_ITEMS: FridgeItem[] = [
  { id: 1,  name: '딸기',     image: strawberryImg, isEmoji: false, days: 5,    status: 'moderate', category: '과일' },
  { id: 2,  name: '마늘',     image: garlicImg,     isEmoji: false, days: 2,    status: 'urgent',   category: '채소' },
  { id: 3,  name: '양파',     image: onionImg,      isEmoji: false, days: null, status: 'plenty',   category: '채소' },
  { id: 4,  name: '브로콜리', image: brocollyImg,   isEmoji: false, days: 5,    status: 'moderate', category: '채소' },
  { id: 5,  name: '사과',     image: appleImg,      isEmoji: false, days: 5,    status: 'moderate', category: '과일' },
  { id: 6,  name: '고추',     image: chiliImg,      isEmoji: false, days: null, status: 'plenty',   category: '채소' },
  { id: 7,  name: '망고',     image: mangoImg,      isEmoji: false, days: 5,    status: 'plenty',   category: '과일' },
  { id: 8,  name: '상추',     image: romainImg,   isEmoji: false, days: 5,    status: 'moderate', category: '채소' },
  { id: 9,  name: '콩나물',   image: beansproutsImg, isEmoji: false, days: null, status: 'plenty', category: '채소' },
  { id: 10, name: '감자',     image: potatoImg,   isEmoji: false, days: 2,    status: 'urgent',   category: '채소' },
  { id: 11, name: '두부',     image: tofuImg,     isEmoji: false, days: 5,    status: 'plenty',   category: '채소' },
  { id: 12, name: '당근',     image: carrotImg,   isEmoji: false, days: 2,    status: 'urgent',   category: '채소' },
]

const STATUS_INDEX: Record<Status, string> = {
  urgent: indexRedImg,
  moderate: indexYellowImg,
  plenty: indexGreenImg,
}

const FILTERS: Category[] = ['전체', '과일', '단백질', '냉동', '소스', '채소']

const TOTAL = 9
const URGENT_CNT = FRIDGE_ITEMS.filter(i => i.status === 'urgent').length
const MODERATE_CNT = FRIDGE_ITEMS.filter(i => i.status === 'moderate').length
const PLENTY_CNT   = FRIDGE_ITEMS.filter(i => i.status === 'plenty').length
const MENU_CNT = 5

type Props = { onBack: () => void }

/* ── 아이콘 ────────────────────────────────────── */
function BackIcon() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
      <path d="M9 1L1 9L9 17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}


/* ── 냉장고 현황 카드 ───────────────────────────── */
function FridgeStatusCard() {
  const stats = [
    { label: '임박 재료', count: URGENT_CNT, tape: indexRedImg, tone: 'urgent' },
    { label: '소진 추천', count: MODERATE_CNT, tape: indexYellowImg, tone: 'moderate' },
    { label: '여유 있음', count: PLENTY_CNT, tape: indexGreenImg, tone: 'plenty' },
  ] as const

  return (
    <div className="sp-fridge-card">
      <div className="sp-fridge-top">
        <div className="sp-fridge-icon-wrap">
          <img src={refrigeImg} alt="냉장고" className="sp-fridge-icon" />
        </div>
        <div className="sp-fridge-info">
          <p className="sp-fridge-label">내 냉장고 현황</p>
          <p className="sp-fridge-count"><strong>{TOTAL}</strong> 개 보관 중</p>
          <p className="sp-fridge-menu">
            <img src={bookOpenImg} alt="" className="sp-fridge-menu-icon" />
            만들 수 있는 메뉴 {MENU_CNT}개
          </p>
        </div>
      </div>

      <div className="sp-fridge-stats">
        {stats.map((stat, index) => (
          <div className="sp-fridge-stat-wrap" key={stat.label}>
            <img src={stat.tape} alt="" className="sp-fridge-index" />
            <div className="sp-fridge-stat">
              <span className="sp-stat-label">{stat.label}</span>
              <span className={`sp-stat-num ${stat.tone}`}><strong>{stat.count}</strong> 개</span>
            </div>
            {index < stats.length - 1 && <div className="sp-fridge-divider" />}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 재료 카드 ─────────────────────────────────── */
function IngredientCard({ item }: { item: FridgeItem }) {
  const indexImg = STATUS_INDEX[item.status]
  const daysLabel = item.days !== null ? `${item.days}일 남음` : '넉넉해요'

  return (
    <div className={`sp-item-card sp-item-card--${item.status}`}>
      <img src={indexImg} alt="" className="sp-item-index" />
      <div className="sp-item-img-wrap">
        {item.isEmoji
          ? <span className="sp-item-emoji">{item.image}</span>
          : <img src={item.image} alt={item.name} className={`sp-item-img ${getIngredientIconClassName(item.image)}`} />
        }
      </div>
      <span className="sp-item-name">{item.name}</span>
      <span className="sp-item-days">{daysLabel}</span>
    </div>
  )
}

/* ── 페이지 ────────────────────────────────────── */
function StoragePage({ onBack }: Props) {
  const [activeFilter, setActiveFilter] = useState<Category>('전체')

  const filtered = activeFilter === '전체'
    ? FRIDGE_ITEMS
    : FRIDGE_ITEMS.filter(i => i.category === activeFilter)

  return (
    <div className="app-shell">
      <div className="app-screen sp-screen">
        <div className="sp-scroll">

          {/* 헤더 */}
          <div className="sp-header">
            <button className="sp-back-btn" onClick={onBack} aria-label="뒤로가기">
              <BackIcon />
            </button>
            <span className="sp-header-title">내 재료 보관함</span>
            <button className="sp-add-btn">재료 추가 +</button>
          </div>

          {/* 냉장고 현황 카드 */}
          <FridgeStatusCard />

          {/* 필터 칩 */}
          <div className="sp-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`sp-filter-chip${activeFilter === f ? ' sp-filter-chip--active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* 재료 그리드 */}
          <div className="sp-grid">
            {filtered.map(item => (
              <IngredientCard key={item.id} item={item} />
            ))}
          </div>

        </div>
        <BottomNav />
      </div>
    </div>
  )
}

export default StoragePage
