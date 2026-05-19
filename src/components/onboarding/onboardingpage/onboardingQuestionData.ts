import appleIcon from '../../../assets/images/food_icon/apple.png'
import bananaIcon from '../../../assets/images/food_icon/banana.png'
import beanSproutsIcon from '../../../assets/images/food_icon/bean_sprouts.png'
import beefIcon from '../../../assets/images/food_icon/beef.png'
import bokChoyIcon from '../../../assets/images/food_icon/bok_choy.png'
import broccoliIcon from '../../../assets/images/food_icon/broccoli.png'
import cannedTunaIcon from '../../../assets/images/food_icon/canned_tuna.png'
import carrotIcon from '../../../assets/images/food_icon/carrot.png'
import chiliPepperIcon from '../../../assets/images/food_icon/chili_pepper.png'
import cornIcon from '../../../assets/images/food_icon/corn.png'
import daikonRadishIcon from '../../../assets/images/food_icon/daikon_radish.png'
import eggIcon from '../../../assets/images/food_icon/egg.png'
import eggplantIcon from '../../../assets/images/food_icon/eggplant.png'
import enokiMushroomIcon from '../../../assets/images/food_icon/enoki_mushroom.png'
import fishCakeIcon from '../../../assets/images/food_icon/fish_cake.png'
import garlicIcon from '../../../assets/images/food_icon/garlic.png'
import grapesIcon from '../../../assets/images/food_icon/grapes.png'
import greenOnionIcon from '../../../assets/images/food_icon/green_onion.png'
import kimchiIcon from '../../../assets/images/food_icon/kimchi.png'
import pumpkinIcon from '../../../assets/images/food_icon/pumpkin.png'
import kiwiIcon from '../../../assets/images/food_icon/kiwi.png'
import leafLettuceIcon from '../../../assets/images/food_icon/leaf_lettuce.png'
import lemonIcon from '../../../assets/images/food_icon/lemon.png'
import lettuceIcon from '../../../assets/images/food_icon/lettuce.png'
import mangoIcon from '../../../assets/images/food_icon/mango.png'
import mushroomIcon from '../../../assets/images/food_icon/mushroom.png'
import onionIcon from '../../../assets/images/food_icon/onion.png'
import peachIcon from '../../../assets/images/food_icon/peach.png'
import pepperIcon from '../../../assets/images/food_icon/pepper.png'
import porkBellyIcon from '../../../assets/images/food_icon/pork_belly.png'
import potatoIcon from '../../../assets/images/food_icon/potato.png'
import salmonIcon from '../../../assets/images/food_icon/salmon.png'
import sausageIcon from '../../../assets/images/food_icon/sausage.png'
import spamIcon from '../../../assets/images/food_icon/spam.png'
import strawberryIcon from '../../../assets/images/food_icon/strawberry.png'
import sweetPotatoIcon from '../../../assets/images/food_icon/sweet_potato.png'
import tofuIcon from '../../../assets/images/food_icon/tofu.png'
import tomatoIcon from '../../../assets/images/food_icon/tomato.png'
import zucchiniIcon from '../../../assets/images/food_icon/zucchini.png'
import customBlueImage from '../images/custom_blue.png'
import customBroImage from '../images/custom_bro.png'
import customCarrotImage from '../images/custom_carrot.png'
import type { AnswerValue, IngredientOption, OnboardingQuestion } from './onboardingQuestionTypes'

export const ingredientOptions: IngredientOption[] = [
  { label: '양파', icon: onionIcon },
  { label: '당근', icon: carrotIcon },
  { label: '버섯', icon: mushroomIcon },
  { label: '가지', icon: eggplantIcon },
  { label: '감자', icon: potatoIcon },
  { label: '마늘', icon: garlicIcon },
  { label: '통조림', icon: cannedTunaIcon },
  { label: '고추', icon: chiliPepperIcon },
  { label: '소고기', icon: beefIcon },
  { label: '생선', icon: salmonIcon },
  { label: '브로콜리', icon: broccoliIcon },
  { label: '상추', icon: leafLettuceIcon },
  { label: '시금치', icon: bokChoyIcon },
  { label: '숙주', icon: beanSproutsIcon },
  { label: '삼겹살', icon: porkBellyIcon },
  { label: '두부', icon: tofuIcon },
  { label: '어묵', icon: fishCakeIcon },
  { label: '피망', icon: pepperIcon },
  { label: '햄', icon: spamIcon },
  { label: '팽이버섯', icon: enokiMushroomIcon },
  { label: '옥수수', icon: cornIcon },
  { label: '소세지', icon: sausageIcon },
  { label: '사과', icon: appleIcon },
  { label: '양배추', icon: lettuceIcon },
  { label: '고구마', icon: sweetPotatoIcon },
  { label: '단호박', icon: pumpkinIcon },
  { label: '무', icon: daikonRadishIcon },
  { label: '애호박', icon: zucchiniIcon },
  { label: '파', icon: greenOnionIcon },
  { label: '김치', icon: kimchiIcon },
  { label: '계란', icon: eggIcon },
  { label: '토마토', icon: tomatoIcon },
  { label: '포도', icon: grapesIcon },
  { label: '바나나', icon: bananaIcon },
  { label: '애플망고', icon: mangoIcon },
  { label: '키위', icon: kiwiIcon },
  { label: '딸기', icon: strawberryIcon },
  { label: '복숭아', icon: peachIcon },
  { label: '레몬', icon: lemonIcon },
  { label: '기타' },
]

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: 'budget',
title: '이번 주 예산은 얼마로 할까요?',
    subtitle: '선택한 예산에 맞춰 부담없는 메뉴를 추천해드릴게요.',
    image: customCarrotImage,
    imageAlt: '동전을 들고 있는 당근 캐릭터',
    options: ['5,000원 이하', '5,000원 ~ 8,000원', '8,000원 이상', '예산 보다 건강 / 맛이 더 중요해요'],
  },
  {
    id: 'time',
    title: '도시락 준비에\n쓸 수 있는 시간은 얼마나 되나요?',
    subtitle: '그 시간 안에 완성할 수 있는 메뉴를 알려드릴게요.',
    image: customBlueImage,
    imageAlt: '숟가락과 모래시계를 들고 있는 블루베리 캐릭터',
    options: ['10분 내외', '20분 내외', '30분 이상', '밀프렙 / 상관없어요'],
  },
  {
    id: 'avoidFoods',
title: '못 먹거나 피해야 할 음식이 있나요?',
    subtitle: '안심하고 먹을 수 있는 도시락을 추천해드릴게요.',
    image: customBroImage,
    imageAlt: '알레르기 표시를 들고 있는 브로콜리 캐릭터',
    selectionType: 'multiple',
    optionLayout: 'grid',
    options: ['계란', '우유', '땅콩·견과류', '콩·대두', '밀·메밀', '해산물', '육류', '과일·채소', '깨', '기타'],
  },
  {
    id: 'ingredients',
title: '냉장고에 있는 재료를 알려주세요.',
    subtitle: '가지고 있는 재료로 낭비없는 도시락을 추천해드릴게요.',
    selectionType: 'multiple',
    optionLayout: 'ingredients',
    ingredients: ingredientOptions,
  },
]

export const initialOnboardingAnswers: Record<string, AnswerValue> = {
  budget: '',
  time: '',
  avoidFoods: [],
  ingredients: [],
}
