import { useId } from 'react'
import './StoreSectionHeader.css'
import { ArrowRightIcon } from '../common/ui/ArrowRightIcon'
import './BrandPickSection.css'
import starIcon from './images/star.png'
import logo1 from './images/storelogo_1.png'
import logo2 from './images/storelogo_2.png'
import logo3 from './images/storelogo_3.png'
import logo4 from './images/storelogo_4.png'
import logo5 from './images/storelogo_5.png'

const BRANDS = [
  { id: '1', name: '프레시잇', logo: logo1 },
  { id: '2', name: '파머스픽', logo: logo2 },
  { id: '3', name: '팜스토리', logo: logo3 },
  { id: '4', name: '모노메이트', logo: logo4 },
  { id: '5', name: '밥픽', logo: logo5 },
]

function BrandPickSection() {
  const titleId = useId()
  return (
    <section className="brand-pick" aria-labelledby={titleId}>
      <div className="store-section__header">
        <div className="store-section__title-group">
          <h2 id={titleId} className="store-section__title">
            <img src={starIcon} alt="" className="store-section__icon" width={22} height={22} loading="lazy" decoding="async" fetchPriority="low" />
            오늘도락 PICK
          </h2>
          <p className="store-section__subtitle">오늘도락이 추천하는 브랜드</p>
        </div>
        <button className="store-section__more" type="button" disabled>더보기 <ArrowRightIcon /></button>
      </div>
      <div className="brand-pick__track">
        {BRANDS.map(brand => (
          <div key={brand.id} className="brand-pick__item">
            <div className="brand-pick__circle">
              <img
                className="brand-pick__logo store-img-fade"
                src={brand.logo}
                alt={brand.name}
                width={70}
                height={70}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                data-loaded="false"
                onLoad={(event) => {
                  event.currentTarget.dataset.loaded = 'true'
                }}
                onError={(event) => {
                  event.currentTarget.dataset.loaded = 'true'
                }}
              />
            </div>
            <p className="brand-pick__name">{brand.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default BrandPickSection
