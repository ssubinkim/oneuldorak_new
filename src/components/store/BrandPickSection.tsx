import './BrandPickSection.css'
import logo1 from './images/storelogo_1.png'
import logo2 from './images/storelogo_2.png'
import logo3 from './images/storelogo_3.png'
import logo4 from './images/storelogo_4.png'
import logo5 from './images/storelogo_5.png'

const BRANDS = [
  { id: '1', name: '밥픽', logo: logo1 },
  { id: '2', name: '키친무드', logo: logo2 },
  { id: '3', name: '요미키친', logo: logo3 },
  { id: '4', name: '한끼랩', logo: logo4 },
  { id: '5', name: '혹포켓', logo: logo5 },
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
            <div className="brand-pick__circle">
              <img className="brand-pick__logo" src={brand.logo} alt={brand.name} />
            </div>
            <p className="brand-pick__name">{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BrandPickSection
