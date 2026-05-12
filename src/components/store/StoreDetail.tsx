import { useState } from 'react'
import './StoreDetail.css'
import ProductDescTab from './tabs/ProductDescTab'
import ProductInfoTab from './tabs/ProductInfoTab'
import ReviewTab from './tabs/ReviewTab'
import InquiryTab, { type Inquiry } from './tabs/InquiryTab'
import { type Review } from './ReviewList'
import { type Product } from './ProductCard'

type Tab = 'desc' | 'info' | 'review' | 'inquiry'

const TABS: { id: Tab; label: string }[] = [
  { id: 'desc', label: '상품설명' },
  { id: 'info', label: '리뷰' },
  { id: 'inquiry', label: '문의' },
]

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    username: 'moon******',
    rating: 4,
    date: '25.07.04',
    content: '생각보다 구성도 든든하고 맛도있어서 앞으로 자주 구매할 것 같아요. 특히 직장인이나 자취생 분들 정말 추천... 더 보기',
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

const PRODUCTS_MAP: Record<string, ProductData> = {
  '1': { reviews: MOCK_REVIEWS,  inquiries: MOCK_INQUIRIES },
  '2': { reviews: [],            inquiries: MOCK_INQUIRIES },
  '3': { reviews: MOCK_REVIEWS,  inquiries: [] },
  '4': { reviews: [],            inquiries: [] },
}

function getProductData(productId: string | null): ProductData {
  if (productId && productId in PRODUCTS_MAP) return PRODUCTS_MAP[productId]
  return PRODUCTS_MAP['1']
}

type Props = {
  product: Product | null
  onBack: () => void
  onSelectProduct?: (product: Product) => void
}

function StoreDetail({ product, onBack, onSelectProduct }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('desc')
  const [liked, setLiked] = useState(false)
  const { reviews, inquiries } = getProductData(product?.id ?? null)

  return (
    <div>
      {/* 상단 네비 — sticky */}
      <div className="store-detail__nav">
        <button className="store-detail__nav-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#111" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <span className="store-detail__nav-title">{product?.name ?? '제품이름'}</span>
        <div className="store-detail__nav-actions">
          <button className="store-detail__nav-btn">
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#111" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
          <button className="store-detail__nav-btn" onClick={() => setLiked(v => !v)}>
            <svg viewBox="0 0 24 24" width={20} height={20} fill={liked ? '#ff4d6d' : 'none'} stroke={liked ? '#ff4d6d' : '#111'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 상품 이미지 */}
      <div className="store-detail__product-img">
        {product?.image && <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>

      {/* 상품 정보 */}
      <div className="store-detail__product-header">
        <div className="store-detail__top-row">
          <button className="store-detail__brand-badge">{product?.brand ?? '브랜드'} &gt;</button>
          <div className="store-detail__product-actions">
            <button className="store-detail__action-btn" onClick={() => setLiked(v => !v)}>
              <svg viewBox="0 0 24 24" width={22} height={22} fill={liked ? '#ff4d6d' : 'none'} stroke={liked ? '#ff4d6d' : '#888'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button className="store-detail__action-btn">
              <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#888" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15,3 21,3 21,9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          </div>
        </div>
        <h2 className="store-detail__product-name">{product?.name ?? '제품이름'}</h2>
        <p className="store-detail__product-desc">간편하게 즐기는 맛있는 도시락</p>
        <p className="store-detail__product-kcal">120kcal</p>
        <div className="store-detail__price-row">
          <span className="store-detail__product-price">{(product?.price ?? 0).toLocaleString()} ₩</span>
          <button className="store-detail__coupon-btn">
            <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            받은쿠폰
          </button>
        </div>
      </div>

      {/* 혜택/배송 정보 */}
      <div className="store-detail__benefits">
        <div className="store-detail__benefit-item">
          <span className="store-detail__benefit-label">적립</span>
          <span className="store-detail__benefit-content">
            포인트 최대 10p 적립<br />리뷰 작성시 최대 10p 적립
          </span>
        </div>
        <div className="store-detail__benefit-item">
          <span className="store-detail__benefit-label">배송</span>
          <span className="store-detail__benefit-content">
            3일 이내 판매자 발송 예정<br />50,000원 이상 무료
          </span>
        </div>
      </div>

      {/* 탭 바 — sticky */}
      <div className="store-detail__tabbar">
        {TABS.map(tab => (
          <div
            key={tab.id}
            className={`store-detail__tab${activeTab === tab.id ? ' store-detail__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'desc' && (
        <ProductDescTab
          product={product}
          reviewCount={reviews.length}
          onGoToReview={() => setActiveTab('info')}
          onSelectProduct={onSelectProduct}
        />
      )}
      {activeTab === 'info' && (
        <ReviewTab reviews={reviews} onSelectProduct={onSelectProduct} />
      )}
      {activeTab === 'review' && <ProductInfoTab />}
      {activeTab === 'inquiry' && (
        <InquiryTab inquiries={inquiries} onSelectProduct={onSelectProduct} />
      )}

    </div>
  )
}

export default StoreDetail
