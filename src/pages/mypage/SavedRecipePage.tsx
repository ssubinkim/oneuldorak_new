import type { ComponentProps } from 'react'
import SavedRecipePageView from '../../components/mypage/saved-recipe-page/SavedRecipePageView'

type Props = ComponentProps<typeof SavedRecipePageView>

export default function SavedRecipePage(props: Props) {
  return <SavedRecipePageView {...props} />
}
