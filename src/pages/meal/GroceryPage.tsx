import { useState, type Dispatch, type SetStateAction } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import {
  chiliImg, sosageImg, meatImg, onionImg,
  potatoImg, brocollyImg, tofuImg,
  carrotImg, garlicImg,
} from '../../components/meal/mealData'
import dorakcrewImg  from '../../components/meal/images/dorak_walk.svg'
import dorakcrewBannerImg from '../../components/meal/images/dorak_happy.svg'
import bibimbapImg   from '../../components/meal/images/bibimbap.png'
import bulgogiImg    from '../../components/meal/images/bulgogi.png'
import chamchiImg    from '../../components/meal/images/chamchimayo.png'
import kimbokImg     from '../../components/meal/images/kimbok.png'
import omuriceImg    from '../../components/meal/images/omurice.png'
import ssoyaImg      from '../../components/meal/images/ssoya.png'
import '../../styles/Tailwind.css'
import './GroceryPage.css'

type Tab = 'shopping' | 'storage' | 'recommend'
type Props = { onBack: () => void }

/* ── 공통 데이터 타입 ───────────────────────────── */
interface ShoppingItem {
  id: number; name: string; image: string; checked: boolean
}

interface StorageRecipe {
  id: number; image: string; channel: string; name: string; likes: number
}

/* ── 장보기 데이터 ─────────────────────────────── */
const INITIAL_ITEMS: ShoppingItem[] = [
  { id: 1, name: '고추',    image: chiliImg,    checked: false },
  { id: 2, name: '소시지',  image: sosageImg,   checked: true  },
  { id: 3, name: '소고기',  image: meatImg,     checked: true  },
  { id: 4, name: '양파',    image: onionImg,    checked: false },
  { id: 5, name: '감자',    image: potatoImg,   checked: false },
  { id: 6, name: '브로콜리', image: brocollyImg, checked: false },
  { id: 7, name: '두부',    image: tofuImg,     checked: true  },
]

/* ── 보관함 데이터 ─────────────────────────────── */
const STORAGE_RECIPES: StorageRecipe[] = [
  { id: 1, image: bibimbapImg,  channel: '도시락락락',  name: '비빔밥',           likes: 452 },
  { id: 2, image: bulgogiImg,   channel: '프로집밥러',  name: '불고기 덮밥',      likes: 375 },
  { id: 3, image: chamchiImg,   channel: '자취요리왕',  name: '참치마요 덮밥',    likes: 281 },
  { id: 4, image: kimbokImg,    channel: '도시락락락',  name: '김치볶음밥',       likes: 198 },
  { id: 5, image: omuriceImg,   channel: '프로집밥러',  name: '오무라이스',       likes: 520 },
  { id: 6, image: ssoyaImg,     channel: '자취요리왕',  name: '소시지 야채볶음',  likes: 344 },
]

const STORAGE_FILTERS = ['전체', '검색', '#한식', '#일식', '#양식']

const TAB_TITLES: Record<Tab, string> = {
  shopping:  '장보기 체크리스트',
  storage:   '저장한 레시피 보관함',
  recommend: '저장한 레시피 기반 추천메뉴',
}

interface RecommendItem {
  id: number; name: string; image: string; recipes: string
}

const RECOMMEND_ITEMS: RecommendItem[] = [
  { id: 1, name: '양파',    image: onionImg,    recipes: '제육볶음 · 카레' },
  { id: 2, name: '당근',    image: carrotImg,   recipes: '볶음밥 · 카레' },
  { id: 3, name: '두부',    image: tofuImg,     recipes: '마파두부 · 된장찌개' },
  { id: 4, name: '마늘',    image: garlicImg,   recipes: '파스타 · 볶음요리' },
  { id: 5, name: '브로콜리', image: brocollyImg, recipes: '잡채 · 볶음' },
  { id: 6, name: '감자',    image: potatoImg,   recipes: '감자볶음 · 조림' },
]

/* ── 아이콘 ────────────────────────────────────── */
function BackIcon() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
      <path d="M9 1L1 9L9 17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1 1h2.5l1.8 9h8.4l1.8-6H4.5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="15.5" r="1.2" fill="#333" />
      <circle cx="13" cy="15.5" r="1.2" fill="#333" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 10.5S1 7 1 3.8A2.8 2.8 0 0 1 6 2.4 2.8 2.8 0 0 1 11 3.8C11 7 6 10.5 6 10.5Z"
        stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" fill="none" />
    </svg>
  )
}

/* ── 보관함 레시피 카드 ─────────────────────────── */
function RecipeCard({ recipe }: { recipe: StorageRecipe }) {
  return (
    <div className="gp-recipe-card">
      <img src={recipe.image} alt={recipe.name} className="gp-recipe-img" />
      <div className="gp-recipe-overlay">
        <p className="gp-recipe-channel">🍱 {recipe.channel}</p>
        <div className="gp-recipe-footer">
          <p className="gp-recipe-name">{recipe.name}</p>
          <span className="gp-recipe-likes"><HeartIcon /> {recipe.likes}</span>
        </div>
      </div>
    </div>
  )
}

/* ── 장보기 탭 ─────────────────────────────────── */
type ShoppingTabProps = {
  items: ShoppingItem[]
  setItems: Dispatch<SetStateAction<ShoppingItem[]>>
}

function ShoppingTab({ items, setItems }: ShoppingTabProps) {
  const toggle = (id: number) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, checked: !it.checked } : it))

  const checkedCount = items.filter(it => it.checked).length
  const allChecked   = items.length > 0 && checkedCount === items.length

  const toggleAll    = () => setItems(prev => prev.map(it => ({ ...it, checked: !allChecked })))
  const deleteChecked = () => setItems(prev => prev.filter(it => !it.checked))

  return (
    <div className="gp-tab-content">
      <div className="gp-section-title"><CartIcon /><span>장보기 체크리스트</span></div>

      <div className="gp-list-header">
        <label className="gp-check-label">
          <input type="checkbox" className="gp-checkbox" checked={allChecked} onChange={toggleAll} />
          <span className="gp-check-box" data-checked={allChecked} />
          <span className="gp-check-text">전체선택 ({checkedCount}/{items.length})</span>
        </label>
        <button className="gp-delete-btn" onClick={deleteChecked}>상품삭제</button>
      </div>

      <div className="gp-item-list">
        {items.map(item => (
          <label key={item.id} className="gp-item">
            <input type="checkbox" className="gp-checkbox" checked={item.checked} onChange={() => toggle(item.id)} />
            <span className="gp-check-box" data-checked={item.checked} />
            <img src={item.image} alt={item.name} className="gp-item-img" />
            <span className="gp-item-name">{item.name}</span>
          </label>
        ))}
      </div>

      <button className="gp-cart-btn">🛒 장바구니에 담기 ({checkedCount})</button>
    </div>
  )
}

/* ── 보관함 탭 ─────────────────────────────────── */
function StorageTab() {
  const [activeFilter, setActiveFilter] = useState('전체')

  return (
    <div>
      {/* 필터 칩 */}
      <div className="gp-filters">
        {STORAGE_FILTERS.map(f => (
          <button
            key={f}
            className={`gp-filter-chip${activeFilter === f ? ' gp-filter-chip--active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f === '검색' && <SearchIcon />}
            {f}
          </button>
        ))}
      </div>

      {/* 2열 레시피 그리드 */}
      <div className="gp-recipe-grid">
        {STORAGE_RECIPES.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

/* ── 추천재료 탭 ────────────────────────────────── */
function RecommendTab() {
  return (
    <div className="gp-tab-content">
      {/* 배너 */}
      <div className="gp-rec-banner">
        <p className="gp-rec-banner-text">
          저장한 레시피 기반으로<br />필요한 재료를 추천해요 !
        </p>
        <img src={dorakcrewBannerImg} alt="" className="gp-rec-banner-img" />
      </div>

      {/* 재료 리스트 */}
      <div className="gp-rec-list">
        {RECOMMEND_ITEMS.map(item => (
          <div key={item.id} className="gp-rec-item">
            <img src={item.image} alt={item.name} className="gp-rec-img" />
            <div className="gp-rec-info">
              <span className="gp-rec-name">{item.name}</span>
              <span className="gp-rec-recipes">{item.recipes}</span>
            </div>
            <button className="gp-rec-add-btn">+</button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 페이지 ────────────────────────────────────── */
function GroceryPage({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('shopping')
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(INITIAL_ITEMS)
  const checkedShoppingCount = shoppingItems.filter(item => item.checked).length

  return (
    <div className="app-shell">
      <div className="app-screen gp-screen">
        <div className="gp-scroll">

          {/* 헤더 */}
          <div className="gp-header">
            <button className="gp-back-btn" onClick={onBack} aria-label="뒤로가기">
              <BackIcon />
            </button>
            <span className="gp-header-title">{TAB_TITLES[activeTab]}</span>
            <img src={dorakcrewImg} alt="" className="gp-header-crew" />
          </div>

          {/* 콘텐츠 */}
          <div className="gp-content">

            {/* 탭 */}
            <div className="gp-tabs">
              <button
                className={`gp-tab${activeTab === 'shopping' ? ' gp-tab--active' : ''}`}
                onClick={() => setActiveTab('shopping')}
              >
                장보기
                <span className="gp-tab-badge">{checkedShoppingCount}</span>
              </button>
              <button
                className={`gp-tab${activeTab === 'storage' ? ' gp-tab--active' : ''}`}
                onClick={() => setActiveTab('storage')}
              >
                보관함
              </button>
              <button
                className={`gp-tab${activeTab === 'recommend' ? ' gp-tab--active' : ''}`}
                onClick={() => setActiveTab('recommend')}
              >
                추천재료
              </button>
            </div>

            {activeTab === 'shopping'  && (
              <ShoppingTab items={shoppingItems} setItems={setShoppingItems} />
            )}
            {activeTab === 'storage'   && <StorageTab />}
            {activeTab === 'recommend' && <RecommendTab />}

          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

export default GroceryPage
