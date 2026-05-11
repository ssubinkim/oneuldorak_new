import './BrandPickSection.css'

const BRANDS = [
  { id: '1', name: '밥픽', icon: '🍱', bg: '#fff5cc' },
  { id: '2', name: '키친무드', icon: '🫕', bg: '#ffe8e8' },
  { id: '3', name: '요미키친', icon: '🍲', bg: '#e8f4ff' },
  { id: '4', name: '한끼랩', icon: '🥗', bg: '#e8ffe8' },
  { id: '5', name: '혹포켓', icon: '🍜', bg: '#f5e8ff' },
]

function BrandPickSection() {
  return (
    <div className="brand-pick">
      <div className="brand-pick__header">
        <div>
          <p className="brand-pick__title">✨ 오늘도락 PICK</p>
          <p className="brand-pick__desc">오늘도락이 추천하는 브랜드</p>
        </div>
        <button className="brand-pick__more" type="button">더보기 &gt;</button>
      </div>
      <div className="brand-pick__track">
        {BRANDS.map(brand => (
          <div key={brand.id} className="brand-pick__item">
            <div className="brand-pick__circle" style={{ background: brand.bg }}>
              <span className="brand-pick__icon">{brand.icon}</span>
            </div>
            <p className="brand-pick__name">{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BrandPickSection
