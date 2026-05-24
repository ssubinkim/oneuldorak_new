import {
  carrotImg, potatoImg, appleImg, onionImg, brocollyImg,
  getIngredientIconClassName,
} from '../meal/mealData'
import { readChatbotFridgeIngredients, readOnboardingAnswers } from '../common/aiDataHub'
import { getUserProfile } from '../common/useUserProfile'
import { createFridgeItemFromLabel, normalizeFridgeItemLabel } from '../meal/storage/page/storageData'
import mushRoomImg from '../../assets/images/food_icon/mushroom.png'
import tomatoImg from '../../assets/images/food_icon/tomato.png'
import dorak21 from '../../assets/food_mascot_all/dorak21.png'
import blueStuffImg from './images/blue_stuff.png'
import lightImg from './images/light.png'
import AddCircleIcon from '../../assets/icons/add_circle.svg?react'
import './FridgeSection.css'

interface FridgeIngredient {
  id: number
  name: string
  image: string
  daysLeft: number | null
}

const FALLBACK_FRIDGE_ITEMS: FridgeIngredient[] = [
  { id: 1, name: '당근', image: carrotImg, daysLeft: 1 },
  { id: 2, name: '감자', image: potatoImg, daysLeft: 5 },
  { id: 3, name: '사과', image: appleImg, daysLeft: 3 },
  { id: 4, name: '양파', image: onionImg, daysLeft: 2 },
  { id: 5, name: '브로콜리', image: brocollyImg, daysLeft: 7 },
  { id: 6, name: '버섯', image: mushRoomImg, daysLeft: 1 },
  { id: 7, name: '방울토마토', image: tomatoImg, daysLeft: 4 },
]

const MAX_HOME_FRIDGE_ITEMS = 12

function getFridgeItemsFromOnboarding(): FridgeIngredient[] {
  const onboardingAnswers = readOnboardingAnswers()
  if (!onboardingAnswers || typeof onboardingAnswers !== 'object') {
    return FALLBACK_FRIDGE_ITEMS
  }

  const ingredientsAnswer = (onboardingAnswers as Record<string, unknown>).ingredients
  if (!Array.isArray(ingredientsAnswer)) {
    return FALLBACK_FRIDGE_ITEMS
  }

  const selectedLabels = ingredientsAnswer
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean)

  if (selectedLabels.length === 0) {
    return FALLBACK_FRIDGE_ITEMS
  }

  const uniqueLabels = Array.from(new Set(selectedLabels))
  const mappedItems = uniqueLabels.map((label, index) => {
    const mappedItem = createFridgeItemFromLabel(label, index + 1)
    return {
      id: index + 1,
      name: mappedItem.name,
      image: mappedItem.image,
      daysLeft: mappedItem.days,
    }
  }).slice(0, MAX_HOME_FRIDGE_ITEMS)

  return mappedItems.length > 0 ? mappedItems : FALLBACK_FRIDGE_ITEMS
}

function mergeFridgeItemsWithChatbotSaved(baseItems: FridgeIngredient[]) {
  const savedLabels = readChatbotFridgeIngredients()
  if (savedLabels.length === 0) {
    return baseItems.slice(0, MAX_HOME_FRIDGE_ITEMS).map((item, index) => ({ ...item, id: index + 1 }))
  }

  const uniqueSavedLabels = Array.from(
    new Map(
      savedLabels
        .map((label) => label.trim())
        .filter(Boolean)
        .map((label) => [normalizeFridgeItemLabel(label), label]),
    ).values(),
  )

  const savedItems = uniqueSavedLabels.map((label, index) => {
    const mappedItem = createFridgeItemFromLabel(label, index + 1)
    return {
      id: index + 1,
      name: mappedItem.name,
      image: mappedItem.image,
      daysLeft: mappedItem.days,
    }
  })

  const savedNameSet = new Set(savedItems.map((item) => normalizeFridgeItemLabel(item.name)))
  const remainingBaseItems = baseItems.filter((item) => !savedNameSet.has(normalizeFridgeItemLabel(item.name)))
  const mergedItems = [...savedItems, ...remainingBaseItems].slice(0, MAX_HOME_FRIDGE_ITEMS)

  return mergedItems.map((item, index) => ({
    ...item,
    id: index + 1,
  }))
}

function FridgeSection() {
  const { isNew } = getUserProfile()
  const baseFridgeItems = isNew === false
    ? FALLBACK_FRIDGE_ITEMS
    : getFridgeItemsFromOnboarding()
  const fridgeItems = mergeFridgeItemsWithChatbotSaved(baseFridgeItems)
  const urgentCount = fridgeItems.filter((item) => item.daysLeft !== null && item.daysLeft <= 2).length

  return (
    <section className="fridge-sec">
      <div className="fridge-card">
        <div className="fridge-sec__header">
          <h2 className="fridge-sec__title">오늘의 냉장고</h2>
          <span className="fridge-sec__count">총 <span className="fridge-sec__count-num">{fridgeItems.length}개</span> 재료</span>
        </div>

        <div className="fridge-sec__body">
          <div className="fridge-item fridge-item--add">
            <button
              className="fridge-add-btn"
              aria-label="재료 추가"
              onClick={() => { window.location.hash = '#/meal-grocery' }}
            >
              <img src={blueStuffImg} alt="" className="fridge-add-btn__img" />
              <AddCircleIcon className="fridge-add-btn__plus" aria-hidden="true" />
            </button>
            <span className="fridge-item__name">재료추가</span>
          </div>

          <div className="fridge-sec__scroll">
            {fridgeItems.map(item => (
              <div key={item.id} className="fridge-item">
                <div className="fridge-circle">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`fridge-circle__img ${getIngredientIconClassName(item.image)}`}
                  />
                </div>
                <span className="fridge-item__name">{item.name}</span>
                {item.daysLeft !== null && (
                  <span className={`fridge-badge${item.daysLeft <= 2 ? ' fridge-badge--urgent' : ''}`} aria-label={`D-${item.daysLeft}`}>D-{item.daysLeft}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {urgentCount > 0 && (
          <button
            className="fridge-warning"
            onClick={() => { window.location.hash = '#/meal-storage?from=home' }}
            aria-label="소비기한 임박 재료 확인하기"
          >
            <img src={lightImg} alt="" className="fridge-warning__icon" aria-hidden="true" />
            <span className="fridge-warning__text">D-1 재료가 있어요, 오늘 먼저 써볼까요 ?</span>
            <svg className="fridge-warning__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 18L15 12L9 6" stroke="#92BA6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <div
        className="market-banner"
        role="button"
        tabIndex={0}
        onClick={() => { window.location.hash = '#/store' }}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.location.hash = '#/store' }}
        aria-label="도락마켓으로 이동"
      >
        <div className="market-banner__text">
          <p className="market-banner__desc">부족한 재료는</p>
          <strong className="market-banner__name">도락마켓<span className="market-banner__desc">에서 채워요</span></strong>
<span className="market-banner__link">재료 보러가기 &gt;</span>
        </div>
        <div className="market-banner__mascots" aria-hidden="true">
          <img src={dorak21} alt="" className="market-banner__mascot" />
        </div>
      </div>
    </section>
  )
}

export default FridgeSection
