import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-coverflow'

import { EffectCoverflow } from 'swiper/modules'

import './CoverflowSwiper.css'

type SlideItem = {
  id: number
  image: string
  title?: string
}

type CoverflowSwiperProps = {
  items: SlideItem[]
}

export default function CoverflowSwiper({ items }: CoverflowSwiperProps) {
  return (
    <Swiper
      effect="coverflow"
      grabCursor
      centeredSlides
      slidesPerView="auto"
      modules={[EffectCoverflow]}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 120,
        modifier: 2.2,
        slideShadows: false,
      }}
      className="coverflow-swiper"
    >
      {items.map((item) => (
        <SwiperSlide key={item.id} className="coverflow-swiper__slide">
          <img src={item.image} alt={item.title ?? `slide-${item.id}`} />
          {item.title && <p>{item.title}</p>}
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
