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

function Stars({ rating }: { rating: number }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#f5a623' : '#ddd', fontSize: 14 }}>★</span>
      ))}
    </span>
  )
}

function ReviewList({ reviews, totalCount, averageRating }: Props) {
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>리뷰 {totalCount}+</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#111' }}>{averageRating}/5</span>
          <Stars rating={averageRating} />
        </div>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>가장 많은 만족 · 4,000명 구매</div>
        <div style={{
          display: 'inline-block', background: '#f2f2f2', borderRadius: 20,
          padding: '6px 14px', fontSize: 12, color: '#555', fontWeight: 600,
        }}>
          사진 리뷰 (999+)
        </div>
      </div>

      {reviews.map(r => (
        <div key={r.id} style={{ borderTop: '1px solid #f2f2f2', paddingTop: 16, marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: '#e8e8e8', flexShrink: 0,
            }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>{r.username}</span>
                {r.verifiedPercent !== undefined && (
                  <span style={{ fontSize: 11, color: '#a259e0', fontWeight: 600 }}>실제 {r.verifiedPercent}%</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Stars rating={r.rating} />
                <span style={{ fontSize: 11, color: '#aaa' }}>{r.date}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 80, height: 80, background: '#e8e8e8', borderRadius: 6, flexShrink: 0 }} />
            ))}
          </div>

          {r.option && (
            <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>
              옵션 {r.option}
              <span style={{ color: '#4caf50', marginLeft: 6 }}>☑ 적립</span>
            </div>
          )}

          <div style={{ fontSize: 13, color: '#333', lineHeight: 1.6, marginBottom: 10 }}>
            {r.content}
          </div>

          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#888' }}>
            <span style={{ cursor: 'pointer' }}>♡ 도움 {r.helpful}</span>
            <span style={{ cursor: 'pointer' }}>👍 도움됨 {r.notHelpful}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReviewList
