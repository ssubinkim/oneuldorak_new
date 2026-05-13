import recipe1 from '../meal/images/bibimbap.png'
import recipe2 from '../meal/images/bulgogi.png'
import recipe3 from '../meal/images/chamchimayo.png'
import recipe4 from '../meal/images/kimbok.png'

const RECIPES = [
  { id: '1', text: '비빔밥을 한번 먹어보세요 속이 든든해져요', image: recipe1 },
  { id: '2', text: '불고기를 한번 먹어보세요 속이 든든해져요', image: recipe2 },
  { id: '3', text: '참치마요 덮밥을 한번 먹어보세요 속이 든든해져요', image: recipe3 },
  { id: '4', text: '김볶음을 한번 먹어보세요 속이 든든해져요', image: recipe4 },
]

function RelatedRecipes() {
  return (
    <div style={{ padding: '24px 0 0', borderBottom: '1px solid #eee', paddingBottom: 24 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '0 16px', marginBottom: 16,
      }}>
        <span style={{ fontSize: 18, fontWeight: 500, color: '#3c3c3c' }}>
          재료와 어울리는 레시피 추천{' '}
          <span style={{ color: '#aaa', fontWeight: 400 }}>17</span>
        </span>
        <span style={{ fontSize: 14, color: '#888', cursor: 'pointer', whiteSpace: 'nowrap' }}>전체보기 &gt;</span>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 16px', scrollbarWidth: 'none' }}>
        {RECIPES.map(r => (
          <div key={r.id} style={{ flex: '0 0 100px', cursor: 'pointer' }}>
            <img src={r.image} alt={r.text} style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 6, display: 'block' }} />
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
