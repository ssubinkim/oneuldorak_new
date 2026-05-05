import { useState } from 'react'
import BottomNav from '../../components/common/BottomNav'
import Header from '../../components/common/Header'
import '../../styles/Tailwind.css'

const todayMenus = [
  {
    id: 1, emoji: '🥗', name: '연어 샐러드', time: '15분',
    ingredients: '연어(훈제연어), 양파, 양상추, 마요네즈, 홀그레인 머스타드, 삶은계란'
  },
  {
    id: 2, emoji: '🍱', name: '닭가슴살 현미도시락', time: '20분',
    ingredients: '닭가슴살, 현미밥, 브로콜리, 당근, 간장, 참기름'
  },
]

const weeklyMenus = [
  { day: '월', emoji: '🍚', name: '김치볶음밥', ingredients: '김치찌개, 김치찜, 김치전, 김치볶음밥' },
  { day: '화', emoji: '🍲', name: '된장찌개', ingredients: '김치찌개, 김치찜, 김치전, 김치볶음밥' },
  { day: '수', emoji: '🫐', name: '블루베리 요거트', ingredients: '김치찌개, 김치찜, 김치전, 김치볶음밥' },
]

const weekDays = [
  { name: '월', date: 6 }, { name: '화', date: 7 },
  { name: '수', date: 8 }, { name: '목', date: 9 },
  { name: '금', date: 10 }, { name: '토', date: 11 }, { name: '일', date: 12 },
]

const chatChips = ['살까말까', '요리 알려줘', '살까말까', '요리 알려줘']

function Meal() {
  const [topTab, setTopTab] = useState<'week' | 'storage'>('week')
  const [menuTab, setMenuTab] = useState<'today' | 'weekly'>('today')
  const [selectedDay, setSelectedDay] = useState(7)
  const [calOpen, setCalOpen] = useState(false)
  const [fabOpen, setFabOpen] = useState(false)

  return (
    <div className="app-shell">
      <div className="app-screen">
        <Header />

        <div className="page-scroll">
          {/* 상단 탭 */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e8e8e8', padding: '0 16px' }}>
            {(['week', 'storage'] as const).map((tab, i) => (
              <div key={tab} onClick={() => setTopTab(tab)} style={{
                fontSize: 14, padding: '14px 0', marginRight: 20, cursor: 'pointer',
                fontWeight: topTab === tab ? 700 : 400,
                color: topTab === tab ? '#111' : '#aaa',
                borderBottom: topTab === tab ? '2px solid #111' : '2px solid transparent',
              }}>
                {['이번주 도시락', '내 재료보관함'][i]}
              </div>
            ))}
          </div>

          {topTab === 'week' && (
            <>
              {/* 날짜 영역 */}
              <div style={{ padding: '16px 16px 0' }}>
                <div onClick={() => setCalOpen(!calOpen)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>2026년 5월</span>
                  <span style={{ fontSize: 12, color: '#555' }}>{calOpen ? '▲' : '▼'}</span>
                </div>

                {calOpen && (
                  <div style={{ background: '#f2f2f2', borderRadius: 16, padding: 20, marginTop: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>2026년 5월</div>
                    <div style={{ fontSize: 13, color: '#888', textAlign: 'center' }}>달력 컴포넌트</div>
                  </div>
                )}

                {/* 주간 요일 선택 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, gap: 4 }}>
                  {weekDays.map(d => (
                    <button key={d.date} onClick={() => setSelectedDay(d.date)}
                      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <span style={{ fontSize: 11, color: '#aaa' }}>{d.name}</span>
                      <span style={{
                        fontSize: 15, fontWeight: selectedDay === d.date ? 700 : 500,
                        width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '50%',
                        background: selectedDay === d.date ? '#111' : 'transparent',
                        color: selectedDay === d.date ? '#fff' : '#333',
                      }}>
                        {d.date}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 오늘의 메뉴 / 주간 메뉴 탭 */}
              <div style={{ display: 'flex', margin: '16px 16px 0', background: '#f4f4f4', borderRadius: 10, padding: 3 }}>
                {(['today', 'weekly'] as const).map((tab, i) => (
                  <div key={tab} onClick={() => setMenuTab(tab)} style={{
                    flex: 1, textAlign: 'center', padding: '8px 0', fontSize: 13, cursor: 'pointer', fontWeight: menuTab === tab ? 700 : 500,
                    borderRadius: 8, color: menuTab === tab ? '#111' : '#888',
                    background: menuTab === tab ? '#fff' : 'transparent',
                    boxShadow: menuTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}>
                    {['오늘의 메뉴', '주간 메뉴'][i]}
                  </div>
                ))}
              </div>

              {/* 메뉴 리스트 */}
              <div style={{ padding: 16 }}>
                {menuTab === 'today' ? (
                  <>
                    {todayMenus.map(m => (
                      <div key={m.id} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '0.5px solid #f0f0f0' }}>
                        <div style={{ width: 72, height: 72, background: '#e8e8e8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                          {m.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: '#888', marginBottom: 3 }}>소요시간 : {m.time}</div>
                          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{m.name}</div>
                          <div style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>준비 재료</div>
                          <div style={{ fontSize: 11, color: '#888', lineHeight: 1.5 }}>{m.ingredients}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ textAlign: 'right', padding: '12px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      레시피 보러가기 ›
                    </div>
                  </>
                ) : (
                  <>
                    {weeklyMenus.map(m => (
                      <div key={m.day}>
                        <div style={{ fontSize: 11, color: '#aaa', marginBottom: 8, marginTop: 4 }}>{m.day}</div>
                        <div style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '0.5px solid #f0f0f0' }}>
                          <div style={{ width: 72, height: 72, background: '#e8e8e8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                            {m.emoji}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>가능한 요리</div>
                            <div style={{ fontSize: 11, color: '#888' }}>{m.ingredients}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{ textAlign: 'right', padding: '12px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      다른 레시피 보러가기 ›
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* AI 챗봇 플로팅 버튼 */}
        {fabOpen && (
          <div style={{ position: 'absolute', bottom: 90, right: 24, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', zIndex: 99 }}>
            {chatChips.map((chip, i) => (
              <div key={i} onClick={() => { window.location.hash = '#/chatbot' }} style={{
                background: '#1a1a2e', color: '#fff', fontSize: 12, padding: '8px 14px',
                borderRadius: 20, cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                {chip}
              </div>
            ))}
          </div>
        )}

        <button onClick={() => setFabOpen(!fabOpen)} style={{
          position: 'absolute', bottom: 80, right: 24,
          width: 56, height: 56, borderRadius: '50%',
          background: '#1a1a2e', border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)', fontSize: 26, zIndex: 100,
        }}>
          🥦
        </button>

        <BottomNav />
      </div>
    </div>
  )
}

export default Meal
