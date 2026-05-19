import { useCallback, useEffect, useState } from 'react'
import BottomSheet from '../common/BottomSheet'
import './GoalBottomSheet.css'

type Goal = { current: number; target: number }

type Props = {
  open: boolean
  onClose: () => void
  goal: Goal
  onSave: (newGoal: Goal) => void
}

function formatAmount(raw: string) {
  const num = parseInt(raw, 10)
  if (isNaN(num)) return ''
  return num.toLocaleString() + '원'
}

function useAmountInput() {
  const [raw, setRaw] = useState('')
  const [focused, setFocused] = useState(false)

  const value = focused ? raw : (raw ? formatAmount(raw) : '')
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRaw(e.target.value.replace(/[^0-9]/g, ''))
  const onFocus = () => setFocused(true)
  const onBlur = () => setFocused(false)
  const reset = useCallback(() => setRaw(''), [])
  const parsed = parseInt(raw, 10) || 0

  return { value, onChange, onFocus, onBlur, reset, parsed }
}

export default function GoalBottomSheet({ open, onClose, onSave }: Props) {
  const target = useAmountInput()
  const current = useAmountInput()
  const resetTarget = target.reset
  const resetCurrent = current.reset

  useEffect(() => {
    if (open) {
      resetTarget()
      resetCurrent()
    }
  }, [open, resetCurrent, resetTarget])

  const handleSave = () => {
    onSave({ target: target.parsed, current: current.parsed })
  }

  return (
    <BottomSheet open={open} onClose={onClose} className="goal-bs">
      <div className="goal-sheet">
        <h2 className="goal-sheet-title">절약 목표 수정</h2>
        <p className="goal-sheet-sub">기간과 목표 금액을 설정 해주세요</p>

        <div className="goal-sheet-field">
          <label className="goal-sheet-label">목표 금액</label>
          <input
            className="goal-sheet-input"
            inputMode="numeric"
            placeholder="목표 금액을 입력하세요"
            value={target.value}
            onChange={target.onChange}
            onFocus={target.onFocus}
            onBlur={target.onBlur}
          />
        </div>

        <div className="goal-sheet-field">
          <label className="goal-sheet-label">현재 사용 금액</label>
          <input
            className="goal-sheet-input"
            inputMode="numeric"
            placeholder="현재 사용 금액을 입력하세요"
            value={current.value}
            onChange={current.onChange}
            onFocus={current.onFocus}
            onBlur={current.onBlur}
          />
        </div>

        <div className="goal-sheet-actions">
          <button className="goal-sheet-btn primary" onClick={handleSave}>저장하기</button>
          <button className="goal-sheet-btn secondary" onClick={onClose}>취소</button>
        </div>
      </div>
    </BottomSheet>
  )
}
