import { useState } from 'react'
import BoardWriteForm from '../../components/community/communitywritepage/BoardWriteForm'
import RecipeWriteForm from '../../components/community/communitywritepage/RecipeWriteForm'
import VoteWriteForm from '../../components/community/communitywritepage/VoteWriteForm'
import WriteTabs from '../../components/community/communitywritepage/WriteTabs'
import WriteTopIcon from '../../components/community/communitywritepage/WriteTopIcon'
import {
  emptyWriteFormValues,
  getWritePayload,
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
  onSubmit: (payload: CommunityWritePayload) => void
}

function CommunityWritePage({ initialTab = 'board', onBack, onSubmit }: CommunityWritePageProps) {
  const [activeTab, setActiveTab] = useState<WriteTab>(initialTab)
  const [formValues, setFormValues] = useState<CommunityWriteFormValues>(emptyWriteFormValues)

  const updateRecipeData = (recipe: RecipeWriteData) => {
    setFormValues((prevValues) => ({ ...prevValues, recipe }))
  }

  const updateBoardData = (board: BoardWriteData) => {
    setFormValues((prevValues) => ({ ...prevValues, board }))
  }

  const updateVoteData = (vote: VoteWriteData) => {
    setFormValues((prevValues) => ({ ...prevValues, vote }))
  }

  const handleSubmit = () => {
    onSubmit(getWritePayload(activeTab, formValues))
  }

  return (
    <main className="page-scroll community-write-page">
      <div className="community-write-hero">
        <button className="community-write-top-button" type="button" aria-label="뒤로가기" onClick={onBack}>
          <WriteTopIcon kind="back" />
        </button>
        <div className="community-write-top-actions">
          <button type="button" aria-label="좋아요">
            <WriteTopIcon kind="heart" />
          </button>
          <button type="button" aria-label="북마크">
            <WriteTopIcon kind="bookmark" />
          </button>
          <button type="button" aria-label="공유하기">
            <WriteTopIcon kind="share" />
          </button>
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

        <button className="community-write-submit" type="button" onClick={handleSubmit}>
          등록하기
        </button>
      </section>
    </main>
  )
}

export default CommunityWritePage
