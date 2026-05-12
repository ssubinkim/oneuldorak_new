export type GroceryTab = 'shopping' | 'storage' | 'recommend'

export interface ShoppingItem {
  id: number
  name: string
  image: string
  checked: boolean
}

export interface StorageRecipe {
  id: number
  image: string
  channel: string
  name: string
  likes: number
}

export interface RecommendItem {
  id: number
  name: string
  image: string
  recipes: string
}
