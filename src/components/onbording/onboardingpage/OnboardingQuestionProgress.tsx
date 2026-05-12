import { type CSSProperties } from 'react'
import { useMemo } from 'react'
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, type ChartData, type ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import dorak06Image from '../images/dorak06.png'
import signupDorakImage from '../images/signup_dorak.png'
import './OnboardingQuestionProgress.css'

ChartJS.register(CategoryScale, LinearScale, BarElement)

type OnboardingQuestionProgressProps = {
  current: number
  mascotType?: 'dorak06' | 'signup'
  total: number
}

function OnboardingQuestionProgress({ current, mascotType = 'signup', total }: OnboardingQuestionProgressProps) {
  const progressPercent = (current / total) * 100
  const progressStyle = {
    '--progress-percent': `${progressPercent}%`,
    '--progress-ratio': current / total,
  } as CSSProperties
  const remainingProgress = Math.max(total - current, 0)

  const chartData = useMemo<ChartData<'bar', number[], string>>(
    () => ({
      labels: ['progress'],
      datasets: [
        {
          data: [current],
          backgroundColor: '#ffd515',
          borderRadius: 999,
          borderSkipped: false,
          barThickness: 8,
        },
        {
          data: [remainingProgress],
          backgroundColor: '#f7dc83',
          borderRadius: 999,
          borderSkipped: false,
          barThickness: 8,
        },
      ],
    }),
    [current, remainingProgress]
  )

  const chartOptions = useMemo<ChartOptions<'bar'>>(
    () => ({
      animation: {
        duration: 220,
        easing: 'easeOutQuart',
      },
      events: [],
      indexAxis: 'y',
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {
        x: {
          display: false,
          max: total,
          min: 0,
          stacked: true,
        },
        y: {
          display: false,
          stacked: true,
        },
      },
    }),
    [total]
  )

  return (
    <div className="onboarding-question-progress" style={progressStyle} aria-label={`${current} / ${total}`}>
      <span className="onboarding-question-progress__count">
        {current}/{total}
      </span>
      <img
        className="onboarding-question-progress__mascot onboarding-question-progress__mascot--image"
        src={mascotType === 'dorak06' ? dorak06Image : signupDorakImage}
        alt=""
        aria-hidden="true"
      />
      <div className="onboarding-question-progress__chart" aria-hidden="true">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

export default OnboardingQuestionProgress
