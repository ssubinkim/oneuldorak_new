export function CostChart() {
  return (
    <svg className="cost-chart" viewBox="0 0 160 82" aria-label="이번주 예상 식비 그래프">
      <path d="M14 63h133M14 47h133M14 31h133M14 15h133" />
      <path
        d="M17 45 43 15 69 30 95 65 121 37 147 36 147 70 17 70Z"
        className="cost-chart__fill"
      />
      <path d="M17 45 43 15 69 30 95 65 121 37 147 36" className="cost-chart__line" />
      <g>
        <circle cx="17" cy="45" r="2.3" />
        <circle cx="43" cy="15" r="2.3" />
        <circle cx="69" cy="30" r="2.3" />
        <circle cx="95" cy="65" r="2.3" />
        <circle cx="121" cy="37" r="2.3" />
        <circle cx="147" cy="36" r="2.3" />
      </g>
      <text x="10" y="78">Mon</text>
      <text x="36" y="78">Tue</text>
      <text x="63" y="78">Wed</text>
      <text x="90" y="78">Thu</text>
      <text x="116" y="78">Fri</text>
      <text x="141" y="78">Sun</text>
    </svg>
  )
}
