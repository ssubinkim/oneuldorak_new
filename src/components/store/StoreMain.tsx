import { useCallback, useRef, useState } from 'react'
import './StoreMain.css'
import StoreTopBar from './StoreTopBar'
import StoreBanner from './StoreBanner'
import StoreCategoryTabs from './StoreCategoryTabs'
import BestSection from './BestSection'
import BrandPickSection from './BrandPickSection'
import SubscriptionSection from './SubscriptionSection'
import KitchenSection from './KitchenSection'
import { type Product } from './ProductCard'

import best1 from './images/best_item1.png'
import best2 from './images/best_item2.png'
import best3 from './images/best_item3.png'
import best4 from './images/best_item4.png'
import best5 from './images/best_item5.png'
import sub1 from './images/sub_1.svg'
import sub2 from './images/sub_2.svg'
import sub3 from './images/sub_3.svg'
import sub4 from './images/sub_4.svg'
import sub5 from './images/sub_5.svg'
import kitchen1 from './images/kitchen_1.svg'
import kitchen2 from './images/kitchen_2.svg'
import kitchen3 from './images/kitchen_3.svg'
import kitchen4 from './images/kitchen_4.svg'
import kitchen5 from './images/kitchen_5.svg'

const BEST_PRODUCTS: Product[] = [
  { id: '1', brand: '모노메이트', name: '간편 도시락 세트', price: 32000, originalPrice: 38000, image: best1, rating: 4.9, reviewCount: 267 },
  { id: '2', brand: '밥픽', name: '계란말이 도시락', price: 4900, image: best2, rating: 4.9, reviewCount: 0 },
  { id: '3', brand: '밥픽', name: '참치마요 덮밥', price: 5900, originalPrice: 7000, image: best3, rating: 4.9, reviewCount: 267 },
  { id: '4', brand: '모노메이트', name: '전자레인지 런치박스', price: 9900, image: best4, rating: 4.9, reviewCount: 0 },
  { id: '5', brand: '프레시잇', name: '오늘의야채 샐러드', price: 12000, originalPrice: 15000, image: best5, rating: 4.9, reviewCount: 267 },
]

const SUBSCRIPTION_PRODUCTS: Product[] = [
  { id: '1', brand: '모노메이트', name: '2칸 컬러풀 도시락', price: 12000, image: sub1, rating: 4.9, reviewCount: 267 },
  { id: '2', brand: '파머스픽', name: '아보카도 계란 샐러드', price: 8600, originalPrice: 10000, image: sub2, rating: 4.9, reviewCount: 0 },
  { id: '3', brand: '파머스픽', name: '훈제연어 샐러드', price: 9600, image: sub3, rating: 4.9, reviewCount: 267 },
  { id: '4', brand: '프레시잇', name: '제육볶음 밀키트', price: 10000, originalPrice: 13000, image: sub4, rating: 4.9, reviewCount: 0 },
  { id: '5', brand: '프레시잇', name: '4종 밀키트 골라담기', price: 30000, image: sub5, rating: 4.9, reviewCount: 267 },
  { id: '6', brand: '모노메이트', name: '간편 도시락 세트', price: 32000, image: best1, rating: 4.9, reviewCount: 267 },
]

const KITCHEN_PRODUCTS: Product[] = [
  { id: '1', brand: '모노메이트', name: '1-2인용 에어프라이기', price: 44000, image: kitchen1, rating: 4.9, reviewCount: 267 },
  { id: '2', brand: '모노메이트', name: '저당 칼로볼', price: 29000, originalPrice: 35000, image: kitchen2, rating: 4.8, reviewCount: 0 },
  { id: '3', brand: '모노메이트', name: '500ml 보온 텀블러', price: 15000, image: kitchen3, rating: 4.7, reviewCount: 95 },
  { id: '4', brand: '모노메이트', name: '도시락 보냉가방', price: 11000, image: kitchen4, rating: 4.9, reviewCount: 0 },
  { id: '5', brand: '모노메이트', name: '밀프랩 전용 법랑용기', price: 6000, image: kitchen5, rating: 4.6, reviewCount: 43 },
]

type Props = {
  onSelect: (product: Product) => void
}

type FlyDot = { id: number; x: number; y: number; dx: number; dy: number }

function StoreMain({ onSelect }: Props) {
  const [activeTab, setActiveTab] = useState('추천')
  const [flyDots, setFlyDots] = useState<FlyDot[]>([])
  const [cartBounce, setCartBounce] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const cartBtnRef = useRef<HTMLButtonElement>(null)
  const flyIdRef = useRef(0)

  const handleCartClick = useCallback((rect: DOMRect) => {
    const cartRect = cartBtnRef.current?.getBoundingClientRect()
    if (!cartRect) return

    const startX = rect.left + rect.width / 2
    const startY = rect.top + rect.height / 2
    const endX = cartRect.left + cartRect.width / 2
    const endY = cartRect.top + cartRect.height / 2
    const id = ++flyIdRef.current

    setFlyDots(prev => [...prev, { id, x: startX, y: startY, dx: endX - startX, dy: endY - startY }])

    setTimeout(() => {
      setFlyDots(prev => prev.filter(d => d.id !== id))
      setCartCount(prev => prev + 1)
      setCartBounce(true)
      setTimeout(() => setCartBounce(false), 400)
    }, 500)
  }, [])

  return (
    <div className="store-main">
      <StoreTopBar cartBtnRef={cartBtnRef} cartBounce={cartBounce} cartCount={cartCount} />
      <StoreBanner />
      <StoreCategoryTabs active={activeTab} onChange={setActiveTab} />
      <div className="store-search">
        <input className="store-search__input" type="text" placeholder="검색어를 입력하세요!" />
        <svg className="store-search__icon" viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <BestSection products={BEST_PRODUCTS} onSelect={onSelect} onCartClick={handleCartClick} />
      <BrandPickSection />
      <SubscriptionSection products={SUBSCRIPTION_PRODUCTS} onSelect={onSelect} onCartClick={handleCartClick} />
      <KitchenSection products={KITCHEN_PRODUCTS} onSelect={onSelect} onCartClick={handleCartClick} />
      <div style={{ height: 32 }} />

      {flyDots.map(dot => (
        <div
          key={dot.id}
          className="store-fly-dot"
          style={{
            left: dot.x,
            top: dot.y,
            '--fly-dx': `${dot.dx}px`,
            '--fly-dy': `${dot.dy}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

export default StoreMain
