import BottomNav from '../components/common/BottomNav'
import Header from '../components/common/Header'
import '../styles/Tailwind.css'

function Community() {
  return (
    <div className="home-shell">
      <div className="home-screen">
        <Header />
        <main className="page-placeholder">
          <p>커뮤니티</p>
          <h1>커뮤니티</h1>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

export default Community
