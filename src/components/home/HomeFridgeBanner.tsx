import fridgeBannerImage from '../../pages/home/images/home-fridge-banner.png'
import './HomeFridgeBanner.css'

function HomeFridgeBanner() {
  return (
    <section className="fridge-banner" aria-label="메뉴 추천받기">
      <img src={fridgeBannerImage} alt="메뉴 추천받기" />
    </section>
  )
}

export default HomeFridgeBanner
