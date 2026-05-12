import ReviewList, { type Review } from '../ReviewList'
import ReviewEmpty from '../ReviewEmpty'
import RelatedRecipes from '../RelatedRecipes'
import RelatedProducts from '../RelatedProducts'
import { type Product } from '../ProductCard'

type Props = {
  reviews: Review[]
  onSelectProduct?: (product: Product) => void
}

function ReviewTab({ reviews, onSelectProduct }: Props) {
  return (
    <div>
      {reviews.length === 0
        ? <ReviewEmpty />
        : <ReviewList reviews={reviews} totalCount={999} averageRating={4.8} />
      }
      <RelatedRecipes />
      <RelatedProducts onSelect={onSelectProduct} />
      <div style={{ height: 24 }} />
    </div>
  )
}

export default ReviewTab
