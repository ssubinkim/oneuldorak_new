function ReviewEmpty() {
  return (
    <div style={{ padding: '16px 16px 0' }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>리뷰 (0)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#111' }}>0/5</span>
          <span>
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} style={{ color: '#ddd', fontSize: 22 }}>★</span>
            ))}
          </span>
        </div>
      </div>

      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8 }}>
          이 재료의 첫번째 리뷰를 작성해 보세요 !
        </div>
        <div style={{ fontSize: 12, color: '#aaa' }}>처음 리뷰 작성시 10p를 드려요</div>
      </div>
    </div>
  )
}

export default ReviewEmpty
