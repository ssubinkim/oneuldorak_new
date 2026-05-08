import {
  carrotImg, potatoImg, appleImg, onionImg, romainImg,
  brocollyImg, beansproutsImg, garlicImg, chiliImg, tofuImg,
  meatImg, tunaImg, salmonImg, porkImg, sosageImg,
} from './mealData'

interface Props {
  onBack: () => void
}

interface Ingredient {
  id: number
  image: string
  name: string
  highlight?: 'red' | 'green'
}

const allIngredients: Ingredient[] = [
  { id: 1,  image: carrotImg,      name: '당근' },
  { id: 2,  image: potatoImg,      name: '감자',     highlight: 'green' },
  { id: 3,  image: appleImg,       name: '사과' },
  { id: 4,  image: onionImg,       name: '양파',     highlight: 'red' },
  { id: 5,  image: romainImg,      name: '양상추',   highlight: 'red' },
  { id: 6,  image: garlicImg,      name: '마늘' },
  { id: 7,  image: brocollyImg,    name: '브로콜리' },
  { id: 8,  image: beansproutsImg, name: '콩나물' },
  { id: 9,  image: chiliImg,       name: '고추' },
  { id: 10, image: tofuImg,        name: '두부' },
  { id: 11, image: meatImg,        name: '고기' },
  { id: 12, image: tunaImg,        name: '참치' },
  { id: 13, image: salmonImg,      name: '연어' },
  { id: 14, image: porkImg,        name: '돼지고기' },
  { id: 15, image: sosageImg,      name: '소시지' },
  { id: 16, image: carrotImg,      name: '당근' },
  { id: 17, image: potatoImg,      name: '감자' },
]

function StorageAll({ onBack }: Props) {
  return (
    <div className="storage-page">
      <div className="storage-all-header">
        <button className="storage-back-btn" onClick={onBack}>
          ← 재료 보관함
        </button>
        <button className="storage-add-btn">재료추가 +</button>
      </div>
      <div className="storage-date">5월 14일</div>
      <div className="storage-grid">
        {allIngredients.map(item => (
          <div key={item.id} className="storage-item">
            <div className={`storage-item-emoji${item.highlight ? ` highlight-${item.highlight}` : ''}`}>
              <img className="storage-item-img" src={item.image} alt={item.name} />
            </div>
            <span className="storage-item-name">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StorageAll
