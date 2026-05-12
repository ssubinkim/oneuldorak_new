import { useState } from 'react'
import Header from '../../components/common/layout/Header'
import BottomNav from '../../components/common/layout/BottomNav'
import StoreMain from '../../components/store/StoreMain'
import StoreDetailPage from './StoreDetailPage'
import { type Product } from '../../components/store/ProductCard'
import '../../styles/Tailwind.css'
import './Store.css'

type View = 'home' | 'detail'

function Store() {
  const [view, setView] = useState<View>('home')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  function handleSelect(product: Product) {
    setSelectedProduct(product)
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
            product={selectedProduct}
            onBack={handleBack}
            onSelectProduct={handleSelect}
          />
        )}
      </div>
    </div>
  )
}

export default Store
