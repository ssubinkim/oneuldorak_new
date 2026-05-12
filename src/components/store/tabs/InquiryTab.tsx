import './InquiryTab.css'
import storecall1 from '../images/storecall_1.svg'
import storecall2 from '../images/storecall_2.svg'
import RelatedRecipes from '../RelatedRecipes'
import RelatedProducts from '../RelatedProducts'
import { type Product } from '../ProductCard'

export type Inquiry = {
  id: string
  content: string
  username: string
  date: string
  isAnswered: boolean
  isSecret: boolean
}

type Props = {
  inquiries: Inquiry[]
  onSelectProduct?: (product: Product) => void
}

function InquiryTab({ onSelectProduct }: Props) {
  return (
    <div>
      {/* 상품 문의 */}
      <div className="inquiry-section">
        <img className="inquiry-section__img" src={storecall1} alt="상품 문의" />
        <p className="inquiry-section__title">상품에 대해 궁금한 것이 있으신가요?</p>
        <p className="inquiry-section__desc">상품 관련 문의는 판매자가 상세히 답변드립니다.</p>
        <button className="inquiry-section__btn">상품 문의하기</button>
      </div>

      {/* 배송 문의 */}
      <div className="inquiry-section">
        <img className="inquiry-section__img" src={storecall2} alt="배송 문의" />
        <p className="inquiry-section__title">배송에 대해 궁금한 것이 있으신가요?</p>
        <p className="inquiry-section__desc">배송 관련 문의는 오늘도락 고객센터에서 답변드립니다</p>
        <button className="inquiry-section__btn">배송 문의하기</button>
      </div>

      {/* 판매자 고객센터 */}
      <div className="inquiry-cs">
        <p className="inquiry-cs__title">판매자 고객센터</p>
        <p className="inquiry-cs__info-text">
          <span className="inquiry-cs__info-label">운영시간</span>
          평일 13:00 ~ 17:00 점심 12:00 ~ 13:00<br />주말, 공휴일 휴무
        </p>
        <div className="inquiry-cs__btns">
          <button className="inquiry-cs__btn">
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
            </svg>
            전화하기
          </button>
          <button className="inquiry-cs__btn">
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            이메일 보내기
          </button>
        </div>
      </div>

      <RelatedRecipes />
      <RelatedProducts onSelect={onSelectProduct} />
      <div style={{ height: 24 }} />
    </div>
  )
}

export default InquiryTab
