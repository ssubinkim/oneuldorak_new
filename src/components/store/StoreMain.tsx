import { useState } from 'react'
import ProductSection from './ProductSection'
import RankingSection from './RankingSection'
import { type Product } from './ProductCard'

const CATEGORY_TABS = ['추천', '베스트', '가성비', '밀키트', '밀프']
const STORES = ['스토어1', '스토어2', '스토어3', '스토어4', '스토어5']

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: '제품이름입니다', price: 12000, likes: 999 }, // 리뷰 O, 문의 O
  { id: '2', name: '제품이름입니다', price: 12000, likes: 0 },   // 리뷰 X, 문의 O
  { id: '3', name: '제품이름입니다', price: 12000, likes: 999 }, // 리뷰 O, 문의 X
  { id: '4', name: '제품이름입니다', price: 12000, likes: 0 },   // 리뷰 X, 문의 X
  { id: '1', name: '제품이름입니다', price: 12000, likes: 999 },
  { id: '3', name: '제품이름입니다', price: 12000, likes: 999 },
]

type Props = {
  onSelect: (id: string) => void
}

function StoreMain({ onSelect }: Props) {
  const [activeTab, setActiveTab] = useState('추천')
  const [selectedStore, setSelectedStore] = useState('스토어1')

  return (
    <div>
      {/* 카테고리 탭 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10, background: '#fff',
        borderBottom: '1px solid #eee',
      }}>
        <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORY_TABS.map(tab => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: '0 0 auto', padding: '12px 18px', fontSize: 13, cursor: 'pointer',
                fontWeight: activeTab === tab ? 700 : 400,
                color: activeTab === tab ? '#111' : '#aaa',
                borderBottom: activeTab === tab ? '2px solid #111' : '2px solid transparent',
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* 히어로 배너 */}
      <div style={{
        height: 180, background: '#e8e8e8',
        display: 'flex', alignItems: 'flex-end', padding: 20,
      }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#555' }}>이번달 할인중인 상품소개</span>
      </div>

      {/* 검색바 */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          border: '1px solid #ddd', borderRadius: 8, padding: '10px 14px', gap: 8,
        }}>
          <input
            placeholder="검색이를 입력하세요 !"
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 13, color: '#333', background: 'transparent',
            }}
          />
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#888" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* 스토어 원형 네비 */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {STORES.map(store => (
            <div
              key={store}
              onClick={() => setSelectedStore(store)}
              style={{ flex: '0 0 auto', textAlign: 'center', cursor: 'pointer' }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: '50%', background: '#e8e8e8', marginBottom: 4,
                border: selectedStore === store ? '2px solid #333' : '2px solid transparent',
              }} />
              <div style={{
                fontSize: 11, color: '#555',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
              }}>
                {store}
                {selectedStore === store && <span style={{ fontSize: 9 }}>∨</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 스토어 인기 상품 */}
      <ProductSection
        title={`${selectedStore} 인기 상품`}
        products={MOCK_PRODUCTS.slice(0, 3)}
        onSelect={onSelect}
      />

      {/* 실시간 인기 랭킹 */}
      <RankingSection
        title="실시간 인기 랭킹"
        description="가장 인기있는 상품만 모아보세요"
        products={MOCK_PRODUCTS.slice(0, 3)}
        onSelect={onSelect}
      />

      {/* 카테고리별 섹션 */}
      <ProductSection title="가성비 식재료" description="설명합니다" products={MOCK_PRODUCTS.slice(0, 3)} onSelect={onSelect} />
      <ProductSection title="밀키트" description="설명합니다" products={MOCK_PRODUCTS.slice(0, 2)} columns={2} onSelect={onSelect} />
      <ProductSection title="도시락" description="설명합니다" products={MOCK_PRODUCTS.slice(0, 2)} columns={2} onSelect={onSelect} />
      <ProductSection title="도시락용품" description="설명합니다" products={MOCK_PRODUCTS.slice(0, 2)} columns={2} onSelect={onSelect} />
      <div style={{ height: 24 }} />
    </div>
  )
}

export default StoreMain
