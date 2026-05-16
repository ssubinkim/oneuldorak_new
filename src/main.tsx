import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerAiDataDebugBridge } from './components/common/aiDataHub'
import './styles/index.css'
import App from './App.tsx'

const applyDefaultImageLoading = (image: HTMLImageElement) => {
  if (!image.hasAttribute('loading')) {
    image.loading = 'lazy'
  }

  if (!image.hasAttribute('decoding')) {
    image.decoding = 'async'
  }
}

const optimizeImageLoading = () => {
  if (typeof window === 'undefined') return

  document.querySelectorAll('img').forEach((image) => applyDefaultImageLoading(image))

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return

        if (node instanceof HTMLImageElement) {
          applyDefaultImageLoading(node)
          return
        }

        node.querySelectorAll('img').forEach((image) => applyDefaultImageLoading(image))
      })
    })
  })

  observer.observe(document.documentElement, { childList: true, subtree: true })
}

registerAiDataDebugBridge()
optimizeImageLoading()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
