import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerAiDataDebugBridge } from './components/common/aiDataHub'
import './styles/index.css'
import './styles/Tailwind.css'
import App from './App.tsx'

registerAiDataDebugBridge()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
