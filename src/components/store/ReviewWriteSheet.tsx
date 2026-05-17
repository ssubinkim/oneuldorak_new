import { useState } from 'react'
import './ReviewWriteSheet.css'
import sub1 from './images/sub_1.svg'

type Props = {
  onClose: () => void
  onSubmit: () => void
}

function ReviewWriteSheet({ onClose, onSubmit }: Props) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <>
      <div className="review-sheet__overlay" onClick={onClose} />
      <div className="review-sheet">
        <div className="review-sheet__header">
          <span className="review-sheet__title">리뷰쓰기</span>
          <button className="review-sheet__close" onClick={onClose}>✕</button>
        </div>

        <div className="review-sheet__product">
          <div className="review-sheet__product-img">
            <img src={sub1} alt="상품 이미지" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
          </div>
          <div>
            <p className="review-sheet__brand">모노메이트</p>
            <p className="review-sheet__name">2칸 컬러풀 도시락</p>
            <div className="review-sheet__price-row">
              <span className="review-sheet__price">12,000 ₩</span>
            </div>
            <p className="review-sheet__option">도시락 5개입</p>
          </div>
        </div>

        <div className="review-sheet__rating-section">
          <p className="review-sheet__rating-title">상품은 만족하셨나요 ?</p>
          <div className="review-sheet__stars">
            {[1, 2, 3, 4, 5].map(i => (
              <span
                key={i}
                className={`review-sheet__star${(hoverRating || rating) >= i ? ' review-sheet__star--active' : ''}`}
                onClick={() => setRating(i)}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
              >★</span>
            ))}
          </div>
        </div>

        <div className="review-sheet__content">
          <p className="review-sheet__content-title">도락이들의 리뷰를 기다리고 있어요</p>
          <p className="review-sheet__content-desc">사진과 함께 생생한 후기를 남겨보세요 !</p>
          <textarea
            className="review-sheet__textarea"
            placeholder="맛부터 포장까지, 솔직한 후기를 들려주세요."
          />
        </div>

        <div className="review-sheet__photos">
          <button className="review-sheet__photo-btn">
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#5f5f5f" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            사진첨부
          </button>
          <button className="review-sheet__photo-add">+</button>
        </div>

        <button className="review-sheet__cta" onClick={onSubmit}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#3C3C3C" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M0.5 13.5H11.5" strokeWidth={1.8}/>
            <path d="M6.5 9.99994L3.5 10.5399L4 7.49994L10.73 0.789939C10.823 0.696211 10.9336 0.621816 11.0554 0.571048C11.1773 0.520279 11.308 0.494141 11.44 0.494141C11.572 0.494141 11.7027 0.520279 11.8246 0.571048C11.9464 0.621816 12.057 0.696211 12.15 0.789939L13.21 1.84994C13.3037 1.9429 13.3781 2.0535 13.4289 2.17536C13.4797 2.29722 13.5058 2.42793 13.5058 2.55994C13.5058 2.69195 13.4797 2.82266 13.4289 2.94452C13.3781 3.06637 13.3037 3.17698 13.21 3.26994L6.5 9.99994Z"/>
          </svg>
          리뷰 쓰고 30p 받기
        </button>
      </div>
    </>
  )
}

export default ReviewWriteSheet
