import React from 'react'
import { useNavigate } from 'react-router-dom'

const Card = ({
  id,
  image,
  title = 'Basic Crew Neck Tee',
  price = '$44.00',
  color = 'Black',
  badgeText = 'New',
  showBadge = true,
  children,
  className = '',
}) => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    if (id) {
      navigate(`/product/${id}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className={`w-full max-w-[370px] sm:w-[370px] h-auto sm:h-[465px] flex flex-col justify-between bg-white select-none group font-sans shrink-0 ${className}`}>
      {/* 370px x 370px Image Container on Desktop, fluid square on tiny mobile */}
      <div
        onClick={handleNavigate}
        className="relative w-full sm:w-[370px] aspect-square sm:h-[370px] bg-[#f5f5f3] flex items-center justify-center overflow-hidden shrink-0 cursor-pointer"
      >
        {showBadge && badgeText && (
          <span className="absolute top-5 left-5 z-10 bg-[#262626] text-white text-[13px] font-bold px-7 py-2 pointer-events-none">
            {badgeText}
          </span>
        )}

        <img
          src={image}
          alt={title}
          className="w-4/5 h-4/5 object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Stop propagation on hover menu so clicking 'Add to Cart' doesn't trigger page navigation */}
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>

      {/* 95px Metadata Section */}
      <div className="pt-6 flex flex-col justify-between pb-1 flex-1">
        <div className="flex items-center justify-between text-lg sm:text-xl font-bold text-[#262626] mb-2 sm:mb-4">
          <h4
            onClick={handleNavigate}
            className="cursor-pointer hover:text-black truncate pr-3"
            title={title}
          >
            {title}
          </h4>
          <span className="text-[#767676] font-normal text-sm sm:text-base shrink-0">
            {typeof price === 'number' ? `$${price.toFixed(2)}` : price}
          </span>
        </div>
        <p className="text-sm sm:text-base text-[#767676] capitalize">
          {color}
        </p>
      </div>
    </div>
  )
}

export default Card