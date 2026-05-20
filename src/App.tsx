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
  | 'mypage-profile-edit'
  | 'meal-weekly-plan'
  | 'meal-grocery'
  | 'meal-storage'
  | 'recipe'

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
const importProfileEditPage: RouteImporter = () => import('./pages/mypage/ProfileEditPage')
const importWeeklyPlanPage: RouteImporter = () => import('./pages/meal/WeeklyPlanPage')
const importGroceryPage: RouteImporter = () => import('./pages/meal/GroceryPage')
const importStoragePage: RouteImporter = () => import('./pages/meal/StoragePage')
const importChatbotPage: RouteImporter = () => import('./pages/chatbot/Chatbot')
const importChatbotCameraPage: RouteImporter = () => import('./pages/chatbot/ChatbotCamera')
const importChatbotChatPage: RouteImporter = () => import('./pages/chatbot/ChatbotChat')
const importRecipePage: RouteImporter = () => import('./pages/recipe/Recipe')

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
const Recipe = lazy(importRecipePage)
const ProfileEditPage = lazy(importProfileEditPage)

const pages = {
  start: StartPage,
  login: LoginPage,
  signup: SignupPage,
  onboarding: OnboardingPage,
  home: Meal,
  meal: Meal,
  community: Community,
  store: Store,
  recipe: Recipe,
  mypage: MyPage,
  'mypage-likes': LikePage,
  'mypage-saved-recipes': SavedRecipePage,
  'mypage-plus': PlusPage,
  'mypage-plus-benefit': PlusBenefitPage,
  'mypage-profile-edit': ProfileEditPage,
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
  'mypage-profile-edit': importProfileEditPage,
  'meal-weekly-plan': importWeeklyPlanPage,
  'meal-grocery': importGroceryPage,
  'meal-storage': importStoragePage,
  chatbot: importChatbotPage,
  'chatbot-camera': importChatbotCameraPage,
  'chatbot-chat': importChatbotChatPage,
  recipe: importRecipePage,
} satisfies Record<AppRoute, RouteImporter>

const prefetchTargets = {
  start: ['login'],
  login: ['signup'],
  signup: ['onboarding'],
  onboarding: ['home'],
  home: ['community', 'store'],
  meal: ['community', 'store'],
  community: ['home', 'store'],
  store: ['home', 'community'],
  mypage: ['mypage-likes', 'mypage-plus'],
  'mypage-likes': ['mypage'],
  'mypage-saved-recipes': ['mypage'],
  'mypage-plus': ['mypage-plus-benefit'],
  'mypage-plus-benefit': ['mypage-plus', 'mypage'],
  'mypage-profile-edit': ['mypage'],
  'meal-weekly-plan': ['meal-grocery'],
  'meal-grocery': ['meal-storage'],
  'meal-storage': ['meal'],
  chatbot: ['chatbot-chat', 'chatbot-camera'],
  'chatbot-camera': ['chatbot', 'chatbot-chat'],
  'chatbot-chat': ['chatbot'],
  recipe: [],
} satisfies Record<AppRoute, AppRoute[]>

const ONBOARDING_ROUTES = new Set<AppRoute>(['start', 'login', 'signup', 'onboarding'])
const prefetchedRoutes = new Set<AppRoute>()
const warmedImageUrls = new Set<string>()
const PREFETCH_DELAY_MS = 700
const PREFETCH_GAP_MS = 500

const prefetchRoute = (route: AppRoute) => {
  if (prefetchedRoutes.has(route)) return
  prefetchedRoutes.add(route)

  void pageImporters[route]().catch(() => {
    prefetchedRoutes.delete(route)
  })
}

const warmImage = (url: string) => {
  if (!url || warmedImageUrls.has(url)) return
  warmedImageUrls.add(url)

  const image = new Image()
  image.decoding = 'async'
  image.loading = 'eager'
  image.fetchPriority = 'low'
  image.src = url
}

const routeImageWarmups: Partial<Record<AppRoute, () => Promise<string[]>>> = {
  home: async () => {
    const [logoModule] = await Promise.all([
      import('./assets/logos/logo.svg'),
    ])
    return [logoModule.default]
  },
  meal: async () => {
    const [logoModule] = await Promise.all([
      import('./assets/logos/logo.svg'),
    ])
    return [logoModule.default]
  },
  community: async () => {
    const [bannerModule] = await Promise.all([
      import('./pages/community/images/dorak02.png'),
    ])
    return [bannerModule.default]
  },
  store: async () => {
    const [tabIconModule] = await Promise.all([
      import('./components/store/images/storecall_1.svg'),
    ])
    return [tabIconModule.default]
  },
  mypage: async () => {
    const [profileModule] = await Promise.all([
      import('./assets/icons/profile 1.svg?url'),
    ])
    return [profileModule.default]
  },
}

const warmRouteImages = (route: AppRoute) => {
  const warmup = routeImageWarmups[route]
  if (!warmup) return

  void warmup()
    .then((urls) => {
      urls.slice(0, 2).forEach((url) => warmImage(url))
    })
    .catch(() => {})
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
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
    }).connection
    const isSlowNetwork = connection?.saveData || /2g/.test(connection?.effectiveType ?? '')
    if (isSlowNetwork) return

    const nextRoutes = prefetchTargets[route].slice(0, 2)
    if (nextRoutes.length === 0) return

    const timers = nextRoutes.map((nextRoute, index) => (
      window.setTimeout(
        () => {
          prefetchRoute(nextRoute)
          if (index === 0) {
            warmRouteImages(nextRoute)
          }
        },
        PREFETCH_DELAY_MS + PREFETCH_GAP_MS * index,
      )
    ))

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId))
    }
  }, [route])

  return (
    <Suspense fallback={<RouteFallback route={route} />}>
      <Page />
    </Suspense>
  )
}

export default App
