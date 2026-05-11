import { useState } from 'react'
import StorageAll from '../../components/meal/storage/StorageAll'
import StorageMain from '../../components/meal/storage/StorageMain'
import './MealPage.css'

function MealPage() {
  const [showAll, setShowAll] = useState(false)

  return showAll
    ? <StorageAll onBack={() => setShowAll(false)} />
    : <StorageMain onShowAll={() => setShowAll(true)} />
}

export default MealPage
