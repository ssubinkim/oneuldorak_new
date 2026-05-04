export function FridgeIllustration() {
  return (
    <svg className="fridge-illustration" viewBox="0 0 92 92" aria-hidden="true">
      <defs>
        <linearGradient id="fridgeBody" x1="18" x2="74" y1="8" y2="84">
          <stop stopColor="#fbfbff" />
          <stop offset="1" stopColor="#cdd5e4" />
        </linearGradient>
      </defs>
      <path d="M18 12 67 5l7 76-49 7-7-76Z" fill="url(#fridgeBody)" />
      <path d="M22 16 64 10l2.3 26.5-41.8 6L22 16ZM25 47l42-6 3 34-42 6-3-34Z" fill="#f7f8ff" />
      <path d="M37 27h5M39 58h5" stroke="#b3bdca" strokeLinecap="round" strokeWidth="3" />
      <rect x="43" y="50" width="11" height="7" rx="3.5" fill="#f55774" />
      <rect x="56" y="49" width="11" height="8" rx="4" fill="#8ac857" />
      <rect x="39" y="63" width="11" height="7" rx="3.5" fill="#f4d442" />
      <rect x="52" y="63" width="14" height="8" rx="4" fill="#6d8bf4" />
      <rect x="48" y="25" width="10" height="7" rx="3.5" fill="#d74ad8" />
      <rect x="58" y="23" width="8" height="7" rx="3.5" fill="#ea3d3d" />
    </svg>
  )
}
