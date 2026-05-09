import { useMemo } from 'react'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import './BarChart.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type BarChartProps = {
  labels: string[]
  values: number[]
  datasetLabel?: string
  className?: string
  barColor?: string
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
}

function BarChart({
  labels,
  values,
  datasetLabel = '',
  className = '',
  barColor = '#F34840',
  showGrid = true,
  showLegend = false,
  showTooltip = true,
}: BarChartProps) {
  const data = useMemo<ChartData<'bar', number[], string>>(
    () => ({
      labels,
      datasets: [
        {
          label: datasetLabel,
          data: values,
          backgroundColor: barColor,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 26,
        },
      ],
    }),
    [labels, values, datasetLabel, barColor]
  )

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      animation: {
        duration: 1000,
        easing: 'easeOutQuart',
      },
      plugins: {
        legend: {
          display: showLegend,
        },
        tooltip: {
          enabled: showTooltip,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#7b8595',
            font: { size: 11, weight: 600 },
          },
          border: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: showGrid,
            color: '#eceff4',
          },
          ticks: {
            color: '#9aa2b0',
            font: { size: 10 },
          },
          border: {
            display: false,
          },
        },
      },
    }),
    [showLegend, showTooltip, showGrid]
  )

  const mergedClassName = ['bar-chart', className].filter(Boolean).join(' ')

  return (
    <div className={mergedClassName}>
      <Bar data={data} options={options} />
    </div>
  )
}

export default BarChart
