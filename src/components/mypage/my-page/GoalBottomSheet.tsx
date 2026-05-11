import BottomSheet from '../common/BottomSheet'
import './GoalBottomSheet.css'

type Props = {
  open: boolean
  onClose: () => void
}

export default function GoalBottomSheet({ open, onClose }: Props) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="goal-sheet">
        <p className="goal-sheet-sub">기간과 목표 금액을 설정 해주세요</p>
        <h2 className="goal-sheet-title">절약 목표 수정</h2>

        <div className="goal-sheet-field">
          <label className="goal-sheet-label">목표 금액</label>
          <input className="goal-sheet-input" defaultValue="100,000원" />
        </div>
        <div className="goal-sheet-field">
          <label className="goal-sheet-label">현재 쓴 금액</label>
          <input className="goal-sheet-input" defaultValue="72,000원" />
        </div>

        <div className="goal-sheet-actions">
          <button className="goal-sheet-btn primary">저장하기</button>
          <button className="goal-sheet-btn secondary" onClick={onClose}>취소</button>
        </div>
      </div>
    </BottomSheet>
  )
}
