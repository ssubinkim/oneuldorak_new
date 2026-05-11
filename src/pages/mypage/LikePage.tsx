import type { ComponentProps } from 'react'
import LikePageView from '../../components/mypage/like-page/LikePageView'

type Props = ComponentProps<typeof LikePageView>

export default function LikePage(props: Props) {
  return <LikePageView {...props} />
}
