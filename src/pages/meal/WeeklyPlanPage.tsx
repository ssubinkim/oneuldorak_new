import WeeklyPlanScreen from '../../components/meal/weekly-plan/page/WeeklyPlanScreen'
import '../../styles/Tailwind.css'
import './WeeklyPlanPage.css'

type Props = { onBack?: () => void }

function WeeklyPlanPage({ onBack }: Props) {
  const handleBack = onBack ?? (() => { window.location.hash = '#/meal' })

  return <WeeklyPlanScreen onBack={handleBack} />
}

export default WeeklyPlanPage
