import './MealPage.css'

interface Ingredient {
  id: number
  emoji: string
  name: string
  highlight?: 'red' | 'green'
}

const ingredients: Ingredient[] = [
  { id: 1, emoji: '🥕', name: '당근' },
  { id: 2, emoji: '🥔', name: '감자', highlight: 'green' },
  { id: 3, emoji: '🍎', name: '사과' },
  { id: 4, emoji: '🧅', name: '양파', highlight: 'red' },
  { id: 5, emoji: '🥬', name: '양배추', highlight: 'red' },
  { id: 6, emoji: '🥕', name: '당근' },
  { id: 7, emoji: '🥔', name: '감자' },
  { id: 8, emoji: '🍎', name: '사과' },
  { id: 9, emoji: '🧅', name: '양파' },
  { id: 10, emoji: '🥬', name: '양배추' },
  { id: 11, emoji: '🥕', name: '당근' },
  { id: 12, emoji: '🥔', name: '감자' },
  { id: 13, emoji: '🍎', name: '사과' },
  { id: 14, emoji: '🧅', name: '양파' },
  { id: 15, emoji: '🥬', name: '양배추' },
  { id: 16, emoji: '🍄', name: '버섯' },
  { id: 17, emoji: '🍅', name: '방울토마토' },
]

function MealPage() {
  return (
    <div className="storage-page">
      <div className="storage-header">
        <h2 className="storage-title">내 재료 보관함</h2>
        <button className="storage-add-btn">재료추가 +</button>
      </div>
      <div className="storage-date">5월 14일</div>
      <div className="storage-grid">
        {ingredients.map(item => (
          <div key={item.id} className="storage-item">
            <div className={`storage-item-emoji ${item.highlight ? `highlight-${item.highlight}` : ''}`}>
              {item.emoji}
            </div>
            <span className="storage-item-name">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MealPage
