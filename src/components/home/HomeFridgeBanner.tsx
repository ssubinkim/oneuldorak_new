import './HomeFridgeBanner.css'

function HomeFridgeBanner() {
  return (
    <section className="fridge-banner" aria-label="메뉴 추천받기">
      <div className="fridge-banner__door" aria-hidden="true" />
      <div className="fridge-banner__content">
        <h2>메뉴 추천받기</h2>
        <p>
          냉장고 속 재료로
          <br />
          딱 맞는 메뉴를 추천받아보세요
        </p>
      </div>
      <span className="fridge-banner__arrow" aria-hidden="true">〉</span>
    </section>
  )
}

export default HomeFridgeBanner
