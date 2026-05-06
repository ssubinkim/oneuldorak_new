import RelatedBoardItem, { type RelatedBoard } from './RelatedBoardItem'

type RelatedBoardsProps = {
  items: RelatedBoard[]
  onSelectBoard: (postId: string) => void
}

function RelatedBoards({ items, onSelectBoard }: RelatedBoardsProps) {
  return (
    <section className="board-detail-related">
      <h2>관련 글</h2>
      <div className="board-detail-related__list">
        {items.map((item) => (
          <RelatedBoardItem
            key={item.title}
            item={item}
            onSelectBoard={onSelectBoard}
          />
        ))}
      </div>
    </section>
  )
}

export default RelatedBoards
