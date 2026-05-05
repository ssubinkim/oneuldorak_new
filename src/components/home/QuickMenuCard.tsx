// QuickMenuCard 안에서만 쓰는 빠른 메뉴용 음식 아이콘입니다.
function MealOptionIcon() {
  return (
    <svg className="meal-option-icon" viewBox="0 0 34 34" aria-hidden="true">
      <path d="M7.4 16c.5-5.1 4.3-8 9.6-8s9.1 2.9 9.6 8H7.4Z" />
      <path d="M6.6 20.6h20.8" />
      <path d="M8.1 24.6h17.8" />
      <path d="M9.4 16.1c.5 1.2 1.4 1.2 2.1 0 .7-1.2 1.6-1.2 2.3 0 .7 1.2 1.6 1.2 2.3 0 .7-1.2 1.6-1.2 2.3 0 .7 1.2 1.6 1.2 2.3 0 .7-1.2 1.6-1.2 2.1 0" />
      <path d="M10.7 11.8h.1M14.8 10.3h.1M19.5 10.9h.1M23 12.6h.1" />
    </svg>
  )
}

type QuickMenuCardProps = {
  label: string
  onClick?: () => void
}

// 도시락 SOS 영역의 아이콘, 텍스트, 배경을 하나로 묶은 빠른 메뉴 카드입니다.
export function QuickMenuCard({ label, onClick }: QuickMenuCardProps) {
  return (
    <button type="button" className="quick-menu-card" onClick={onClick}>
      <MealOptionIcon />
      <span>{label}</span>
    </button>
  )
}
