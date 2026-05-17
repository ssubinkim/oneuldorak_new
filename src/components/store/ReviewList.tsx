import { useState } from 'react'
import './ReviewList.css'
import reviewBanner from './images/review_banner.svg'
import subreview1 from './images/subreview/subreview_1.png'
import subreview2 from './images/subreview/subreview_2.png'
import subreview3 from './images/subreview/subreview_3.png'
import subreview4 from './images/subreview/subreview_4.png'
import ReviewWriteSheet from './ReviewWriteSheet'
import VoteCompleteModal from '../community/common/VoteCompleteModal'

export type Review = {
  id: string
  username: string
  rating: number
  date: string
  content: string
  option?: string
  photos?: string[]
  helpful: number
  notHelpful: number
  verifiedPercent?: number
}

type Props = {
  reviews: Review[]
  totalCount: number
  averageRating: number
}

const RATING_BARS = [
  { label: '5점', pct: 78 },
  { label: '4점', pct: 16 },
  { label: '3점', pct: 4 },
  { label: '2점', pct: 1 },
  { label: '1점', pct: 1 },
]

const KEYWORDS = ['👍 가성비 좋아요', '😋 맛있어요', '🌿 신선해요', '🚚 배송이 빨라요']

const REVIEW_TAGS: Record<string, string[]> = {
  '1': ['👍 가성비 좋아요', '😋 맛있어요'],
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="review-card__meta">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className="review-card__star" style={{ fontSize: size, color: i <= Math.round(rating) ? '#ffd515' : '#ddd' }}>★</span>
      ))}
    </div>
  )
}

function ReviewList({ reviews, totalCount, averageRating }: Props) {
  const [showWriteSheet, setShowWriteSheet] = useState(false)
  const [showModal, setShowModal] = useState(false)

  function handleSubmit() {
    setShowWriteSheet(false)
    setShowModal(true)
  }

  return (
    <>
    {showWriteSheet && <ReviewWriteSheet onClose={() => setShowWriteSheet(false)} onSubmit={handleSubmit} />}
    <VoteCompleteModal
      isOpen={showModal}
      question="리뷰 작성"
      selectedOption="리뷰 완료"
      reward="+30p"
      onClose={() => setShowModal(false)}
    />
    <div>
      {/* 베스트 리뷰 배너 */}
      <div className="review-banner">
        <div className="review-banner__body">
          <p className="review-banner__text-label">베스트 리뷰 선정 시 추가 100p 지급</p>
          <p className="review-banner__text-main">다양한 각도에서 상품 상태를<br />촬영하여 첨부해주세요 !</p>
        </div>
        <img src={reviewBanner} alt="리뷰 배너" className="review-banner__img" />
      </div>

      {/* 전체 평점 요약 */}
      <div className="review-summary">
        <div className="review-summary__top">
          <div className="review-summary__left">
            <p className="review-summary__label">전체 리뷰</p>
            <p className="review-summary__score">{averageRating}<span>/5</span></p>
            <div className="review-summary__stars">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className="review-summary__star" style={{ color: i <= Math.round(averageRating) ? '#ffd515' : '#ddd' }}>★</span>
              ))}
            </div>
            <p className="review-summary__count">({totalCount}+)</p>
          </div>
          <div className="review-summary__bars">
            {RATING_BARS.map(b => (
              <div key={b.label} className="review-bar">
                <span className="review-bar__label">{b.label}</span>
                <div className="review-bar__track">
                  <div className="review-bar__fill" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="review-bar__pct">{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="review-summary__tags">
          {KEYWORDS.map(kw => (
            <span key={kw} className="review-tag">{kw}</span>
          ))}
        </div>
      </div>

      {/* 포토 리뷰 */}
      <div className="review-photos">
        <div className="review-photos__header">
          <span className="review-photos__title">포토 리뷰</span>
          <span className="review-photos__more">더보기 &gt;</span>
        </div>
        <div className="review-photos__list">
          <div className="review-photo-write" onClick={() => setShowWriteSheet(true)}>
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#767676" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            리뷰쓰기
          </div>
          <img className="review-photo-thumb" src={subreview1} alt="포토 리뷰 1" style={{ objectFit: 'cover' }} />
          <img className="review-photo-thumb" src={subreview2} alt="포토 리뷰 2" style={{ objectFit: 'cover' }} />
        </div>
      </div>

      {/* 리뷰 모아보기 */}
      <div className="review-list">
        <p className="review-list__header">리뷰 모아보기</p>
        <div className="review-list__filter-row">
          <button className="review-filter-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#5f5f5f" strokeWidth={1.2} strokeLinecap="square">
              <path d="M11.6668 4.08301H6.41683M8.16683 9.91634H2.91683M8.16683 9.91634C8.16683 10.8828 8.95033 11.6663 9.91683 11.6663C10.8833 11.6663 11.6668 10.8828 11.6668 9.91634C11.6668 8.94984 10.8833 8.16634 9.91683 8.16634C8.95033 8.16634 8.16683 8.94984 8.16683 9.91634ZM5.8335 4.08301C5.8335 5.04951 5.04999 5.83301 4.0835 5.83301C3.117 5.83301 2.3335 5.04951 2.3335 4.08301C2.3335 3.11651 3.117 2.33301 4.0835 2.33301C5.04999 2.33301 5.8335 3.11651 5.8335 4.08301Z"/>
            </svg>
            필터
          </button>
          <button className="review-sort-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#5f5f5f" strokeWidth={1.2} strokeLinecap="square">
              <path d="M7.58333 9.33301L9.91667 11.6663L12.25 9.33301M9.91667 11.6663V2.33301M6.41667 4.66634L4.08333 2.33301L1.75 4.66634M4.08333 2.33301V11.6663"/>
            </svg>
            최신순
          </button>
        </div>

        {reviews.map(r => (
          <div key={r.id} className="review-card">
            <div className="review-card__header">
              <div className="review-card__avatar">🍱</div>
              <div className="review-card__user-info">
                <span className="review-card__username">{r.username}</span>
                <div className="review-card__meta">
                  <Stars rating={r.rating} />
                  <span className="review-card__date">{r.date}</span>
                </div>
              </div>
            </div>

            {REVIEW_TAGS[r.id] && (
              <div className="review-card__tags">
                {REVIEW_TAGS[r.id].map(tag => (
                  <span key={tag} className="review-tag">{tag}</span>
                ))}
              </div>
            )}

            {r.photos && r.photos.length > 0 && (
              <div className="review-card__photos">
                <div className="review-card__photo-main" style={{ position: 'relative' }}>
                  <img src={subreview1} alt="리뷰 사진 1" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                </div>
                <div className="review-card__photo-col">
                  <div className="review-card__photo-small">
                    <img src={subreview3} alt="리뷰 사진 3" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                  </div>
                  <div className="review-card__photo-small">
                    <img src={subreview4} alt="리뷰 사진 4" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                    {r.photos.length > 2 && (
                      <div className="review-card__photo-more">+{r.photos.length - 2}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <p className="review-card__content">{r.content}</p>

            <div className="review-card__footer">
              <button>
                <svg width="13" height="11" viewBox="0 0 13 11" fill="none" stroke="#777777" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.99756 4.48644L5.20803 0.953166C5.2937 0.813513 5.41407 0.698429 5.55744 0.619123C5.7008 0.539817 5.86225 0.498993 6.02608 0.500629C6.15511 0.495972 6.28376 0.517227 6.40443 0.563137C6.5251 0.609048 6.63534 0.678683 6.72864 0.767926C6.82194 0.85717 6.8964 0.964211 6.94763 1.08272C6.99886 1.20124 7.02581 1.32881 7.02688 1.45792V3.99039H10.8473C10.9885 3.99497 11.1271 4.02938 11.254 4.09135C11.381 4.15333 11.4933 4.24146 11.5837 4.34997C11.6742 4.45848 11.7406 4.58489 11.7787 4.72091C11.8167 4.85693 11.8256 4.99946 11.8046 5.13914L11.1084 9.62971C11.0787 9.86969 10.9624 10.0906 10.7813 10.2508C10.6002 10.4111 10.3668 10.4997 10.125 10.5H4.41609C4.14432 10.501 3.87608 10.4384 3.63285 10.3172L3.00626 10.0039"/>
                  <path d="M2.99756 4.48633V9.9777"/>
                  <path d="M0.935132 4.48633H2.99766V9.9777H0.935132C0.819728 9.9777 0.70905 9.93185 0.627447 9.85025C0.545844 9.76865 0.5 9.65797 0.5 9.54257V4.92146C0.5 4.80606 0.545844 4.69538 0.627447 4.61378C0.70905 4.53217 0.819728 4.48633 0.935132 4.48633Z"/>
                </svg>
                도움돼요 {r.helpful}
              </button>
              <button>
                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" stroke="#777777" strokeLinecap="square">
                  <path d="M11.375 8.75C11.375 9.05942 11.2609 9.35616 11.0577 9.57496C10.8545 9.79375 10.579 9.91667 10.2917 9.91667H3.79167L1.625 12.25V2.91667C1.625 2.60725 1.73914 2.3105 1.9423 2.09171C2.14547 1.87292 2.42102 1.75 2.70833 1.75H10.2917C10.579 1.75 10.8545 1.87292 11.0577 2.09171C11.2609 2.3105 11.375 2.60725 11.375 2.91667V8.75Z"/>
                </svg>
                댓글 {r.notHelpful}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default ReviewList
