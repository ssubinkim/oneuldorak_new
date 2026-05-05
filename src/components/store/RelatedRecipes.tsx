const RECIPES = [
  { id: '1', text: '이 재료로는 이 음식을 해 먹으면 아주 좋아여 한번 해보세요' },
  { id: '2', text: '이 재료로는 이 음식을 해 먹으면 아주 좋아여 한번 해보세요' },
  { id: '3', text: '이 재료로는 이 음식을 해 먹으면 아주 좋아여 한번 해보세요' },
  { id: '4', text: '이 재료로는 이 음식을 해 먹으면 아주 좋아여 한번 해보세요' },
]

function RelatedRecipes() {
  return (
    <div style={{ padding: '24px 0 0' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 16px', marginBottom: 12,
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>
          재료와 어울리는 레시피 추천{' '}
          <span style={{ color: '#aaa', fontWeight: 400 }}>17</span>
        </span>
        <span style={{ fontSize: 12, color: '#888', cursor: 'pointer', whiteSpace: 'nowrap' }}>전체보기 &gt;</span>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 16px', scrollbarWidth: 'none' }}>
        {RECIPES.map(r => (
          <div key={r.id} style={{ flex: '0 0 100px', cursor: 'pointer' }}>
            <div style={{ width: 100, height: 80, background: '#e8e8e8', borderRadius: 8, marginBottom: 6 }} />
            <div style={{
              fontSize: 10, color: '#555', lineHeight: 1.4,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {r.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedRecipes
