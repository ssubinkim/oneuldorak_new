import { useState } from 'react'
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

const BEST_PRODUCTS: Product[] = [
  { id: '1', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best1, rating: 4.9, reviewCount: 267 },
  { id: '2', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best2, rating: 4.9, reviewCount: 267 },
  { id: '3', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best3, rating: 4.9, reviewCount: 267 },
  { id: '4', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best4, rating: 4.9, reviewCount: 267 },
  { id: '5', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best5, rating: 4.9, reviewCount: 267 },
]

const SUBSCRIPTION_PRODUCTS: Product[] = [
  { id: '1', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best1, rating: 4.9, reviewCount: 267 },
  { id: '2', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best2, rating: 4.9, reviewCount: 267 },
  { id: '3', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best3, rating: 4.9, reviewCount: 267 },
  { id: '4', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best4, rating: 4.9, reviewCount: 267 },
  { id: '5', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best5, rating: 4.9, reviewCount: 267 },
  { id: '6', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best1, rating: 4.9, reviewCount: 267 },
]

const KITCHEN_PRODUCTS: Product[] = [
  { id: '1', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best1, rating: 4.9, reviewCount: 267 },
  { id: '2', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best2, rating: 4.8, reviewCount: 182 },
  { id: '3', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best3, rating: 4.7, reviewCount: 95 },
  { id: '4', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best4, rating: 4.9, reviewCount: 267 },
  { id: '5', brand: '밥픽', name: '맛드러지는 밀프랩', price: 12000, image: best5, rating: 4.6, reviewCount: 43 },
]

type Props = {
  onSelect: (id: string) => void
}

function StoreMain({ onSelect }: Props) {
  const [activeTab, setActiveTab] = useState('추천')

  return (
    <div>
      <StoreTopBar />
      <StoreBanner />
      <StoreCategoryTabs active={activeTab} onChange={setActiveTab} />
      <BestSection products={BEST_PRODUCTS} onSelect={onSelect} />
      <BrandPickSection />
      <SubscriptionSection products={SUBSCRIPTION_PRODUCTS} onSelect={onSelect} />
      <KitchenSection products={KITCHEN_PRODUCTS} onSelect={onSelect} />
      <div style={{ height: 32 }} />
    </div>
  )
}

export default StoreMain
