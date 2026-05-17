import reviewBanner from './images/review_banner.svg'
import './ReviewList.css'

function ReviewEmpty() {
  return (
    <div>
      <div className="review-banner">
        <div className="review-banner__body">
          <p className="review-banner__text-label">베스트 리뷰 선정 시 추가 100p 지급</p>
          <p className="review-banner__text-main">다양한 각도에서 상품 상태를<br />촬영하여 첨부해주세요 !</p>
        </div>
        <img src={reviewBanner} alt="리뷰 배너" className="review-banner__img" />
      </div>

      <div className="review-summary">
        <div className="review-summary__top">
          <div className="review-summary__left">
            <p className="review-summary__label">전체 리뷰</p>
            <p className="review-summary__score">0<span>/5</span></p>
            <div className="review-summary__stars">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className="review-summary__star" style={{ color: '#ddd' }}>★</span>
              ))}
            </div>
            <p className="review-summary__count">(0)</p>
          </div>
          <div className="review-summary__bars">
            {['5점', '4점', '3점', '2점', '1점'].map(label => (
              <div key={label} className="review-bar">
                <span className="review-bar__label">{label}</span>
                <div className="review-bar__track">
                  <div className="review-bar__fill" style={{ width: '0%' }} />
                </div>
                <span className="review-bar__pct">0%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    <div style={{ padding: '16px 16px 0' }}>
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8 }}>
          이 재료의 첫번째 리뷰를 작성해 보세요 !
        </div>
        <div style={{ fontSize: 12, color: '#aaa' }}>처음 리뷰 작성시 10p를 드려요</div>
      </div>
    </div>
    </div>
  )
}

export default ReviewEmpty
