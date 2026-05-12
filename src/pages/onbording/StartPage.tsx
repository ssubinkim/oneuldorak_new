import { useEffect } from 'react'
import StartLunchboxVisual from '../../components/onbording/startpage/StartLunchboxVisual'
import '../../styles/Tailwind.css'
import './StartPage.css'

function StartPage() {
  useEffect(() => {
    const timerId = window.setTimeout(() => {
      window.location.hash = '#/login'
    }, 2000)

    return () => window.clearTimeout(timerId)
  }, [])

  return (
    <div className="app-shell">
      <main className="app-screen start-page-screen">
        <section className="start-page" aria-label="오늘도락 시작 화면">
          <StartLunchboxVisual />
        </section>
      </main>
    </div>
  )
}

export default StartPage
