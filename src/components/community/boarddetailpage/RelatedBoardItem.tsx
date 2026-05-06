export type RelatedBoard = {
  id: string
  title: string
  comments: number
}

type RelatedBoardItemProps = {
  item: RelatedBoard
  onSelectBoard: (postId: string) => void
}

function RelatedBoardItem({ item, onSelectBoard }: RelatedBoardItemProps) {
  return (
    <button
      type="button"
      className="board-detail-related__item"
      onClick={() => onSelectBoard(item.id)}
    >
      <p>{item.title}</p>
      <span>댓글 {item.comments}</span>
    </button>
  )
}

export default RelatedBoardItem
