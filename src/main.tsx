import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerAiDataDebugBridge } from './components/common/aiDataHub'
import './styles/index.css'
import './styles/Tailwind.css'
import App from './App.tsx'

const PRIORITY_IMAGE_MARGIN_PX = 320
const MAX_EAGER_IMAGES = 16
const MAX_HIGH_PRIORITY_IMAGES = 6

const isNearViewport = (image: HTMLImageElement) => {
  const rect = image.getBoundingClientRect()
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight

  return (
    rect.right >= -PRIORITY_IMAGE_MARGIN_PX &&
    rect.bottom >= -PRIORITY_IMAGE_MARGIN_PX &&
    rect.left <= viewportWidth + PRIORITY_IMAGE_MARGIN_PX &&
    rect.top <= viewportHeight + PRIORITY_IMAGE_MARGIN_PX
  )
}

const applyBaseImageAttributes = (image: HTMLImageElement) => {
  if (!image.hasAttribute('loading')) {
    image.loading = 'lazy'
  }

  if (!image.hasAttribute('decoding')) {
    image.decoding = 'async'
  }

  if (!image.hasAttribute('fetchpriority')) {
    image.fetchPriority = 'low'
  }
}

const optimizeImageLoading = () => {
  if (typeof window === 'undefined') return

  let eagerAssigned = 0
  let highAssigned = 0
  const observedImages = new WeakSet<HTMLImageElement>()

  const promoteImagePriority = (image: HTMLImageElement) => {
    if (image.dataset.imagePriorityBound === 'true') return
    if (!image.isConnected) return

    const explicitEager = image.getAttribute('loading') === 'eager'
    const explicitHigh = image.getAttribute('fetchpriority') === 'high'

    if (explicitEager || explicitHigh) {
      image.dataset.imagePriorityBound = 'true'
      eagerAssigned += 1
      if (explicitHigh) {
        highAssigned += 1
      }
      return
    }

    if (eagerAssigned >= MAX_EAGER_IMAGES) return

    image.loading = 'eager'
    eagerAssigned += 1

    if (highAssigned < MAX_HIGH_PRIORITY_IMAGES) {
      image.fetchPriority = 'high'
      highAssigned += 1
    } else {
      image.fetchPriority = 'auto'
    }

    image.dataset.imagePriorityBound = 'true'
  }

  let observer: IntersectionObserver | null = null

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const image = entry.target as HTMLImageElement
          promoteImagePriority(image)
          currentObserver.unobserve(image)
        })
      },
      {
        root: null,
        rootMargin: `${PRIORITY_IMAGE_MARGIN_PX}px 0px ${PRIORITY_IMAGE_MARGIN_PX}px 0px`,
        threshold: 0.01,
      },
    )
  }

  const registerImage = (image: HTMLImageElement) => {
    if (observedImages.has(image)) return
    observedImages.add(image)

    applyBaseImageAttributes(image)

    if (observer) {
      observer.observe(image)
      return
    }

    if (isNearViewport(image)) {
      promoteImagePriority(image)
    }
  }

  document.querySelectorAll('img').forEach((image) => registerImage(image))

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return

        if (node instanceof HTMLImageElement) {
          registerImage(node)
          return
        }

        node.querySelectorAll('img').forEach((image) => registerImage(image))
      })
    })
  })

  mutationObserver.observe(document.documentElement, { childList: true, subtree: true })
  window.addEventListener(
    'pagehide',
    () => {
      mutationObserver.disconnect()
      observer?.disconnect()
    },
    { once: true },
  )
}

registerAiDataDebugBridge()
optimizeImageLoading()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
