import './RelatedRecipes.css'
import recipe1 from '../../assets/images/food_imges/bibimbap.png'
import recipe2 from '../../assets/images/food_imges/bulgogi.png'
import recipe3 from '../../assets/images/food_imges/chamchimayo.png'
import recipe4 from '../../assets/images/food_imges/kimbok.png'

const RECIPES = [
  { id: '1', text: '비빔밥을 한번 먹어보세요 속이 든든해져요', image: recipe1 },
  { id: '2', text: '불고기를 한번 먹어보세요 속이 든든해져요', image: recipe2 },
  { id: '3', text: '참치마요 덮밥을 한번 먹어보세요 속이 든든해져요', image: recipe3 },
  { id: '4', text: '김볶음을 한번 먹어보세요 속이 든든해져요', image: recipe4 },
]

function RelatedRecipes() {
  return (
    <div className="related-recipes">
      <div className="related-recipes__header">
        <span className="related-recipes__title">
          재료 맞춤 레시피{' '}
          <span className="related-recipes__count">17</span>
        </span>
        <span className="related-recipes__more">더보기 &gt;</span>
      </div>
      <div className="related-recipes__list">
        {RECIPES.map(r => (
          <div key={r.id} className="related-recipes__item">
            <img src={r.image} alt={r.text} className="related-recipes__img" width={72} height={72} loading="lazy" decoding="async" fetchPriority="low" />
            <div className="related-recipes__text">{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedRecipes
