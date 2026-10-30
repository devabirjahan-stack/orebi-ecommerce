import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Container from '../Components/Container.jsx'

const ProductDetails = () => {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  // Interactive Product States
  const [selectedColor, setSelectedColor] = useState(1) // Default 2nd coral swatch active like Figma
  const [selectedSize, setSelectedSize] = useState('S')
  const [quantity, setQuantity] = useState(1)

  // Accordion States
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [shippingOpen, setShippingOpen] = useState(false)

  // Tabs & Reviews States (Default 'reviews' tab active like Figma)
  const [activeTab, setActiveTab] = useState('reviews')
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'John Ford',
      rating: 5,
      date: '6 months ago',
      comment:
        'Detailed customer feedback goes here. This section displays verified buyer impressions regarding product build quality, sizing accuracy, and overall satisfaction over extended everyday use.',
    },
  ])

  // New Review Form State
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', comment: '' })

  // Color Swatches matching Figma
  const colors = [
    { id: 0, name: 'Gray', hex: '#979797' },
    { id: 1, name: 'Coral', hex: '#FF8686' },
    { id: 2, name: 'Light Green', hex: '#7ED321' },
    { id: 3, name: 'Off White', hex: '#B6B6B6' },
    { id: 4, name: 'Teal', hex: '#15CBA5' },
  ]

  useEffect(() => {
    let isMounted = true
    const fetchSingleProduct = async () => {
      setLoading(true)
      try {
        const res = await fetch(`https://dummyjson.com/products/${id || 1}`)
        const data = await res.json()
        if (isMounted && data) {
          setProduct(data)
          if (data.reviews && data.reviews.length > 0) {
            setReviews(
              data.reviews.map((r, idx) => ({
                id: idx + 1,
                author: r.reviewerName || 'John Ford',
                rating: r.rating || 5,
                date: '6 months ago',
                comment: r.comment,
              }))
            )
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchSingleProduct()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return

    const newEntry = {
      id: Date.now(),
      author: reviewForm.name,
      rating: 5,
      date: 'Just now',
      comment: reviewForm.comment,
    }

    setReviews((prev) => [newEntry, ...prev])
    setReviewForm({ name: '', email: '', comment: '' })
  }

  // Build 4-image gallery for the 2x2 grid
  const galleryImages = React.useMemo(() => {
    if (!product) return []
    const imgs = product.images?.length ? [...product.images] : [product.thumbnail]
    while (imgs.length < 4) {
      imgs.push(product.thumbnail || imgs[0])
    }
    return imgs.slice(0, 4)
  }, [product])

  // Reusable Star Rating Renderer
  const StarRating = ({ count = 5 }) => (
    <div className="flex items-center gap-1 text-[#FFD881]">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i < count ? 'currentColor' : '#E5E5E5'}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="w-full py-16 bg-white">
        <Container>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 w-32 mb-12" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full aspect-square bg-gray-200" />
              ))}
            </div>
          </div>
        </Container>
      </div>
    )
  }

  const currentPrice = product?.price ? Number(product.price) : 44.0
  const oldPrice = product?.discountPercentage
    ? (currentPrice / (1 - product.discountPercentage / 100)).toFixed(2)
    : (currentPrice * 2).toFixed(2)

  return (
    <div className="w-full bg-white pb-24 font-sans text-[#767676]">
      <Container>
        {/* 1. Top Breadcrumb */}
        <div className="pt-8 pb-10 sm:pb-14">
          <div className="flex items-center gap-2 text-xs text-[#767676]">
            <Link to="/" className="hover:text-[#262626] transition-colors">
              Home
            </Link>
            <span>&gt;</span>
            <Link to="/shop" className="hover:text-[#262626] transition-colors">
              Products
            </Link>
          </div>
        </div>

        {/* 2. 2x2 Product Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10 mb-12 sm:mb-16">
          {galleryImages.map((imgUrl, index) => (
            <div
              key={index}
              className="w-full aspect-square bg-[#F5F5F3] flex items-center justify-center p-8 sm:p-14 overflow-hidden"
            >
              <img
                src={imgUrl}
                alt={`${product?.title || 'Product'} view ${index + 1}`}
                className="w-4/5 h-4/5 object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* 3. Product Details & Controls (Left half width on desktop matching Figma) */}
        <div className="w-full lg:w-1/2">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-[#262626] mb-4">
            {product?.title || 'Product'}
          </h1>

          {/* Rating & Review Count */}
          <div className="flex items-center gap-6 mb-5">
            <StarRating count={Math.round(product?.rating || 5)} />
            <span className="text-xs text-[#767676]">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>

          {/* Price Row */}
          <div className="flex items-center gap-5 pb-6 border-b border-[#F0F0F0]">
            <span className="text-base text-[#767676] line-through">${oldPrice}</span>
            <span className="text-xl font-bold text-[#262626]">
              ${currentPrice.toFixed(2)}
            </span>
          </div>

          {/* Selectors: COLOR, SIZE, QUANTITY */}
          <div className="py-7 flex flex-col gap-6 border-b border-[#F0F0F0]">
            {/* COLOR */}
            <div className="flex items-center">
              <span className="w-28 text-sm font-bold text-[#262626] uppercase tracking-wide">
                COLOR:
              </span>
              <div className="flex items-center gap-3.5">
                {colors.map((c) => {
                  const isActive = selectedColor === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColor(c.id)}
                      aria-label={c.name}
                      style={{ backgroundColor: c.hex }}
                      className={`rounded-full cursor-pointer transition-all duration-200 ${
                        isActive ? 'w-7 h-7 shadow-xs' : 'w-5 h-5 opacity-75 hover:opacity-100'
                      }`}
                    />
                  )
                })}
              </div>
            </div>

            {/* SIZE */}
            <div className="flex items-center">
              <span className="w-28 text-sm font-bold text-[#262626] uppercase tracking-wide">
                SIZE:
              </span>
              <div className="relative w-36">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full h-9 px-4 bg-white border border-[#F0F0F0] text-sm text-[#767676] appearance-none focus:outline-none cursor-pointer"
                >
                  {['S', 'M', 'L', 'XL'].map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-[#767676]">
                  ▼
                </span>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center">
              <span className="w-28 text-sm font-bold text-[#262626] uppercase tracking-wide">
                QUANTITY:
              </span>
              <div className="w-36 h-9 border border-[#F0F0F0] flex items-center justify-between px-4 text-sm text-[#767676] select-none">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="cursor-pointer hover:text-[#262626] font-bold px-1"
                >
                  −
                </button>
                <span className="text-[#262626] font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="cursor-pointer hover:text-[#262626] font-bold px-1"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="py-5 flex items-center border-b border-[#F0F0F0]">
            <span className="w-28 text-sm font-bold text-[#262626] uppercase tracking-wide">
              STATUS:
            </span>
            <span className="text-sm text-[#767676]">
              {product?.availabilityStatus || 'In stock'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="py-7 flex flex-wrap items-center gap-5 border-b border-[#F0F0F0]">
            <button
              type="button"
              className="cursor-pointer w-48 py-4 border border-[#262626] bg-white text-[#262626] font-bold text-sm hover:bg-[#262626] hover:text-white transition-colors"
            >
              Add to Wish List
            </button>
            <button
              type="button"
              className="cursor-pointer w-48 py-4 bg-[#262626] text-white font-bold text-sm hover:bg-black transition-colors"
            >
              Add to Cart
            </button>
          </div>

          {/* Collapsible Accordions */}
          <div className="border-b border-[#F0F0F0]">
            <button
              type="button"
              onClick={() => setFeaturesOpen(!featuresOpen)}
              className="w-full py-5 flex items-center justify-between text-left cursor-pointer"
            >
              <span className="text-sm font-bold text-[#262626] uppercase tracking-wide">
                FEATURES &amp; DETAILS
              </span>
              <span className="text-base font-bold text-[#262626]">
                {featuresOpen ? '−' : '+'}
              </span>
            </button>
            {featuresOpen && (
              <div className="pb-5 text-sm text-[#767676] leading-relaxed">
                {product?.description ||
                  'Crafted with premium materials for durability and everyday comfort.'}
              </div>
            )}
          </div>

          <div className="border-b border-[#F0F0F0]">
            <button
              type="button"
              onClick={() => setShippingOpen(!shippingOpen)}
              className="w-full py-5 flex items-center justify-between text-left cursor-pointer"
            >
              <span className="text-sm font-bold text-[#262626] uppercase tracking-wide">
                SHIPPING &amp; RETURNS
              </span>
              <span className="text-base font-bold text-[#262626]">
                {shippingOpen ? '−' : '+'}
              </span>
            </button>
            {shippingOpen && (
              <div className="pb-5 text-sm text-[#767676] leading-relaxed">
                {product?.shippingInformation ||
                  'Free standard shipping on orders. 30-day return policy applies.'}
              </div>
            )}
          </div>

          {/* Short Note Below Accordions */}
          <p className="pt-5 text-sm text-[#767676] leading-relaxed">
            {product?.description ||
              'Designed with modern aesthetics and reliable construction to suit your daily needs.'}
          </p>
        </div>

        {/* 4. Description & Reviews Tabs Section (Full Width) */}
        <div className="pt-24">
          {/* Tab Headers */}
          <div className="flex items-center gap-12 mb-10">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`text-lg cursor-pointer transition-colors ${
                activeTab === 'description'
                  ? 'font-bold text-[#262626]'
                  : 'text-[#767676] hover:text-[#262626]'
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`text-lg cursor-pointer transition-colors ${
                activeTab === 'reviews'
                  ? 'font-bold text-[#262626]'
                  : 'text-[#767676] hover:text-[#262626]'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'description' ? (
            <div className="py-6 border-y border-[#F0F0F0] text-sm text-[#767676] leading-relaxed">
              {product?.description ||
                'Full product specifications, care instructions, and material breakdown.'}
            </div>
          ) : (
            <div>
              {/* Count Subtitle */}
              <p className="text-xs text-[#767676] pb-4 border-b border-[#F0F0F0]">
                {reviews.length} review for {product?.title || 'Product'}
              </p>

              {/* Review List */}
              <div className="divide-y divide-[#F0F0F0] border-b border-[#F0F0F0]">
                {reviews.map((rev) => (
                  <div key={rev.id} className="py-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-6">
                        <span className="text-sm font-medium text-[#262626]">
                          {rev.author}
                        </span>
                        <StarRating count={rev.rating} />
                      </div>
                      <span className="text-xs text-[#767676]">{rev.date}</span>
                    </div>
                    <p className="text-sm text-[#767676] leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>

              {/* 5. Add a Review Form */}
              <div className="pt-12 max-w-xl">
                <h3 className="text-lg font-bold text-[#262626] mb-8">
                  Add a Review
                </h3>

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-2 border-b border-[#F0F0F0] pb-3">
                    <label className="text-sm font-bold text-[#262626]">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name here"
                      value={reviewForm.name}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, name: e.target.value })
                      }
                      className="text-xs text-[#262626] placeholder-[#767676] outline-none bg-transparent"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2 border-b border-[#F0F0F0] pb-3">
                    <label className="text-sm font-bold text-[#262626]">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Your email here"
                      value={reviewForm.email}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, email: e.target.value })
                      }
                      className="text-xs text-[#262626] placeholder-[#767676] outline-none bg-transparent"
                      required
                    />
                  </div>

                  {/* Review */}
                  <div className="flex flex-col gap-2 border-b border-[#F0F0F0] pb-3">
                    <label className="text-sm font-bold text-[#262626]">
                      Review
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Your review here"
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, comment: e.target.value })
                      }
                      className="text-xs text-[#262626] placeholder-[#767676] outline-none bg-transparent resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 cursor-pointer w-44 py-3.5 bg-[#262626] text-white font-bold text-xs hover:bg-black transition-colors"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

export default ProductDetails