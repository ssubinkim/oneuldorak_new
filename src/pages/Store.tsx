import BottomNav from '../components/common/BottomNav'
import '../styles/Tailwind.css'

function Store() {
  return (
    <div className="home-shell">
      <div className="home-screen">
        <main className="page-placeholder">
          <p>스토어</p>
          <h1>스토어</h1>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

export default Store
