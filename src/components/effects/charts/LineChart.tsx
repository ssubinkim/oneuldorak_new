import { useMemo } from 'react'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import './LineChart.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

type LineChartProps = {
  labels: string[]
  values: number[]
  datasetLabel?: string
  className?: string
  lineColor?: string
  fillColor?: string
  showArea?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  showGrid?: boolean
}

function LineChart({
  labels,
  values,
  datasetLabel = '',
  className = '',
  lineColor = '#F34840',
  fillColor = 'rgba(243, 72, 64, 0.12)',
  showArea = true,
  showLegend = false,
  showTooltip = true,
  showGrid = true,
}: LineChartProps) {
  const data = useMemo<ChartData<'line', number[], string>>(
    () => ({
      labels,
      datasets: [
        {
          label: datasetLabel,
          data: values,
          borderColor: lineColor,
          borderWidth: 2.5,
          pointRadius: 3.5,
          pointHoverRadius: 5,
          pointBorderWidth: 2,
          pointBackgroundColor: '#fff',
          pointBorderColor: lineColor,
          fill: showArea,
          backgroundColor: fillColor,
          tension: 0.35,
        },
      ],
    }),
    [labels, values, datasetLabel, lineColor, fillColor, showArea]
  )

  const options = useMemo<ChartOptions<'line'>>(
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

  const mergedClassName = ['line-chart', className].filter(Boolean).join(' ')

  return (
    <div className={mergedClassName}>
      <Line data={data} options={options} />
    </div>
  )
}

export default LineChart
