import type { Swiper as SwiperInstance } from 'swiper'
import { Autoplay, EffectCoverflow } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-coverflow'

import './CoverflowSwiper.css'

export type CoverflowSlideItem = {
  id: number | string
  image: string
  title: string
  likes?: number
  views?: number
}

type CoverflowSwiperProps = {
  items: CoverflowSlideItem[]
  className?: string
  initialSlide?: number
  effectMode?: 'coverflow' | 'slide'
  spaceBetween?: number
  autoplay?: boolean
  autoplayDelayMs?: number
  onActiveIndexChange?: (index: number) => void
}

function getRealIndex(swiper: SwiperInstance): number {
  return typeof swiper.realIndex === 'number' ? swiper.realIndex : swiper.activeIndex
}

export default function CoverflowSwiper({
  items,
  className,
  initialSlide = 0,
  effectMode = 'coverflow',
  spaceBetween = 0,
  autoplay = false,
  autoplayDelayMs = 2000,
  onActiveIndexChange,
}: CoverflowSwiperProps) {
  const isCoverflow = effectMode === 'coverflow'
  const modules = [
    ...(isCoverflow ? [EffectCoverflow] : []),
    ...(autoplay ? [Autoplay] : []),
  ]

  return (
    <Swiper
      effect={effectMode}
      grabCursor
      centeredSlides
      slidesPerView="auto"
      spaceBetween={spaceBetween}
      initialSlide={initialSlide}
      loop={items.length > 2}
      modules={modules}
      autoplay={
        autoplay
          ? {
              delay: autoplayDelayMs,
              disableOnInteraction: false,
            }
          : false
      }
      coverflowEffect={
        isCoverflow
          ? {
              rotate: 0,
              stretch: 56,
              depth: 220,
              modifier: 1.25,
              slideShadows: false,
            }
          : undefined
      }
      onSlideChange={(swiper) => {
        onActiveIndexChange?.(getRealIndex(swiper))
      }}
      onAfterInit={(swiper) => {
        onActiveIndexChange?.(getRealIndex(swiper))
      }}
      className={`coverflow-swiper${className ? ` ${className}` : ''}`}
    >
      {items.map((item) => (
        <SwiperSlide key={item.id} className="coverflow-swiper__slide">
          <article className="coverflow-swiper__card">
            <img className="coverflow-swiper__image" src={item.image} alt={item.title} />
            <div className="coverflow-swiper__body">
              <h3>{item.title}</h3>
              {(typeof item.likes === 'number' || typeof item.views === 'number') && (
                <p className="coverflow-swiper__meta">
                  {typeof item.likes === 'number' && (
                    <>
                      <span className="coverflow-swiper__heart">♡</span>
                      <span>{item.likes}</span>
                    </>
                  )}
                  {typeof item.likes === 'number' && typeof item.views === 'number' && (
                    <span className="coverflow-swiper__dot">·</span>
                  )}
                  {typeof item.views === 'number' && (
                    <span className="coverflow-swiper__views-text">조회수 {item.views}</span>
                  )}
                </p>
              )}
            </div>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
