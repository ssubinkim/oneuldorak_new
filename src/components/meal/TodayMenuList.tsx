import MenuCard from './MenuCard'

const todayMenus = [
  {
    id: 1,
    emoji: '🥗',
    name: '연어 샐러드',
    time: '15분',
    ingredients: '연어(훈제연어), 양파, 양상추, 마요네즈, 홀그레인 머스타드, 삶은계란',
  },
  {
    id: 2,
    emoji: '🍱',
    name: '닭가슴살 현미도시락',
    time: '20분',
    ingredients: '닭가슴살, 현미밥, 브로콜리, 당근, 간장, 참기름',
  },
]

function TodayMenuList() {
  return (
    <div>
      {todayMenus.map(m => (
        <MenuCard
          key={m.id}
          emoji={m.emoji}
          name={m.name}
          time={m.time}
          ingredients={m.ingredients}
          subLabel="준비 재료"
        />
      ))}
      <div className="recipe-link">레시피 보러가기 ›</div>
    </div>
  )
}

export default TodayMenuList
