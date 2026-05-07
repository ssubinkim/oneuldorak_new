import { useEffect, useState } from 'react'
import type { BottomNavRoute } from './components/common/BottomNav'
import Community from './pages/community/Community'
import Chatbot from './pages/chatbot/Chatbot'
import Home from './pages/home/Home'
import Meal from './pages/meal/Meal'
import MyPage from './pages/mypage/MyPage'
import Store from './pages/store/Store'

type AppRoute = BottomNavRoute | 'chatbot'

const pages = {
  home: Home,
  meal: Meal,
  community: Community,
  store: Store,
  mypage: MyPage,
  chatbot: Chatbot,
} satisfies Record<AppRoute, () => React.JSX.Element>

function getRouteFromHash(): AppRoute {
  const route = window.location.hash.replace('#/', '') as AppRoute

  if (route in pages) {
    return route
  }

  return 'home'
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
