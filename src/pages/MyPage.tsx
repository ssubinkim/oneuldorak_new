import BottomNav from '../components/common/BottomNav'
import '../styles/Tailwind.css'

function MyPage() {
  return (
    <div className="home-shell">
      <div className="home-screen">
        <main className="page-placeholder">
          <p>마이</p>
          <h1>마이</h1>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

export default MyPage
