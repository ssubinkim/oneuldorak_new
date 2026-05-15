import { useEffect, useState } from 'react'
import type { BottomNavRoute } from './components/common/layout/BottomNav'
import Community from './pages/community/Community'
import Chatbot from './pages/chatbot/Chatbot'
import ChatbotCamera from './pages/chatbot/ChatbotCamera'
import Meal from './pages/meal/Meal'
import WeeklyPlanPage from './pages/meal/WeeklyPlanPage'
import GroceryPage from './pages/meal/GroceryPage'
import StoragePage from './pages/meal/StoragePage'
import MyPage from './pages/mypage/MyPage'
import LikePage from './pages/mypage/LikePage'
import SavedRecipePage from './pages/mypage/SavedRecipePage'
import LoginPage from './pages/onboarding/LoginPage'
import OnboardingPage from './pages/onboarding/OnboardingPage'
import SignupPage from './pages/onboarding/SignupPage'
import StartPage from './pages/onboarding/StartPage'
import Store from './pages/store/Store'

type AppRoute =
  | BottomNavRoute
  | 'start'
  | 'login'
  | 'signup'
  | 'onboarding'
  | 'chatbot'
  | 'chatbot-camera'
  | 'mypage-likes'
  | 'mypage-saved-recipes'
  | 'meal-weekly-plan'
  | 'meal-grocery'
  | 'meal-storage'

const pages = {
  start: StartPage,
  login: LoginPage,
  signup: SignupPage,
  onboarding: OnboardingPage,
  home: Meal,
  meal: Meal,
  community: Community,
  store: Store,
  mypage: MyPage,
  'mypage-likes': () => <LikePage />,
  'mypage-saved-recipes': () => <SavedRecipePage />,
  'meal-weekly-plan': () => <WeeklyPlanPage />,
  'meal-grocery': () => <GroceryPage />,
  'meal-storage': () => <StoragePage />,
  chatbot: Chatbot,
  'chatbot-camera': ChatbotCamera,
} satisfies Record<AppRoute, () => React.JSX.Element>

function getRouteFromHash(): AppRoute {
  const route = window.location.hash.replace('#/', '').split('?')[0] as AppRoute

  if (route in pages) {
    return route
  }

  return 'start'
}

function App() {
  const [route, setRoute] = useState(getRouteFromHash)
  const Page = pages[route]

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return <Page />
}

export default App
