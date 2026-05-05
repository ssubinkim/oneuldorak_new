import { useState } from 'react'
import BottomNav from '../../components/common/BottomNav'
import Header from '../../components/common/Header'
import '../../styles/Tailwind.css'

const ATTENDANCE = [
  { filled: true }, { filled: true }, { filled: false },
  { filled: false, label: '3P' },
  { filled: false }, { filled: false },
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
  { label: '게시글 작성', date: '오늘 14:32', point: '+3P' },
  { label: '댓글 작성', date: '오늘 15:32', point: '+3P' },
  { label: '선착순 투표 작성', date: '어제 10:32', point: '+3P' },
  { label: '댓글 작성', date: '어제 09:32', point: '+3P' },
]

const MENU_SECTIONS = [
  {
    title: '스토어',
    items: [['구매 내역', '정기 배송']],
  },
  {
    title: '멤버십',
    items: [['멤버십 혜택', '구독 현황']],
  },
  {
    title: '설정 / 관리',
    items: [
      ['계정 설정', '알림 설정'],
      ['구독·결제', '앱 환경 설정'],
      ['약관·정책', '고객지원 센터'],
    ],
  },
]

function AttendanceCircles() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
      {ATTENDANCE.map((d, i) => (
        <div key={i} style={{
          width: 34, height: 34, borderRadius: '50%',
          background: d.filled ? '#555' : '#e0e0e0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: d.filled ? '#fff' : '#888',
          flexShrink: 0,
        }}>
          {d.label ?? ''}
        </div>
      ))}
    </div>
  )
}

type BottomSheetProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.4)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
      />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 50,
        background: '#fff',
        borderRadius: '20px 20px 0 0',
        maxHeight: '80%',
        overflowY: 'auto',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#e0e0e0' }} />
        </div>
        {children}
      </div>
    </>
  )
}

function MyPage() {
  const [goalSheetOpen, setGoalSheetOpen] = useState(false)
  const [pointSheetOpen, setPointSheetOpen] = useState(false)
  const [pointTab, setPointTab] = useState<'guide' | 'history'>('guide')

  return (
    <div className="app-shell">
      <div className="app-screen">
        <Header />

        {/* 스크롤 콘텐츠 */}
        <div className="page-scroll">

          {/* 유저 정보 */}
          <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>세아</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: '#555',
                  border: '1px solid #ccc', borderRadius: 20,
                  padding: '2px 10px',
                }}>일반 회원</span>
              </div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>hyseah@gmail.com</div>
              <div style={{ fontSize: 12, color: '#aaa' }}>LV.재료좀줌</div>
            </div>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              border: '1.5px solid #ccc',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#aaa" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="7.5" r="3.5" />
                <path d="M5.5 20c.9-4 3.2-6 6.5-6s5.6 2 6.5 6" />
              </svg>
            </div>
          </div>

          {/* 통계 */}
          <div style={{ display: 'flex', margin: '20px 24px 0', border: '1px solid #eee', borderRadius: 12 }}>
            {[['9', '좋아요'], ['6', '내 게시글'], ['8', '내 댓글']].map(([num, label], i, arr) => (
              <div key={label} style={{
                flex: 1, textAlign: 'center', padding: '16px 0',
                borderRight: i < arr.length - 1 ? '1px solid #eee' : 'none',
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#111' }}>{num}</div>
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* 내 절약 목표 */}
          <div style={{ margin: '16px 24px 0', border: '1px solid #eee', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>내 절약 목표</span>
              <button
                onClick={() => setGoalSheetOpen(true)}
                style={{ fontSize: 12, color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                수정
              </button>
            </div>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 10 }}>이번 달 절약 목표</div>
            <div style={{ fontSize: 13, color: '#333', marginBottom: 8 }}>
              <span style={{ fontWeight: 700 }}>현재 지출 72,000원</span>
              <span style={{ color: '#aaa' }}> /목표 100,000원</span>
            </div>
            <div style={{ height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ width: '50%', height: '100%', background: '#555', borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aaa' }}>
              <span>목표금액의 50% 소비 하셨어요!</span>
              <span>50%</span>
            </div>
          </div>

          {/* 포인트 */}
          <div style={{ margin: '16px 24px 0', border: '1px solid #eee', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 12, color: '#aaa', marginBottom: 4 }}>포인트</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#111' }}>245P</span>
              <span style={{
                fontSize: 12, fontWeight: 700,
                background: '#555', color: '#fff',
                borderRadius: 20, padding: '4px 12px', cursor: 'pointer',
              }}>뱃지</span>
            </div>
            <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>출석도장 3/7</div>
            <AttendanceCircles />
            <button
              onClick={() => { setPointTab('guide'); setPointSheetOpen(true) }}
              style={{
                marginTop: 16, width: '100%', padding: '12px 0',
                border: '1px solid #ddd', borderRadius: 8,
                background: '#fff', fontSize: 13, fontWeight: 600, color: '#333',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}
            >
              포인트 내역
              <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 3.5 4 4.5-4 4.5" />
              </svg>
            </button>
          </div>

          {/* 저정한 글 */}
          <div style={{ margin: '16px 24px 0' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 10 }}>저정한 글</div>
            <button style={{
              width: '100%', padding: '14px 0',
              border: '1px solid #ddd', borderRadius: 8,
              background: '#fff', fontSize: 13, fontWeight: 600, color: '#333',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
              레시피 바로 보기
              <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 3.5 4 4.5-4 4.5" />
              </svg>
            </button>
          </div>

          {/* 메뉴 섹션 */}
          <div style={{ margin: '24px 0 24px' }}>
            {MENU_SECTIONS.map((section) => (
              <div key={section.title} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: '#aaa', padding: '8px 24px 4px', fontWeight: 600 }}>
                  {section.title}
                </div>
                {section.items.map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', padding: '13px 24px',
                    borderTop: '1px solid #f2f2f2',
                  }}>
                    {row.map((item) => (
                      <div key={item} style={{ flex: 1, fontSize: 14, color: '#222', cursor: 'pointer' }}>
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 바텀시트①: 절약 목표 수정 */}
        <BottomSheet open={goalSheetOpen} onClose={() => setGoalSheetOpen(false)}>
          <div style={{ padding: '8px 24px 32px' }}>
            <div style={{ fontSize: 12, color: '#aaa', marginBottom: 6 }}>기간과 목표 금액을 설정 해주세요</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 24 }}>절약 목표 수정</div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>목표 금액</div>
              <input
                defaultValue="100,000원"
                style={{
                  width: '100%', padding: '14px 16px', boxSizing: 'border-box',
                  background: '#f2f2f2', border: 'none', borderRadius: 8,
                  fontSize: 14, color: '#333', outline: 'none',
                }}
              />
            </div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>현재 쓴 금액</div>
              <input
                defaultValue="72,000원"
                style={{
                  width: '100%', padding: '14px 16px', boxSizing: 'border-box',
                  background: '#f2f2f2', border: 'none', borderRadius: 8,
                  fontSize: 14, color: '#333', outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{
                flex: 1, padding: '14px 0', borderRadius: 8, border: 'none',
                background: '#444', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}>
                저장하기
              </button>
              <button
                onClick={() => setGoalSheetOpen(false)}
                style={{
                  flex: 1, padding: '14px 0', borderRadius: 8, border: 'none',
                  background: '#888', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                }}
              >
                취소
              </button>
            </div>
          </div>
        </BottomSheet>

        {/* 바텀시트②: 포인트 */}
        <BottomSheet open={pointSheetOpen} onClose={() => setPointSheetOpen(false)}>

          <div style={{ padding: '8px 24px 32px' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 4 }}>
              {pointTab === 'guide' ? '포인트 적립 가이드' : '포인트 적립 내역'}
            </div>
            <div style={{ fontSize: 12, color: '#aaa', marginBottom: 20 }}>
              {pointTab === 'guide' ? '출석 활동으로 포인트를 모아요.' : '포인트 내역을 정리해서 보여드려요.'}
            </div>

            {/* 탭 */}
            <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: 20 }}>
              {(['guide', 'history'] as const).map((tab) => (
                <div
                  key={tab}
                  onClick={() => setPointTab(tab)}
                  style={{
                    flex: 1, textAlign: 'center', paddingBottom: 10, fontSize: 14, cursor: 'pointer',
                    fontWeight: pointTab === tab ? 700 : 400,
                    color: pointTab === tab ? '#111' : '#aaa',
                    borderBottom: pointTab === tab ? '2px solid #111' : '2px solid transparent',
                    marginBottom: -1,
                  }}
                >
                  {tab === 'guide' ? '포인트 가이드' : '적립 내역'}
                </div>
              ))}
            </div>

            <div style={{ position: 'relative' }}>
              {/* 가이드 탭 - normal flow로 컨테이너 높이 결정 */}
              <div style={{ visibility: pointTab === 'guide' ? 'visible' : 'hidden' }}>
                {/* 출석도장 카드 */}
                <div style={{ background: '#f5f5f5', borderRadius: 12, padding: '16px 18px', marginBottom: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 4 }}>출석도장 7일</div>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 12 }}>
                    4일 차 중간 보상 +3p<br />7일 차 중간 보상 +10p
                  </div>
                  <AttendanceCircles />
                </div>

                {/* 활동별 적립 */}
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 12 }}>활동별 적립</div>
                {ACTIVITY_POINTS.map((item) => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '13px 0', borderBottom: '1px solid #f2f2f2',
                    fontSize: 14, color: '#222',
                  }}>
                    <span>{item.label}</span>
                    <span style={{ fontWeight: 700 }}>{item.point}</span>
                  </div>
                ))}
              </div>

              {/* 적립 내역 탭 - absolute로 가이드 위에 겹쳐서 높이 공유 */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                visibility: pointTab === 'history' ? 'visible' : 'hidden',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 18px', background: '#e8e8e8', borderRadius: 12, marginBottom: 16,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#555' }}>포인트</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#333' }}>245P</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 12 }}>적립내역</div>
                {HISTORY.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '13px 0', borderBottom: '1px solid #f2f2f2',
                  }}>
                    <div>
                      <div style={{ fontSize: 14, color: '#222', marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: '#aaa' }}>{item.date}</div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#333' }}>{item.point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </BottomSheet>

        <BottomNav />
      </div>
    </div>
  )
}

export default MyPage
