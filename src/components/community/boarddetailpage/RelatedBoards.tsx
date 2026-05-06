import RelatedBoardItem, { type RelatedBoard } from './RelatedBoardItem'

function RelatedBoards({ items }: { items: RelatedBoard[] }) {
  return (
    <section className="board-detail-related">
      <h2>관련 글</h2>
      <div className="board-detail-related__list">
        {items.map((item) => (
          <RelatedBoardItem
            key={item.title}
            item={item}
          />
        ))}
      </div>
    </section>
  )
}

export default RelatedBoards
