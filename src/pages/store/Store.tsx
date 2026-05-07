import { useState } from 'react'
import Header from '../../components/common/Header'
import BottomNav from '../../components/common/BottomNav'
import StoreMain from '../../components/store/StoreMain'
import StoreDetailPage from './StoreDetailPage'
import '../../styles/Tailwind.css'
import './Store.css'

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
    <div className="app-shell store-page">
      <div className="app-screen store-page__screen">
        <Header />

        {view === 'home' ? (
          <>
            <div className="page-scroll store-page__scroll">
              <StoreMain onSelect={handleSelect} />
            </div>
            <BottomNav />
          </>
        ) : (
          <StoreDetailPage
            productId={selectedId}
            onBack={handleBack}
            onSelectProduct={handleSelect}
          />
        )}
      </div>
    </div>
  )
}

export default Store
