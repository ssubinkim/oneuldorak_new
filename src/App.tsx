import { Suspense, lazy, startTransition, useEffect, useState, type ComponentType } from 'react'
import type { BottomNavRoute } from './components/common/layout/BottomNav'

type AppRoute =
  | BottomNavRoute
  | 'start'
  | 'login'
  | 'signup'
  | 'onboarding'
  | 'chatbot'
  | 'chatbot-camera'
  | 'chatbot-chat'
  | 'mypage-likes'
  | 'mypage-saved-recipes'
  | 'mypage-plus'
  | 'mypage-plus-benefit'
  | 'meal-weekly-plan'
  | 'meal-grocery'
  | 'meal-storage'

type PageComponent = ComponentType
type PageModule = { default: PageComponent }
type RouteImporter = () => Promise<PageModule>

const importStartPage: RouteImporter = () => import('./pages/onboarding/StartPage')
const importLoginPage: RouteImporter = () => import('./pages/onboarding/LoginPage')
const importSignupPage: RouteImporter = () => import('./pages/onboarding/SignupPage')
const importOnboardingPage: RouteImporter = () => import('./pages/onboarding/OnboardingPage')
const importMealPage: RouteImporter = () => import('./pages/meal/Meal')
const importCommunityPage: RouteImporter = () => import('./pages/community/Community')
const importStorePage: RouteImporter = () => import('./pages/store/Store')
const importMyPage: RouteImporter = () => import('./pages/mypage/MyPage')
const importLikePage: RouteImporter = () => import('./pages/mypage/LikePage')
const importSavedRecipePage: RouteImporter = () => import('./pages/mypage/SavedRecipePage')
const importPlusPage: RouteImporter = () => import('./pages/mypage/PlusPage')
const importPlusBenefitPage: RouteImporter = () => import('./pages/mypage/PlusBenefitPage')
const importWeeklyPlanPage: RouteImporter = () => import('./pages/meal/WeeklyPlanPage')
const importGroceryPage: RouteImporter = () => import('./pages/meal/GroceryPage')
const importStoragePage: RouteImporter = () => import('./pages/meal/StoragePage')
const importChatbotPage: RouteImporter = () => import('./pages/chatbot/Chatbot')
const importChatbotCameraPage: RouteImporter = () => import('./pages/chatbot/ChatbotCamera')
const importChatbotChatPage: RouteImporter = () => import('./pages/chatbot/ChatbotChat')

const StartPage = lazy(importStartPage)
const LoginPage = lazy(importLoginPage)
const SignupPage = lazy(importSignupPage)
const OnboardingPage = lazy(importOnboardingPage)
const Meal = lazy(importMealPage)
const Community = lazy(importCommunityPage)
const Store = lazy(importStorePage)
const MyPage = lazy(importMyPage)
const LikePage = lazy(importLikePage)
const SavedRecipePage = lazy(importSavedRecipePage)
const PlusPage = lazy(importPlusPage)
const PlusBenefitPage = lazy(importPlusBenefitPage)
const WeeklyPlanPage = lazy(importWeeklyPlanPage)
const GroceryPage = lazy(importGroceryPage)
const StoragePage = lazy(importStoragePage)
const Chatbot = lazy(importChatbotPage)
const ChatbotCamera = lazy(importChatbotCameraPage)
const ChatbotChat = lazy(importChatbotChatPage)

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
  'mypage-likes': LikePage,
  'mypage-saved-recipes': SavedRecipePage,
  'mypage-plus': PlusPage,
  'mypage-plus-benefit': PlusBenefitPage,
  'meal-weekly-plan': WeeklyPlanPage,
  'meal-grocery': GroceryPage,
  'meal-storage': StoragePage,
  chatbot: Chatbot,
  'chatbot-camera': ChatbotCamera,
  'chatbot-chat': ChatbotChat,
} satisfies Record<AppRoute, PageComponent>

const pageImporters = {
  start: importStartPage,
  login: importLoginPage,
  signup: importSignupPage,
  onboarding: importOnboardingPage,
  home: importMealPage,
  meal: importMealPage,
  community: importCommunityPage,
  store: importStorePage,
  mypage: importMyPage,
  'mypage-likes': importLikePage,
  'mypage-saved-recipes': importSavedRecipePage,
  'mypage-plus': importPlusPage,
  'mypage-plus-benefit': importPlusBenefitPage,
  'meal-weekly-plan': importWeeklyPlanPage,
  'meal-grocery': importGroceryPage,
  'meal-storage': importStoragePage,
  chatbot: importChatbotPage,
  'chatbot-camera': importChatbotCameraPage,
  'chatbot-chat': importChatbotChatPage,
} satisfies Record<AppRoute, RouteImporter>

const prefetchTargets = {
  start: ['login', 'signup'],
  login: ['signup', 'home'],
  signup: ['onboarding'],
  onboarding: ['home', 'meal'],
  home: ['community', 'store', 'mypage', 'chatbot'],
  meal: ['community', 'store', 'mypage', 'chatbot'],
  community: ['meal', 'store', 'mypage'],
  store: ['meal', 'community', 'mypage'],
  mypage: ['mypage-likes', 'mypage-plus', 'mypage-plus-benefit', 'meal'],
  'mypage-likes': ['mypage'],
  'mypage-saved-recipes': ['mypage'],
  'mypage-plus': ['mypage-plus-benefit', 'mypage'],
  'mypage-plus-benefit': ['mypage-plus', 'mypage'],
  'meal-weekly-plan': ['meal-grocery', 'meal'],
  'meal-grocery': ['meal-weekly-plan', 'meal-storage', 'meal'],
  'meal-storage': ['meal-grocery', 'meal'],
  chatbot: ['chatbot-chat', 'chatbot-camera', 'home'],
  'chatbot-camera': ['chatbot', 'chatbot-chat'],
  'chatbot-chat': ['chatbot', 'community'],
} satisfies Record<AppRoute, AppRoute[]>

const ONBOARDING_ROUTES = new Set<AppRoute>(['start', 'login', 'signup', 'onboarding'])
const prefetchedRoutes = new Set<AppRoute>()

const prefetchRoute = (route: AppRoute) => {
  if (prefetchedRoutes.has(route)) return
  prefetchedRoutes.add(route)

  void pageImporters[route]().catch(() => {
    prefetchedRoutes.delete(route)
  })
}

function RouteFallback({ route }: { route: AppRoute }) {
  const backgroundColor = ONBOARDING_ROUTES.has(route) ? 'var(--color-tertiary-90)' : 'var(--color-bg-base)'

  return (
    <div className="app-shell" aria-hidden="true">
      <div className="app-screen" style={{ backgroundColor }} />
    </div>
  )
}

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
      startTransition(() => {
        setRoute(getRouteFromHash())
      })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    const nextRoutes = prefetchTargets[route]
    nextRoutes.forEach((nextRoute) => prefetchRoute(nextRoute))
  }, [route])

  return (
    <Suspense fallback={<RouteFallback route={route} />}>
      <Page />
    </Suspense>
  )
}

export default App
