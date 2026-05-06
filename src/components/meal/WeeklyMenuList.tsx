import MenuCard from './MenuCard'

const weeklyMenus = [
  { day: '월', emoji: '🍚', name: '김치볶음밥', ingredients: '김치찌개, 김치찜, 김치전, 김치볶음밥' },
  { day: '화', emoji: '🍲', name: '된장찌개', ingredients: '김치찌개, 김치찜, 김치전, 김치볶음밥' },
  { day: '수', emoji: '🫐', name: '블루베리 요거트', ingredients: '김치찌개, 김치찜, 김치전, 김치볶음밥' },
]

function WeeklyMenuList() {
  return (
    <div>
      {weeklyMenus.map(m => (
        <MenuCard
          key={m.day}
          day={m.day}
          emoji={m.emoji}
          name={m.name}
          ingredients={m.ingredients}
          subLabel="가능한 요리"
        />
      ))}
      <div className="recipe-link">다른 레시피 보러가기 ›</div>
    </div>
  )
}

export default WeeklyMenuList
