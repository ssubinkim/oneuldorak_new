import { useMemo } from 'react'
import { ArcElement, Chart as ChartJS, Tooltip, type ChartData, type ChartOptions } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import './DoughnutChart.css'

ChartJS.register(ArcElement, Tooltip)

type DoughnutChartProps = {
  value: number
  label?: string
  className?: string
  valueColor?: string
  trackColor?: string
  cutout?: number | string
}

const doughnutOptions: ChartOptions<'doughnut'> = {
  animation: {
    duration: 1100,
    easing: 'easeOutQuart',
  },
  events: [],
  plugins: {
    tooltip: {
      enabled: false,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
}

function clampPercent(value: number) {
  if (value < 0) return 0
  if (value > 100) return 100
  return Math.round(value)
}

function DoughnutChart({
  value,
  label,
  className = '',
  valueColor = '#F34840',
  trackColor = '#DEDEDE',
  cutout = '62%',
}: DoughnutChartProps) {
  const percent = clampPercent(value)

  const data = useMemo<ChartData<'doughnut', number[]>>(
    () => ({
      datasets: [
        {
          data: [percent, 100 - percent],
          backgroundColor: [valueColor, trackColor],
          borderWidth: 0,
          cutout,
          hoverOffset: 0,
        },
      ],
    }),
    [percent, valueColor, trackColor, cutout]
  )

  const mergedClassName = ['doughnut-chart', className].filter(Boolean).join(' ')

  return (
    <div className={mergedClassName} aria-label={label ?? `진행률 ${percent}%`}>
      <Doughnut data={data} options={doughnutOptions} />
      <span className="doughnut-chart__value">{percent}%</span>
    </div>
  )
}

export default DoughnutChart
