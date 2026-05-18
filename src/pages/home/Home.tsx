// import BottomNav from '../../components/common/layout/BottomNav'
import Header from '../../components/common/layout/Header'
import ChatBotbtn from '../../components/chatbot/ChatBotbtn'
import HomeBudgetHero from '../../components/home/HomeBudgetHero'
import HomeFridgeBanner from '../../components/home/HomeFridgeBanner'
import HomeHeaderBar from '../../components/home/HomeHeaderBar'
import HomeQuickActions from '../../components/home/HomeQuickActions'
import HomeRecipeSection from '../../components/home/HomeRecipeSection'
import HomeStories from '../../components/home/HomeStories'
import HomeTodayLunch from '../../components/home/HomeTodayLunch'
import HomeTomorrowRecommendation from '../../components/home/HomeTomorrowRecommendation'
import '../../styles/Tailwind.css'
import './Home.css'

function Home() {
  return (
    <div className="app-shell">
      <div className="app-screen home-screen font-nanum-square-neo">
        <Header />

        <div className="home-scroll">
          <HomeHeaderBar />

          <main className="home-main">
            <HomeBudgetHero />
            <HomeTodayLunch />
            <HomeQuickActions />
            <HomeTomorrowRecommendation />
            <HomeFridgeBanner />
            <HomeStories />
            <HomeRecipeSection />
          </main>
        </div>

        <ChatBotbtn />
        {/* <BottomNav /> */}
      </div>
    </div>
  )
}

export default Home
