import { useState } from 'react'
import BoardWriteForm from '../../components/community/communitywritepage/BoardWriteForm'
import RecipeWriteForm from '../../components/community/communitywritepage/RecipeWriteForm'
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
  type RecipeWriteData,
  type VoteWriteData,
} from '../../components/community/communitywritepage/writeTypes'
import type { WriteTab } from '../../components/community/communitywritepage/writeTab'
import './CommunityWritePage.css'

type CommunityWritePageProps = {
  initialTab?: WriteTab
  onBack: () => void
  onSubmit: (payload: CommunityWritePayload) => void | Promise<void>
}

const writeHeroDescriptions: Record<WriteTab, string> = {
  recipe: '나만의 도시락 레시피를 공유해보세요 !',
  board: '냉털 일상을 남겨보세요 !',
  vote: '궁금한 선택지를 투표로 물어보세요 !',
}

function CommunityWritePage({ initialTab = 'board', onBack, onSubmit }: CommunityWritePageProps) {
  const [activeTab, setActiveTab] = useState<WriteTab>(initialTab)
  const [formValues, setFormValues] = useState<CommunityWriteFormValues>(emptyWriteFormValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateRecipeData = (recipe: RecipeWriteData) => {
    setFormValues((prevValues) => ({ ...prevValues, recipe }))
  }

  const updateBoardData = (board: BoardWriteData) => {
    setFormValues((prevValues) => ({ ...prevValues, board }))
  }

  const updateVoteData = (vote: VoteWriteData) => {
    setFormValues((prevValues) => ({ ...prevValues, vote }))
  }

  const submitPayload = async (payload: CommunityWritePayload) => {
    if (isSubmitting) {
      return
    }

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
        window.alert('같은 보기는 추가할 수 없어요.')
        return
      }

      if (hasTooManyVoteOptions(payload.data.options)) {
        window.alert('투표 보기는 최대 5개까지 추가할 수 있어요.')
        return
      }

      const uniqueOptions = getUniqueVoteOptions(payload.data.options)

      if (uniqueOptions.length < 2) {
        window.alert('투표 보기는 2개 이상 필요해요.')
        return
      }

      void submitPayload({
        ...payload,
        data: {
          ...payload.data,
          options: uniqueOptions,
        },
      })
      return
    }

    void submitPayload(payload)
  }

  return (
    <main className="page-scroll community-write-page">
      <div className="community-write-hero">
        <div className="community-write-hero-main">
          <button className="community-write-top-button" type="button" aria-label="뒤로가기" onClick={onBack}>
            <WriteTopIcon kind="back" />
          </button>
          <div className="community-write-hero-copy">
            <h1>글 작성</h1>
            <p>{writeHeroDescriptions[activeTab]}</p>
          </div>
        </div>
      </div>

      <section className="community-write-card">
        <WriteTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="community-write-form">
          {activeTab === 'recipe' && (
            <RecipeWriteForm value={formValues.recipe} onChange={updateRecipeData} />
          )}
          {activeTab === 'board' && (
            <BoardWriteForm value={formValues.board} onChange={updateBoardData} />
          )}
          {activeTab === 'vote' && (
            <VoteWriteForm value={formValues.vote} onChange={updateVoteData} />
          )}
        </div>

        <button className="community-write-submit" type="button" disabled={isSubmitting} onClick={handleSubmit}>
          등록하기
        </button>
      </section>
    </main>
  )
}

export default CommunityWritePage
