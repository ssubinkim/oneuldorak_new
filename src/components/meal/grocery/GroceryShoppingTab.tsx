import type { Dispatch, SetStateAction } from 'react'
import { CartIcon } from './GroceryIcons'
import type { ShoppingItem } from './groceryTypes'

type GroceryShoppingTabProps = {
  items: ShoppingItem[]
  setItems: Dispatch<SetStateAction<ShoppingItem[]>>
}

function GroceryShoppingTab({ items, setItems }: GroceryShoppingTabProps) {
  const toggle = (id: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  const checkedCount = items.filter((item) => item.checked).length
  const allChecked = items.length > 0 && checkedCount === items.length

  const toggleAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, checked: !allChecked })))
  }

  const deleteChecked = () => {
    setItems((prev) => prev.filter((item) => !item.checked))
  }

  return (
    <div className="gp-tab-content">
      <div className="gp-section-title"><CartIcon /><span>장보기 체크리스트</span></div>

      <div className="gp-list-header">
        <label className="gp-check-label">
          <input type="checkbox" className="gp-checkbox" checked={allChecked} onChange={toggleAll} />
          <span className="gp-check-box" data-checked={allChecked} />
          <span className="gp-check-text">전체선택 ({checkedCount}/{items.length})</span>
        </label>
        <button className="gp-delete-btn" onClick={deleteChecked}>상품삭제</button>
      </div>

      <div className="gp-item-list">
        {items.map((item) => (
          <label key={item.id} className="gp-item">
            <input
              type="checkbox"
              className="gp-checkbox"
              checked={item.checked}
              onChange={() => toggle(item.id)}
            />
            <span className="gp-check-box" data-checked={item.checked} />
            <img src={item.image} alt={item.name} className="gp-item-img" />
            <span className="gp-item-name">{item.name}</span>
          </label>
        ))}
      </div>

      <button className="gp-cart-btn">🛒 장바구니에 담기 ({checkedCount})</button>
    </div>
  )
}

export default GroceryShoppingTab
