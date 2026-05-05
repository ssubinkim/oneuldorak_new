import RelatedRecipes from '../RelatedRecipes'
import RelatedProducts from '../RelatedProducts'

const PRODUCT_INFO = [
  { label: '식품유형', value: '예: 도시락, 죽식조리식품, 샐러드' },
  { label: '내용량', value: '(g, ml 등)' },
  { label: '제조일/판매일', value: '회사명, 주소' },
  { label: '제조일자/소비기한', value: '2026.03.29' },
  { label: '알레르기', value: '본 제품은 OO(알레르기 유발물질)을 포함하고 있습니다' },
  { label: '영양정보', value: '탄수화물, 단백질, 지방 등 총 kcal 표기' },
]

type Props = {
  reviewCount: number
  onGoToReview: () => void
  onSelectProduct?: (id: string) => void
}

function ProductDescTab({ reviewCount, onGoToReview, onSelectProduct }: Props) {
  return (
    <div>
      {/* 상품 대표 이미지 */}
      <div style={{ height: 280, background: '#e8e8e8' }} />

      {/* 상품 기본 정보 */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4 }}>카테고리</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 2 }}>제품이름</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>제품에 대한 설명입니다다이아잇</div>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 8 }}>120kcal</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#111' }}>12,000₩</div>
          </div>
          <button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#888" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15,3 21,3 21,9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* 리뷰 요약 — 클릭하면 리뷰 탭으로 이동 */}
      <div
        onClick={onGoToReview}
        style={{
          margin: '12px 16px',
          border: '1px solid #eee', borderRadius: 8, padding: 14, cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>
              리뷰 {reviewCount === 0 ? '0' : '999+'}
            </div>
            {reviewCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 16, color: '#f5a623' }}>★</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>4.8/5</span>
              </div>
            )}
          </div>
          <span style={{ fontSize: 12, color: '#888' }}>전체보기 &gt;</span>
        </div>
        {reviewCount > 0 && (
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ width: 64, height: 64, background: '#e8e8e8', borderRadius: 6, flexShrink: 0 }} />
            ))}
          </div>
        )}
      </div>

      {/* 상품정보 */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 12 }}>상품정보</div>
        {PRODUCT_INFO.map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f5f5f5', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#888', flexShrink: 0, width: 110 }}>{label}</span>
            <span style={{ fontSize: 12, color: '#333', flex: 1 }}>{value}</span>
          </div>
        ))}
        <div style={{ fontSize: 11, color: '#aaa', marginTop: 8, marginBottom: 20 }}>
          *상품 정보는 판매자가 제공한 내용입니다
        </div>
      </div>

      {/* 상품소개 이미지 */}
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{
          height: 200, background: '#e8e8e8', marginBottom: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 13, color: '#aaa' }}>상품소개 이미지</span>
        </div>
      ))}

      <RelatedRecipes />
      <RelatedProducts onSelect={onSelectProduct} />
      <div style={{ height: 24 }} />
    </div>
  )
}

export default ProductDescTab
