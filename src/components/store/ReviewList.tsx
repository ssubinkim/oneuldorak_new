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
          <button className="review-filter-btn">⚙ 필터</button>
          <button className="review-sort-btn">↑↓ 최신순</button>
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
              <button>👍 도움돼요 {r.helpful}</button>
              <button>💬 댓글 {r.notHelpful}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default ReviewList
