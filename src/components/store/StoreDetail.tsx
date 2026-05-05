import { useState } from 'react'
import ProductDescTab from './tabs/ProductDescTab'
import ProductInfoTab from './tabs/ProductInfoTab'
import ReviewTab from './tabs/ReviewTab'
import InquiryTab, { type Inquiry } from './tabs/InquiryTab'
import { type Review } from './ReviewList'

type Tab = 'desc' | 'info' | 'review' | 'inquiry'

const TABS: { id: Tab; label: string }[] = [
  { id: 'desc', label: '상품설명' },
  { id: 'info', label: '상세정보' },
  { id: 'review', label: '리뷰' },
  { id: 'inquiry', label: '문의' },
]

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    username: 'moon******',
    rating: 4,
    date: '25.07.04',
    content: '키가 작아서 살짝 길긴 하지만 너무 맘에 들어요 너무 맘지 않아서 라인이 다 예쁘고 입으면서 힐 신으면... 더 보기',
    option: 'Black(블랙)',
    photos: ['', '', ''],
    helpful: 3,
    notHelpful: 3,
    verifiedPercent: 3,
  },
]

const MOCK_INQUIRIES: Inquiry[] = [
  { id: '1', content: '8개중 3개는 푸석하고 신선하지 않은것이 있습니다.', username: '박*욱', date: '2026.04.22', isAnswered: true, isSecret: false },
  { id: '2', content: '오렌지 안에 까만거 뭘까요?', username: '김*정', date: '2026.04.20', isAnswered: true, isSecret: false },
  { id: '3', content: '비밀글입니다.', username: '지*', date: '2026.04.11', isAnswered: true, isSecret: true },
  { id: '4', content: '구입한 오렌지가 이렇게 되서 어떻게해야할까요', username: '전*석', date: '2026.04.13', isAnswered: true, isSecret: false },
  { id: '5', content: '비밀글입니다.', username: '지*', date: '2026.04.11', isAnswered: true, isSecret: true },
  { id: '6', content: '고무같아요 반품하고싶어요', username: '진*정', date: '2026.03.21', isAnswered: true, isSecret: false },
]

type ProductData = { reviews: Review[]; inquiries: Inquiry[] }

// 상품별 리뷰/문의 상태를 다르게 구성
const PRODUCTS_MAP: Record<string, ProductData> = {
  '1': { reviews: MOCK_REVIEWS,  inquiries: MOCK_INQUIRIES }, // 리뷰 O, 문의 O
  '2': { reviews: [],            inquiries: MOCK_INQUIRIES }, // 리뷰 X, 문의 O
  '3': { reviews: MOCK_REVIEWS,  inquiries: [] },             // 리뷰 O, 문의 X
  '4': { reviews: [],            inquiries: [] },             // 리뷰 X, 문의 X
}

function getProductData(productId: string | null): ProductData {
  if (productId && productId in PRODUCTS_MAP) return PRODUCTS_MAP[productId]
  return PRODUCTS_MAP['1']
}

type Props = {
  productId: string | null
  onBack: () => void
  onSelectProduct?: (id: string) => void
}

function StoreDetail({ productId, onBack, onSelectProduct }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('desc')
  const { reviews, inquiries } = getProductData(productId)

  return (
    <div>
      {/* 상단 네비 + 탭바 — sticky */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>
        {/* 네비 바 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderBottom: '1px solid #f2f2f2',
        }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#111" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>제품이름</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#111" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#111" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#111" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* 탭 바 */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
          {TABS.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, textAlign: 'center', padding: '12px 0', fontSize: 13, cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 700 : 400,
                color: activeTab === tab.id ? '#111' : '#aaa',
                borderBottom: activeTab === tab.id ? '2px solid #111' : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'desc' && (
        <ProductDescTab
          reviewCount={reviews.length}
          onGoToReview={() => setActiveTab('review')}
          onSelectProduct={onSelectProduct}
        />
      )}
      {activeTab === 'info' && <ProductInfoTab />}
      {activeTab === 'review' && (
        <ReviewTab reviews={reviews} onSelectProduct={onSelectProduct} />
      )}
      {activeTab === 'inquiry' && (
        <InquiryTab inquiries={inquiries} onSelectProduct={onSelectProduct} />
      )}
    </div>
  )
}

export default StoreDetail
