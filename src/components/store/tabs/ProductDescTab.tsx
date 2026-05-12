import './ProductDescTab.css'
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
      {/* 상품정보 테이블 */}
      <div className="pdesc__info">
        <p className="pdesc__info-title">상품정보</p>
        {PRODUCT_INFO.map(({ label, value }) => (
          <div key={label} className="pdesc__info-row">
            <span className="pdesc__info-label">{label}</span>
            <span className="pdesc__info-value">{value}</span>
          </div>
        ))}
        <p className="pdesc__info-note">*상품 정보는 판매자가 제공한 내용입니다</p>
      </div>

      {/* 상품소개 이미지 */}
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="pdesc__product-img">
          <span>상품소개 이미지</span>
        </div>
      ))}

      {/* 리뷰 미리보기 */}
      <div className="pdesc__review" onClick={onGoToReview}>
        <div className="pdesc__review-header">
          <div>
            <span className="pdesc__review-title">리뷰 {reviewCount === 0 ? '0' : '999+'}</span>
            {reviewCount > 0 && (
              <div className="pdesc__review-rating">
                <span className="pdesc__review-star">★</span>
                <span>4.8/5</span>
              </div>
            )}
          </div>
          <span className="pdesc__review-more">더보기 &gt;</span>
        </div>
        {reviewCount > 0 && (
          <div className="pdesc__review-thumbs">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="pdesc__review-thumb" />
            ))}
          </div>
        )}
      </div>

      <RelatedRecipes />
      <RelatedProducts onSelect={onSelectProduct} />
      <div style={{ height: 24 }} />
    </div>
  )
}

export default ProductDescTab
