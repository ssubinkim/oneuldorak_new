import type { Swiper as SwiperInstance } from 'swiper'
import { EffectCoverflow } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-coverflow'

import './CoverflowSwiper.css'

export type CoverflowSlideItem = {
  id: number | string
  image: string
  title: string
  likes?: number
  comments?: number
}

type CoverflowSwiperProps = {
  items: CoverflowSlideItem[]
  className?: string
  initialSlide?: number
  onActiveIndexChange?: (index: number) => void
}

function getRealIndex(swiper: SwiperInstance): number {
  return typeof swiper.realIndex === 'number' ? swiper.realIndex : swiper.activeIndex
}

export default function CoverflowSwiper({
  items,
  className,
  initialSlide = 0,
  onActiveIndexChange,
}: CoverflowSwiperProps) {
  return (
    <Swiper
      effect="coverflow"
      grabCursor
      centeredSlides
      slidesPerView="auto"
      initialSlide={initialSlide}
      loop={items.length > 2}
      modules={[EffectCoverflow]}
      coverflowEffect={{
        rotate: 0,
        stretch: 56,
        depth: 220,
        modifier: 1.25,
        slideShadows: false,
      }}
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
              {(typeof item.likes === 'number' || typeof item.comments === 'number') && (
                <p className="coverflow-swiper__meta">
                  <span className="coverflow-swiper__heart">♡</span>
                  <span>{typeof item.likes === 'number' ? item.likes : 0}</span>
                  <span className="coverflow-swiper__dot">·</span>
                  <svg
                    className="coverflow-swiper__comment-icon"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 2.5h11v7.5h-4.8L5.3 13.2v-3.2H2.5z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{typeof item.comments === 'number' ? item.comments : 0}</span>
                </p>
              )}
            </div>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
