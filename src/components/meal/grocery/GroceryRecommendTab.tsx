import dorakcrewBannerImg from '../images/dorak_happy.svg'
import { RECOMMEND_ITEMS } from './groceryData'

function GroceryRecommendTab() {
  return (
    <div className="gp-tab-content">
      <div className="gp-rec-banner">
        <p className="gp-rec-banner-text">
          저장한 레시피 기반으로<br />필요한 재료를 추천해요 !
        </p>
        <img src={dorakcrewBannerImg} alt="" className="gp-rec-banner-img" />
      </div>

      <div className="gp-rec-list">
        {RECOMMEND_ITEMS.map((item) => (
          <div key={item.id} className="gp-rec-item">
            <img src={item.image} alt={item.name} className="gp-rec-img" />
            <div className="gp-rec-info">
              <span className="gp-rec-name">{item.name}</span>
              <span className="gp-rec-recipes">{item.recipes}</span>
            </div>
            <button className="gp-rec-add-btn">+</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GroceryRecommendTab
