import { useState } from 'react'
import AttendanceCircles from './AttendanceCircles'
import type { DayData } from './AttendanceCircles'
import BottomSheet from '../common/BottomSheet'
import pointIconImg from '../images/point-icon.svg'
import './PointBottomSheet.css'

const GUIDE_ATTENDANCE: DayData[] = [
  { filled: true, label: '1P' },
  { filled: false },
  { filled: false },
  { filled: false, label: '3P' },
  { filled: false },
  { filled: false },
  { filled: false, label: '10P' },
]

const ACTIVITY_POINTS = [
  { label: '게시글 작성', point: '+3P' },
  { label: '댓글 작성', point: '+1P' },
  { label: '쇼핑 후 리뷰 작성', point: '+10P' },
  { label: '인기글 등록', point: '+5P' },
  { label: '출석 완료 보상', point: '+10P' },
  { label: '카카오톡 공유', point: '+10P' },
]

const HISTORY = [
  { label: '게시글 작성', point: '+3P' },
  { label: '댓글 작성', point: '+3P' },
  { label: '선착순 투표 작성', point: '+3P' },
  { label: '댓글 작성', point: '+3P' },
]

type Tab = 'guide' | 'history'

type Props = {
  open: boolean
  onClose: () => void
  totalPoints?: number
  monthlyPoints?: number
}

export default function PointBottomSheet({ open, onClose, totalPoints = 245, monthlyPoints = 133 }: Props) {
  const [tab, setTab] = useState<Tab>('guide')
  const currentMonth = new Date().getMonth() + 1

  return (
    <BottomSheet open={open} onClose={onClose} className="point-bs">
      <div className="point-sheet">
        <h2 className="point-sheet-title">
          {tab === 'guide' ? '포인트 적립 가이드' : '포인트 적립 내역'}
        </h2>
        <p className="point-sheet-sub">
          {tab === 'guide' ? '출석활동으로 포인트를 모아요.' : '포인트 내역을 정리해서 보여드려요.'}
        </p>

        <div className="point-sheet-tabs">
          {(['guide', 'history'] as Tab[]).map((t) => (
            <button
              key={t}
              className={`point-sheet-tab${tab === t ? ' active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'guide' ? '포인트 가이드' : '적립내역'}
            </button>
          ))}
        </div>

        <div className="point-tab-container">
          <div className={`point-guide${tab === 'guide' ? '' : ' hidden'}`}>
            <div className="point-guide-card">
              <AttendanceCircles data={GUIDE_ATTENDANCE} />
              <p className="point-guide-note">
                4일 차 중간 보상 +3p&nbsp;&nbsp;&nbsp;7일 차 중간 보상 +10p
              </p>
            </div>

            <div className="point-activity-title">활동별 적립</div>
            {ACTIVITY_POINTS.map((item) => (
              <div key={item.label} className="point-activity-row">
                <span>{item.label}</span>
                <span className="point-activity-val">{item.point}</span>
              </div>
            ))}
          </div>

          <div className={`point-history${tab === 'history' ? '' : ' hidden'}`}>
            <div className="point-history-card">
              <div className="point-history-card-top">
                <img src={pointIconImg} alt="" className="point-history-coin" aria-hidden="true" />
                <div>
                  <div className="point-history-card-label">나의 포인트</div>
                  <div className="point-history-total">{totalPoints} <span>p</span></div>
                </div>
              </div>
              <div className="point-history-monthly">
                <span>{currentMonth}월에 받은 포인트</span>
                <span className="point-history-monthly-val">{monthlyPoints}P</span>
              </div>
            </div>

            <div className="point-history-section-title">적립내역</div>
            {HISTORY.map((item, i) => (
              <div key={i} className="point-history-row">
                <span className="point-history-row-label">{item.label}</span>
                <span className="point-history-row-val">{item.point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BottomSheet>
  )
}
