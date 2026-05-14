import StartLunchboxVisual from '../../components/onboarding/startpage/StartLunchboxVisual'
import '../../styles/Tailwind.css'
import './StartPage.css'

function StartPage() {
  function handleVideoEnded() {
    window.location.hash = '#/login'
  }

  return (
    <div className="app-shell">
      <main className="app-screen start-page-screen">
        <section className="start-page" aria-label="오늘도락 시작 화면">
          <StartLunchboxVisual onEnded={handleVideoEnded} />
        </section>
      </main>
    </div>
  )
}

export default StartPage
