import type { AiChatResponse } from '../types/ai.types'

type BuyAnalyzeResultCardProps = {
  response?: AiChatResponse
  decision?: string
  reason?: string
  action?: string
  className?: string
}

function BuyAnalyzeResultCard({
  response,
  decision,
  reason,
  action,
  className = '',
}: BuyAnalyzeResultCardProps) {
  return (
    <article className={`buy-analyze-result-card ${className}`.trim()}>
      <h3>Buy Analysis</h3>
      {decision ? <p>Decision: {decision}</p> : null}
      {reason ? <p>Reason: {reason}</p> : null}
      {action ? <p>Action: {action}</p> : null}
      {!decision && response?.text ? <p>{response.text}</p> : null}
    </article>
  )
}

export default BuyAnalyzeResultCard
