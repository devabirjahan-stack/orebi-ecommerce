import React, { useState, useEffect } from 'react'
import Container from '../Components/Container.jsx'
import Image from '../Components/Image.jsx'
import HeadphoneImage from '../assets/Home/Headphone.jpg'
import TopLamp from '../assets/Home/TopLamp.png'
import Lamp from '../assets/Home/Lamp.png'
import Clock from '../assets/Home/Clock.png'
import Card from '../Components/Card.jsx'
import LeftClock from '../assets/Home/LeftClock.png'
// Modern Swiper imports (Pure ESM, no CJS wrapper bugs)
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const Home = () => {
  const [products, setProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [bestsellers, setBestsellers] = useState([])
  const [specialOffers, setSpecialOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchAllProducts = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products?limit=50')
        const data = await res.json()

        if (data?.products && isMounted) {
          // Shuffle entire array randomly (Fisher-Yates)
          const shuffled = [...data.products]
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
          }

          // Slice distinct sets for each section
          setNewArrivals(shuffled.slice(0, 8))       // 8 for the Slider
          setBestsellers(shuffled.slice(8, 12))      // 4 for Our Bestsellers
          setSpecialOffers(shuffled.slice(12, 16))   // 4 for Special Offers
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchAllProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const PromoContent = ({
    title,
    discount,
    category,
    position = "absolute z-10 bottom-6 left-6 sm:bottom-12 sm:left-10 xl:bottom-17.5 xl:left-15",
    titleMb = "mb-3 sm:mb-6 xl:mb-9",
    descMb = "mb-5 sm:mb-8 xl:mb-12.5",
    onShopNow,
    className = "",
  }) => {
    return (
      <div className={`${position} ${className}`}>
        <h3 className={`text-2xl sm:text-[1px] xl:text-4xl font-bold text-black ${titleMb}`}>
          {title}
        </h3>

        <p className={`text-gray-500 text-xs sm:text-base flex items-center gap-x-2 ${descMb}`}>
          Up to <span className="text-2xl sm:text-3xl xl:text-4xl font-bold text-black">{discount}</span> sale for all {category}!
        </p>

        <button
          onClick={onShopNow}
          className="cursor-pointer w-fit bg-[#262626] text-white px-8 py-3 sm:px-12 sm:py-3.5 xl:px-15 xl:py-4 font-bold text-xs sm:text-sm hover:bg-black transition-colors"
        >
          Shop Now
        </button>
      </div>
    )
  }

  const PromoCard = ({
  image,
  alt = "Product",
  className = "",
  imageClassName = "",
  contentPosition = "absolute z-10 bottom-4 left-4 sm:bottom-8 sm:left-8 xl:bottom-16.5 xl:left-12.5",
  title,
  discount,
  category,
  titleMb = "mb-2 sm:mb-4 xl:mb-9",
  descMb = "mb-3 sm:mb-6 xl:mb-12.5",
  onShopNow,
  ...contentProps
}) => {
  return (
    <div className={`relative w-full xl:h-1/2 bg-[#f5f5f3] flex flex-col justify-end overflow-hidden ${className}`}>
      {/* Mobile/Tablet: Relative block image dictates exact height (zero empty bars)
          Desktop: Switches back to your exact absolute overlay */}
      {image && (
        <img
          src={image}
          alt={alt}
          className={`w-full h-auto block xl:absolute xl:top-0 xl:right-0 xl:w-full xl:h-full xl:object-contain pointer-events-none ${imageClassName}`}
        />
      )}

      {/* Embedded PromoContent overlay */}
      <PromoContent
        title={title}
        discount={discount}
        category={category}
        position={contentPosition}
        titleMb={titleMb}
        descMb={descMb}
        onShopNow={onShopNow}
        {...contentProps}
      />
    </div>
  )
}

  const ProductGridSection = ({ title, items, loading }) => {
    return (
      <div className="py-10 xl:py-16">
        <Container>
          <h2 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-[#262626] mb-8 xl:mb-12">{title}</h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 xl:gap-10 justify-items-center">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col max-w-92.5 w-full">
                  <div className="w-full aspect-square bg-gray-200" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mt-6 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 xl:gap-10 justify-items-center">
              {items.map((item) => (
                <Card
                  id={item.id}
                  key={item.id}
                  image={item.thumbnail || (item.images && item.images[0])}
                  title={item.title}
                  price={item.price}
                  color={item.brand || item.category || 'Black'}
                  badgeText={item.discountPercentage > 10 ? `-${Math.round(item.discountPercentage)}%` : 'New'}
                />
              ))}
            </div>
          )}
        </Container>
      </div>
    )
  }

  return (
    <div className="w-full pb-20 overflow-x-hidden">
      {/* 1. Hero Banner */}
      <div className="bg-[#f5f5f3] relative">
        <div className="relative">
          <Image Source={HeadphoneImage} Alt="Headphone" ClassName="w-full h-[260px] sm:h-[400px] xl:h-auto object-cover top-0 right-0" />
        </div>
        {/* Desktop: Your exact top-81 left-73.25 | Mobile/Tablet: Cleanly centered vertically on the left */}
        <PromoContent
          title="Final offer"
          discount="50%"
          category="furniture items!"
          position="absolute z-10 top-1/2 -translate-y-1/2 left-6 sm:left-12 xl:left-73.25"
        />
      </div>

      {/* 2. Guarantees Bar */}
      <div className="border-b border-gray-200 py-3 sm:py-4 md:py-6">
  <Container>
    <div className="flex flex-row items-center justify-between text-gray-500 text-[10px] min-[390px]:text-[11px] sm:text-xs md:text-sm lg:text-base">
      
      {/* 1. Warranty */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-3 shrink-0">
        <span className="text-sm min-[390px]:text-base sm:text-lg md:text-2xl font-bold text-black leading-none">
          2
        </span>
        <span className="whitespace-nowrap">Two years warranty</span>
      </div>

      {/* 2. Free Shipping */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-3 shrink-0">
        {/* Truck Icon */}
        <svg 
          className="w-3.5 min-[390px]:w-4 sm:w-[18px] md:w-[25px] h-auto shrink-0" 
          viewBox="0 0 25 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M23.75 13.75H24.375C24.7188 13.75 25 14.0312 25 14.375V15.625C25 15.9688 24.7188 16.25 24.375 16.25H22.5C22.5 18.3203 20.8203 20 18.75 20C16.6797 20 15 18.3203 15 16.25H10C10 18.3203 8.32031 20 6.25 20C4.17969 20 2.5 18.3203 2.5 16.25H1.875C0.839844 16.25 0 15.4102 0 14.375V1.875C0 0.839844 0.839844 0 1.875 0H14.375C15.4102 0 16.25 0.839844 16.25 1.875V3.75H17.9727C18.4688 3.75 18.9453 3.94922 19.2969 4.30078L23.1992 8.20312C23.5508 8.55469 23.75 9.03125 23.75 9.52734V13.75ZM4.375 16.25C4.375 17.2852 5.21484 18.125 6.25 18.125C7.28516 18.125 8.125 17.2852 8.125 16.25C8.125 15.2148 7.28516 14.375 6.25 14.375C5.21484 14.375 4.375 15.2148 4.375 16.25ZM18.75 18.125C17.7148 18.125 16.875 17.2852 16.875 16.25C16.875 15.2148 17.7148 14.375 18.75 14.375C19.7852 14.375 20.625 15.2148 20.625 16.25C20.625 17.2852 19.7852 18.125 18.75 18.125ZM16.25 10H21.875V9.52734L17.9727 5.625H16.25V10Z" fillRule="evenodd" clipRule="evenodd" fill="#262626"/>
        </svg>
        <span className="whitespace-nowrap">Free shipping</span>
      </div>

      {/* 3. Return Policy */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-3 shrink-0">
        {/* Return Icon */}
        <svg 
          className="w-3 min-[390px]:w-3.5 sm:w-4 md:w-5 h-auto shrink-0" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.98165 1.62584e-05C7.30952 0.00481465 4.88335 1.0578 3.09214 2.76957L1.65206 1.32949C1.04238 0.719815 0 1.15159 0 2.01377V7.41937C0 7.95385 0.433266 8.38711 0.967742 8.38711H6.37335C7.23552 8.38711 7.6673 7.34473 7.05766 6.73506L5.37419 5.05159C6.61871 3.88631 8.22907 3.24082 9.93992 3.22606C13.6656 3.19389 16.8062 6.20901 16.774 10.0584C16.7434 13.7101 13.7829 16.7742 10 16.7742C8.34165 16.7742 6.77431 16.1824 5.53911 15.0986C5.34786 14.9308 5.05903 14.941 4.87911 15.1209L3.27984 16.7201C3.08339 16.9166 3.0931 17.2369 3.29927 17.4231C5.0725 19.0247 7.42234 20 10 20C15.5228 20 20 15.5229 20 10.0001C20 4.48361 15.4981 -0.00986277 9.98165 1.62584e-05Z" fill="#262626"/>
        </svg>
        <span className="whitespace-nowrap">Return policy in 30 days</span>
      </div>

    </div>
  </Container>
</div>

      {/* 3. Promo Banner Grid */}
      <div className="py-10 xl:py-20 xl:min-w-300">
        <Container>
          <div className="flex flex-col xl:flex-row gap-6 xl:gap-10">
            {/* Left Tall Card */}
            <div className="w-full xl:w-1/2 min-h-[380px] sm:min-h-[500px] xl:h-195 bg-[#f5f5f3] p-6 sm:p-12 flex flex-col justify-end relative overflow-hidden">
              <img
                src={TopLamp}
                alt="Lamps"
                className="absolute top-0 right-0 w-full h-full object-cover"
              />
              <div className="absolute z-10 bottom-6 left-6 sm:bottom-12 sm:left-10 xl:bottom-17.5 xl:left-15">
                <h3 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-black mb-3 sm:mb-6 xl:mb-9">Phones Sale</h3>
                <p className="text-gray-500 text-xs sm:text-base mb-5 sm:mb-8 xl:mb-12.5 flex items-center gap-x-2">
                  Up to <span className="text-2xl sm:text-3xl xl:text-4xl font-bold text-black">30%</span> sale for all phones!
                </p>
                <button className="cursor-pointer w-fit bg-[#262626] text-white px-8 py-3 sm:px-12 sm:py-3.5 xl:px-15 xl:py-4 font-bold text-xs sm:text-sm hover:bg-black">
                  Shop Now
                </button>
              </div>
            </div>

            {/* Right Column (Electronics & Furniture) */}
            <div className="w-full xl:w-1/2 xl:h-195 flex flex-col gap-6 xl:gap-10 justify-between">
              {/* Top Card: Electronics */}
              <PromoCard
                image={Clock}
                title="Phones Sale"
                discount="30%"
                category="phones"
                titleMb="mb-3 sm:mb-6 xl:mb-9"
                descMb="mb-5 sm:mb-8 xl:mb-12.5"
                onShopNow={() => console.log('Shop Clocks')}
              />

              {/* Bottom Card: Furniture */}
              <PromoCard
                image={Lamp}
                title="Furniture offer"
                discount="50%"
                category="furniture items"
                onShopNow={() => console.log('Shop furniture')}
                titleMb="mb-3 sm:mb-6 xl:mb-9"
                descMb="mb-5 sm:mb-8 xl:mb-12.5"
              />
            </div>
          </div>
        </Container>
      </div>

      {/* 4. New Arrivals Section */}
      <div className="py-8">
        <Container>
          <h2 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-[#262626] mb-8 xl:mb-12">New Arrivals</h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="w-full aspect-square bg-gray-200" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative group/slider">
              {/* Prev Button */}
              <button
                type="button"
                id="swiper-prev-btn"
                aria-label="Previous slide"
                className="cursor-pointer absolute left-0 xl:-left-5 top-[40%] xl:top-46.25 -translate-y-1/2 z-30 w-12 h-12 xl:w-16 xl:h-16 rounded-full bg-[#979797]/60 hover:bg-[#262626] text-white flex items-center justify-center transition-all shadow-md focus:outline-none disabled:opacity-0 disabled:pointer-events-none"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                type="button"
                id="swiper-next-btn"
                aria-label="Next slide"
                className="cursor-pointer absolute right-0 xl:-right-5 top-[40%] xl:top-46.25 -translate-y-1/2 z-30 w-12 h-12 xl:w-16 xl:h-16 rounded-full bg-[#979797]/60 hover:bg-[#262626] text-white flex items-center justify-center transition-all shadow-md focus:outline-none disabled:opacity-0 disabled:pointer-events-none"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              {/* Swiper Slider with gap-x-10 (40px) */}
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: '#swiper-prev-btn',
                  nextEl: '#swiper-next-btn',
                }}
                spaceBetween={40}
                slidesPerView={4}
                loop={newArrivals.length > 4}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 16 },
                  640: { slidesPerView: 2, spaceBetween: 24 },
                  1024: { slidesPerView: 3, spaceBetween: 30 },
                  1440: { slidesPerView: 4, spaceBetween: 40 },
                }}
                className="overflow-hidden!"
              >
                {newArrivals.map((item) => (
                  <SwiperSlide key={item.id} className="flex justify-center">
                    <Card
                      id={item.id}
                      image={item.thumbnail || (item.images && item.images[0])}
                      title={item.title}
                      price={item.price}
                      color={item.brand || item.category || 'Black'}
                      badgeText={item.discountPercentage > 10 ? `-${Math.round(item.discountPercentage)}%` : 'New'}
                    >
                      {/* Section-Specific Slide-Up Hover Actions */}
                      <div className="absolute inset-x-0 bottom-0 z-20 bg-white/95 px-7 py-6 flex flex-col items-end gap-3 translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0">
                        <button
                          type="button"
                          className="cursor-pointer flex items-center justify-end gap-3 text-sm text-[#767676] hover:text-[#262626] hover:font-bold transition-all"
                        >
                          <span>Add to Wish List</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          className="cursor-pointer flex items-center justify-end gap-3 text-sm text-[#767676] hover:text-[#262626] hover:font-bold transition-all"
                        >
                          <span>Compare</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          className="cursor-pointer flex items-center justify-end gap-3 text-sm text-[#767676] hover:text-[#262626] hover:font-bold transition-all"
                        >
                          <span>Add to Cart</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>
                      </div>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </Container>
      </div>

      {/* 5. Our Bestsellers Section */}
      <ProductGridSection
        title="Our Bestsellers"
        items={bestsellers}
        loading={loading}
      />

      {/* Phone of the Year Banner */}
      <div className="relative my-6 xl:my-0">
        <Container>
          <div className="relative bg-[#f5f5f3] xl:bg-transparent overflow-hidden">
            <Image
              Source={LeftClock}
              Alt="Phone of the year"
              ClassName="w-full h-[260px] sm:h-[320px] xl:h-full object-cover top-0 left-0"
            />
            {/* Desktop (2xl): Your exact top-15 left-210 | Smaller screens: Clean right/center overlay */}
            <div className="max-w-120 absolute top-1/2 -translate-y-1/2 left-6 sm:left-auto sm:right-8 2xl:right-auto 2xl:translate-y-0 2xl:top-15 2xl:left-210 pr-4 sm:pr-0">
              <h3 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-black mb-3 sm:mb-6 xl:mb-9.5">
                Phone of the year
              </h3>

              <p className="text-gray-500 text-xs sm:text-base flex items-center gap-x-2 mb-5 sm:mb-8 xl:mb-12.5">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry orem Ipsum..
              </p>

              <button
                className="cursor-pointer w-fit bg-[#262626] text-white px-8 py-3 sm:px-12 sm:py-3.5 xl:px-15 xl:py-4 font-bold text-xs sm:text-sm hover:bg-black transition-colors"
              >
                Shop Now
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* 6. Special Offers Section */}
      <ProductGridSection
        title="Special Offers"
        items={specialOffers}
        loading={loading}
      />
    </div>
  )
}

export default Home