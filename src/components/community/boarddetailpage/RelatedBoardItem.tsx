export type RelatedBoard = {
  title: string
  comments: number
}

function RelatedBoardItem({ item }: { item: RelatedBoard }) {
  return (
    <article>
      <p>{item.title}</p>
      <span>댓글 {item.comments}</span>
    </article>
  )
}

export default RelatedBoardItem
