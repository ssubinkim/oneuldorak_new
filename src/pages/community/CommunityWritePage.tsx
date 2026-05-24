import { useState } from 'react'
import BoardWriteForm from '../../components/community/communitywritepage/BoardWriteForm'
import VoteWriteForm from '../../components/community/communitywritepage/VoteWriteForm'
import WriteTabs from '../../components/community/communitywritepage/WriteTabs'
import WriteTopIcon from '../../components/community/communitywritepage/WriteTopIcon'
import {
  emptyWriteFormValues,
  getWritePayload,
  getUniqueVoteOptions,
  hasDuplicateVoteOptions,
  hasTooManyVoteOptions,
  type BoardWriteData,
  type CommunityWriteFormValues,
  type CommunityWritePayload,
  type VoteWriteData,
} from '../../components/community/communitywritepage/writeTypes'
import type { WriteTab } from '../../components/community/communitywritepage/writeTab'
import './CommunityWritePage.css'
import '../../components/community/common/VoteConfirmModal.css'

type CommunityWritePageProps = {
  initialTab?: WriteTab
  initialValues?: Partial<CommunityWriteFormValues>
  hideTabSwitch?: boolean
  submitLabel?: string
  onBack: () => void
  onSubmit: (payload: CommunityWritePayload) => void | Promise<void>
}

const writeHeroDescriptions: Record<WriteTab, string> = {
  board: '냉털 일상을 나눠보세요 !',
  vote: '고민을 도락이들에게 물어보세요 !',
}

function CommunityWritePage({ initialTab = 'board', initialValues, hideTabSwitch = false, submitLabel = '등록하기', onBack, onSubmit }: CommunityWritePageProps) {
  const [activeTab, setActiveTab] = useState<WriteTab>(initialTab)
  const [formValues, setFormValues] = useState<CommunityWriteFormValues>({ ...emptyWriteFormValues, ...initialValues })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showVoteConfirm, setShowVoteConfirm] = useState(false)
  const [pendingVotePayload, setPendingVotePayload] = useState<CommunityWritePayload | null>(null)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  const updateBoardData = (board: BoardWriteData) => {
    setFormValues((prevValues) => ({ ...prevValues, board }))
  }

  const updateVoteData = (vote: VoteWriteData) => {
    setFormValues((prevValues) => ({ ...prevValues, vote }))
  }

  const submitPayload = async (payload: CommunityWritePayload) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await onSubmit(payload)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = () => {
    const payload = getWritePayload(activeTab, formValues)

    if (payload.tab === 'vote') {
      if (hasDuplicateVoteOptions(payload.data.options)) {
        setAlertMessage('같은 보기는 추가할 수 없어요.')
        return
      }

      if (hasTooManyVoteOptions(payload.data.options)) {
        setAlertMessage('투표 보기는 최대 5개까지 추가할 수 있어요.')
        return
      }

      const uniqueOptions = getUniqueVoteOptions(payload.data.options)

      if (uniqueOptions.length < 2) {
        setAlertMessage('투표 보기는 2개 이상 필요해요.')
        return
      }

      setPendingVotePayload({ ...payload, data: { ...payload.data, options: uniqueOptions } })
      setShowVoteConfirm(true)
      return
    }

    void submitPayload(payload)
  }

  const handleVoteConfirm = () => {
    if (!pendingVotePayload) return
    setShowVoteConfirm(false)
    void submitPayload(pendingVotePayload)
    setPendingVotePayload(null)
  }

  const handleVoteConfirmCancel = () => {
    setShowVoteConfirm(false)
    setPendingVotePayload(null)
  }

  return (
    <main className="page-scroll community-write-page">
      <div className="community-write-hero">
        <div className="community-write-hero-main">
          <button className="community-write-top-button" type="button" aria-label="뒤로가기" onClick={onBack}>
            <WriteTopIcon kind="back" />
          </button>
          <div className="community-write-hero-copy">
            <p>{writeHeroDescriptions[activeTab]}</p>
          </div>
        </div>
      </div>

      <section className="community-write-card">
        {!hideTabSwitch && <WriteTabs activeTab={activeTab} onChange={setActiveTab} />}

        <div className="community-write-form">
          {activeTab === 'board' && (
            <BoardWriteForm value={formValues.board} onChange={updateBoardData} />
          )}
          {activeTab === 'vote' && (
            <VoteWriteForm value={formValues.vote} onChange={updateVoteData} />
          )}
        </div>

        <button className="community-write-submit" type="button" disabled={isSubmitting} onClick={handleSubmit}>
          {submitLabel}
        </button>
      </section>

      {alertMessage && (
        <div
          className="vote-confirm-modal"
          role="presentation"
          onClick={() => setAlertMessage(null)}
        >
          <section
            className="vote-confirm-modal__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <p>{alertMessage}</p>
            <div className="vote-confirm-modal__actions">
              <button type="button" className="vote-confirm-modal__confirm" onClick={() => setAlertMessage(null)}>확인</button>
            </div>
          </section>
        </div>
      )}

      {showVoteConfirm && (
        <div
          className="vote-confirm-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vote-confirm-title"
          onClick={handleVoteConfirmCancel}
        >
          <section
            className="vote-confirm-modal__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="vote-confirm-title">투표 등록 전 확인해주세요</h2>
            <p>등록된 투표는 수정과 삭제가 어렵습니다.<br />그래도 등록하시겠어요?</p>
            <div className="vote-confirm-modal__actions">
              <button
                type="button"
                className="vote-confirm-modal__cancel"
                onClick={handleVoteConfirmCancel}
              >
                취소
              </button>
              <button type="button" className="vote-confirm-modal__confirm" onClick={handleVoteConfirm}>
                등록하기
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default CommunityWritePage
