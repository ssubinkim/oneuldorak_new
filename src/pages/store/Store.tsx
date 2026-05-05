import { useState } from 'react'
import Header from '../../components/common/Header'
import BottomNav from '../../components/common/BottomNav'
import StoreMain from '../../components/store/StoreMain'
import StoreDetail from '../../components/store/StoreDetail'
import '../../styles/Tailwind.css'

type View = 'home' | 'detail'

function Store() {
  const [view, setView] = useState<View>('home')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function handleSelect(id: string) {
    setSelectedId(id)
    setView('detail')
  }

  function handleBack() {
    setView('home')
  }

  return (
    <div className="home-shell">
      <div className="home-screen">
        <Header />

        <div className="page-scroll">
          {view === 'home'
            ? <StoreMain onSelect={handleSelect} />
            : <StoreDetail productId={selectedId} onBack={handleBack} onSelectProduct={handleSelect} />
          }
        </div>

        {view === 'home' && <BottomNav />}

        {view === 'detail' && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', background: '#fff', borderTop: '1px solid #eee',
            height: 64, boxSizing: 'border-box',
          }}>
            <button style={{
              width: 44, height: 44, borderRadius: 8, border: '1px solid #ddd',
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}>
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#555" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button style={{
              width: 44, height: 44, borderRadius: 8, border: '1px solid #ddd',
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}>
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#555" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </button>
            <button style={{
              flex: 1, height: 44, borderRadius: 8, border: 'none',
              background: '#333', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}>
              구매하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Store
