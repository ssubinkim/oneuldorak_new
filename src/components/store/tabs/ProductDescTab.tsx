import './ProductDescTab.css'
import subreview1 from '../images/subreview/subreview_1.png'
import subreview2 from '../images/subreview/subreview_2.png'
import subreview3 from '../images/subreview/subreview_3.png'
import subreview4 from '../images/subreview/subreview_4.png'
import RelatedRecipes from '../RelatedRecipes'
import RelatedProducts from '../RelatedProducts'
import { type Product } from '../ProductCard'
import subimg1_1 from '../images/subitem/subimg1_1.png'
import subimg1_2 from '../images/subitem/subimg1_2.png'
import subimg1_3 from '../images/subitem/subimg1_3.png'
import subimg1_4 from '../images/subitem/subimg1_4.png'
import subimg2_1 from '../images/subitem/subimg2_1.png'
import subimg2_2 from '../images/subitem/subimg2_2.png'
import subimg2_3 from '../images/subitem/subimg2_3.png'
import subimg2_4 from '../images/subitem/subimg2_4.png'
import subimg3_1 from '../images/subitem/subimg3_1.png'
import subimg3_2 from '../images/subitem/subimg3_2.png'
import subimg3_3 from '../images/subitem/subimg3_3.png'
import subimg3_4 from '../images/subitem/subimg3_4.png'

const PRODUCT_INFO = [
  { label: '식품유형', value: '예: 도시락, 죽식조리식품, 샐러드' },
  { label: '내용량', value: '(g, ml 등)' },
  { label: '제조일/판매일', value: '회사명, 주소' },
  { label: '제조일자/소비기한', value: '2026.03.29' },
  { label: '알레르기', value: '본 제품은 OO(알레르기 유발물질)을 포함하고 있습니다' },
  { label: '영양정보', value: '탄수화물, 단백질, 지방 등 총 kcal 표기' },
]

const DETAIL_IMAGES: Record<string, string[]> = {
  '간편 도시락 세트':       [subimg1_1, subimg1_2, subimg1_3, subimg1_4],
  '계란말이 도시락':        [subimg2_1, subimg2_2, subimg2_3, subimg2_4],
  '참치마요 덮밥':          [subimg3_1, subimg3_2, subimg3_3, subimg3_4],
  '전자레인지 런치박스':    [subimg1_1, subimg1_2, subimg1_3, subimg1_4],
  '오늘의야채 샐러드':      [subimg2_1, subimg2_2, subimg2_3, subimg2_4],
  '2칸 컬러풀 도시락':      [subimg3_1, subimg3_2, subimg3_3, subimg3_4],
  '아보카도 계란 샐러드':   [subimg1_1, subimg1_2, subimg1_3, subimg1_4],
  '훈제연어 샐러드':        [subimg2_1, subimg2_2, subimg2_3, subimg2_4],
  '제육볶음 밀키트':        [subimg3_1, subimg3_2, subimg3_3, subimg3_4],
  '4종 밀키트 골라담기':    [subimg1_1, subimg1_2, subimg1_3, subimg1_4],
  '1-2인용 에어프라이기':   [subimg2_1, subimg2_2, subimg2_3, subimg2_4],
  '저당 칼로볼':            [subimg3_1, subimg3_2, subimg3_3, subimg3_4],
  '500ml 보온 텀블러':      [subimg1_1, subimg1_2, subimg1_3, subimg1_4],
  '도시락 보냉가방':        [subimg2_1, subimg2_2, subimg2_3, subimg2_4],
  '밀프랩 전용 법랑용기':   [subimg3_1, subimg3_2, subimg3_3, subimg3_4],
}

type Props = {
  product?: Product | null
  reviewCount: number
  onGoToReview: () => void
  onSelectProduct?: (product: Product) => void
}

function ProductDescTab({ product, reviewCount, onGoToReview, onSelectProduct }: Props) {
  const detailImages = product?.name ? DETAIL_IMAGES[product.name] : undefined

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
      {detailImages
        ? detailImages.map((src, i) => (
            <div key={i} className="pdesc__product-img pdesc__product-img--filled">
              <img src={src} alt={`상품소개 이미지 ${i + 1}`} width={360} height={360} loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'low'} decoding={i === 0 ? 'sync' : 'async'} />
            </div>
          ))
        : [1, 2, 3, 4].map(i => (
            <div key={i} className="pdesc__product-img">
              <span>상품소개 이미지</span>
            </div>
          ))
      }

      {/* 리뷰 미리보기 */}
      <div className="pdesc__review" onClick={onGoToReview}>
        <div className="pdesc__review-header">
          <div>
            <span className="pdesc__review-title">
              <span className="pdesc__review-label">리뷰</span>
              <span className="pdesc__review-count">{reviewCount === 0 ? '0' : '999+'}</span>
            </span>
            {reviewCount > 0 && (
              <div className="pdesc__review-rating">
                <span className="pdesc__review-star">★</span>
                <span className="pdesc__review-score">4.8</span>
                <span className="pdesc__review-total">/5</span>
              </div>
            )}
          </div>
          <span className="pdesc__review-more">더보기 &gt;</span>
        </div>
        {reviewCount > 0 && (
          <div className="pdesc__review-thumbs">
            {[subreview1, subreview2, subreview3, subreview4].map((src, i) => (
              <img key={i} src={src} alt={`리뷰 이미지 ${i + 1}`} className="pdesc__review-thumb" width={72} height={72} loading="lazy" decoding="async" fetchPriority="low" style={{ objectFit: 'cover' }} />
            ))}
          </div>
        )}
      </div>

      <RelatedRecipes />
      <RelatedProducts onSelect={onSelectProduct} />
    </div>
  )
}

export default ProductDescTab
