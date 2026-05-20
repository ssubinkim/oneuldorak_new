import AiChatPanel from './components/AiChatPanel'
import type { AiChatMessage } from './types/ai.types'

type AiPageProps = {
  messages?: AiChatMessage[]
}

function AiPage({ messages = [] }: AiPageProps) {
  return (
    <main className="ai-page">
      <AiChatPanel messages={messages} />
    </main>
  )
}

export default AiPage
