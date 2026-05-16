import { type CSSProperties, useEffect, useMemo } from 'react'
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, type ChartData, type ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import walking01Image from '../images/walking01.gif'
import yeah02Image from '../images/yeah02.gif'
import './OnboardingQuestionProgress.css'

ChartJS.register(CategoryScale, LinearScale, BarElement)

type OnboardingQuestionProgressProps = {
  current: number
  mascotType?: 'dorak06' | 'signup'
  total: number
}

const progressMascotImages = [walking01Image, yeah02Image]

function OnboardingQuestionProgress({ current, mascotType = 'signup', total }: OnboardingQuestionProgressProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    progressMascotImages.forEach((src) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = src
    })
  }, [])

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
          backgroundColor: '#FFD515',
          borderRadius: 999,
          borderSkipped: false,
          barThickness: 8,
        },
        {
          data: [remainingProgress],
          backgroundColor: '#FFF4D6',
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
        <span className="onboarding-question-progress__count--current">{current}</span>/{total}
      </span>
      <div className="onboarding-question-progress__bar-wrapper">
        <div className="onboarding-question-progress__chart" aria-hidden="true">
          <Bar data={chartData} options={chartOptions} />
        </div>
        <img
          className="onboarding-question-progress__mascot"
          src={mascotType === 'dorak06' ? walking01Image : yeah02Image}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  )
}

export default OnboardingQuestionProgress
