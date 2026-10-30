import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import Container from '../Components/Container.jsx'
import Card from '../Components/Card.jsx'

const Products = () => {
  // ----------------- State Management -----------------
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Layout View Mode (Grid vs List)
  const [isGridView, setIsGridView] = useState(true)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Dropdown States
  const [sortBy, setSortBy] = useState('Featured')
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isShowOpen, setIsShowOpen] = useState(false)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)

  // Sidebar Accordion States
  const [categorySubOpen, setCategorySubOpen] = useState({ 1: false, 3: false })
  const [isColorOpen, setIsColorOpen] = useState(true)
  const [isBrandOpen, setIsBrandOpen] = useState(true)

  // Active Filter Criteria
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [selectedPriceRange, setSelectedPriceRange] = useState(null)

  // Dropdown Outside Click Refs
  const sortRef = useRef(null)
  const showRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false)
      }
      if (showRef.current && !showRef.current.contains(e.target)) {
        setIsShowOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ----------------- Data Fetching -----------------
  useEffect(() => {
    let isMounted = true
    const fetchCatalog = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products?limit=80')
        const data = await res.json()

        if (data?.products && isMounted) {
          const colorsPool = ['Color 1', 'Color 2', 'Color 3', 'Color 4', 'Color 5']
          const brandsPool = ['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4', 'Brand 5']
          const categoryPool = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']

          const mapped = data.products.map((p, idx) => ({
            id: p.id,
            title: p.title,
            price: Number(p.price),
            rating: p.rating,
            category: categoryPool[idx % 5],
            brand: brandsPool[idx % 5],
            colorName: colorsPool[idx % 5],
            image: p.thumbnail || p.images?.[0],
            badgeText:
              idx === 0 || idx === 4
                ? 'New'
                : idx % 3 === 0
                ? '-10%'
                : idx % 5 === 0
                ? '-15%'
                : null,
          }))

          setProducts(mapped)
        }
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCatalog()
    return () => {
      isMounted = false
    }
  }, [])

  // ----------------- Filter Configurations -----------------
  const categoryConfig = [
    { id: 1, name: 'Category 1', hasSub: true, sub: ['Subcategory 1.1', 'Subcategory 1.2'] },
    { id: 2, name: 'Category 2', hasSub: false },
    { id: 3, name: 'Category 3', hasSub: true, sub: ['Subcategory 3.1', 'Subcategory 3.2'] },
    { id: 4, name: 'Category 4', hasSub: false },
    { id: 5, name: 'Category 5', hasSub: false },
  ]

  const colorConfig = [
    { id: 1, name: 'Color 1', hex: '#000000' },
    { id: 2, name: 'Color 2', hex: '#FF8686' },
    { id: 3, name: 'Color 3', hex: '#7ED321' },
    { id: 4, name: 'Color 4', hex: '#B6B6B6' },
    { id: 5, name: 'Color 5', hex: '#15CBA5' },
  ]

  const brandConfig = [
    { id: 1, name: 'Brand 1' },
    { id: 2, name: 'Brand 2' },
    { id: 3, name: 'Brand 3' },
    { id: 4, name: 'Brand 4' },
    { id: 5, name: 'Brand 5' },
  ]

  const priceConfig = [
    { id: 1, label: '$0.00 - $9.99', min: 0, max: 9.99 },
    { id: 2, label: '$10.00 - $19.99', min: 10, max: 19.99 },
    { id: 3, label: '$20.00 - $29.99', min: 20, max: 29.99 },
    { id: 4, label: '$30.00 - $39.99', min: 30, max: 39.99 },
    { id: 5, label: '$40.00 - $69.99', min: 40, max: 69.99 },
  ]

  // Filter Trigger Helper
  const handleFilterChange = (setter, value) => {
    setter((prev) => (prev === value ? null : value))
    setCurrentPage(1)
  }

  // ----------------- Filter & Sorting Engine -----------------
  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (selectedCategory) {
      result = result.filter(
        (p) => p.category === selectedCategory || selectedCategory.startsWith(p.category)
      )
    }

    if (selectedColor) {
      result = result.filter((p) => p.colorName === selectedColor)
    }

    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand)
    }

    if (selectedPriceRange) {
      const targetRange = priceConfig.find((r) => r.id === selectedPriceRange)
      if (targetRange) {
        result = result.filter((p) => p.price >= targetRange.min && p.price <= targetRange.max)
      }
    }

    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'Newest') {
      result.sort((a, b) => (b.badgeText === 'New' ? 1 : 0) - (a.badgeText === 'New' ? 1 : 0))
    }

    return result
  }, [products, selectedCategory, selectedColor, selectedBrand, selectedPriceRange, sortBy])

  // ----------------- Dynamic Pagination Calculations -----------------
  const totalProducts = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage))
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const startIndex = (validCurrentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalProducts)
  const currentItems = filteredProducts.slice(startIndex, endIndex)

  // Sliding Window: guarantees neighbor pages stay accessible when middle pages are active
  const getPaginationRange = () => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Near start: 1, 2, 3, 4, ..., totalPages
    if (validCurrentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages]
    }

    // Near end: 1, ..., total-3, total-2, total-1, total
    if (validCurrentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    // In middle: 1, ..., current-1, current, current+1, ..., total
    return [1, '...', validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, '...', totalPages]
  }

  const handlePageSelect = (page) => {
    if (page !== validCurrentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 180, behavior: 'smooth' })
    }
  }

  // ----------------- Sidebar Content Component -----------------
  const SidebarContent = () => (
    <div className="flex flex-col gap-9 w-full font-sans select-none text-[#767676]">
      {/* 1. Shop by Category */}
      <div>
        <h3 className="text-xl font-bold text-[#262626] mb-5">Shop by Category</h3>
        <ul className="flex flex-col text-sm">
          {categoryConfig.map((cat) => (
            <li key={cat.id} className="border-b border-[#F0F0F0] py-4">
              <div
                onClick={() => handleFilterChange(setSelectedCategory, cat.name)}
                className="flex items-center justify-between cursor-pointer hover:text-[#262626] transition-colors"
              >
                <span className={selectedCategory === cat.name ? 'font-bold text-[#262626]' : ''}>
                  {cat.name}
                </span>
                {cat.hasSub && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCategorySubOpen((prev) => ({ ...prev, [cat.id]: !prev[cat.id] }))
                    }}
                    className="text-base font-bold text-[#767676] hover:text-[#262626] px-1"
                  >
                    {categorySubOpen[cat.id] ? '−' : '+'}
                  </button>
                )}
              </div>

              {cat.hasSub && categorySubOpen[cat.id] && (
                <ul className="pl-4 pt-3 flex flex-col gap-2.5 text-xs">
                  {cat.sub.map((subItem) => (
                    <li
                      key={subItem}
                      onClick={() => handleFilterChange(setSelectedCategory, subItem)}
                      className={`cursor-pointer hover:text-[#262626] ${
                        selectedCategory === subItem ? 'font-bold text-[#262626]' : ''
                      }`}
                    >
                      {subItem}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Shop by Color */}
      <div>
        <div
          onClick={() => setIsColorOpen(!isColorOpen)}
          className="flex items-center justify-between cursor-pointer mb-5"
        >
          <h3 className="text-xl font-bold text-[#262626]">Shop by Color</h3>
          <span className="text-[10px] text-[#767676]">{isColorOpen ? '▲' : '▼'}</span>
        </div>
        {isColorOpen && (
          <ul className="flex flex-col text-sm">
            {colorConfig.map((color) => (
              <li
                key={color.id}
                onClick={() => handleFilterChange(setSelectedColor, color.name)}
                className="border-b border-[#F0F0F0] py-4 flex items-center gap-3 cursor-pointer hover:text-[#262626] transition-colors"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span className={selectedColor === color.name ? 'font-bold text-[#262626]' : ''}>
                  {color.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 3. Shop by Brand */}
      <div>
        <div
          onClick={() => setIsBrandOpen(!isBrandOpen)}
          className="flex items-center justify-between cursor-pointer mb-5"
        >
          <h3 className="text-xl font-bold text-[#262626]">Shop by Brand</h3>
          <span className="text-[10px] text-[#767676]">{isBrandOpen ? '▲' : '▼'}</span>
        </div>
        {isBrandOpen && (
          <ul className="flex flex-col text-sm">
            {brandConfig.map((brand) => (
              <li
                key={brand.id}
                onClick={() => handleFilterChange(setSelectedBrand, brand.name)}
                className="border-b border-[#F0F0F0] py-4 cursor-pointer hover:text-[#262626] transition-colors"
              >
                <span className={selectedBrand === brand.name ? 'font-bold text-[#262626]' : ''}>
                  {brand.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 4. Shop by Price */}
      <div>
        <h3 className="text-xl font-bold text-[#262626] mb-5">Shop by Price</h3>
        <ul className="flex flex-col text-sm">
          {priceConfig.map((range) => (
            <li
              key={range.id}
              onClick={() => handleFilterChange(setSelectedPriceRange, range.id)}
              className="border-b border-[#F0F0F0] py-4 cursor-pointer hover:text-[#262626] transition-colors"
            >
              <span className={selectedPriceRange === range.id ? 'font-bold text-[#262626]' : ''}>
                {range.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Clear Active Filters Button */}
      {(selectedCategory || selectedColor || selectedBrand || selectedPriceRange) && (
        <button
          type="button"
          onClick={() => {
            setSelectedCategory(null)
            setSelectedColor(null)
            setSelectedBrand(null)
            setSelectedPriceRange(null)
            setCurrentPage(1)
          }}
          className="mt-2 w-full py-2.5 bg-[#262626] text-white text-xs font-bold hover:bg-black transition-colors"
        >
          Reset All Filters
        </button>
      )}
    </div>
  )

  return (
    <div className="w-full bg-white pb-24 font-sans text-[#767676]">
      <Container>
        {/* Page Title & Breadcrumb */}
        <div className="pt-10 sm:pt-14 sm:pb-12 pb-30">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#262626] mb-2 sm:mb-3">Products</h1>
          <div className="flex items-center gap-2 text-xs text-[#767676]">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="capitalize text-[#262626]">Products</span>
          </div>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 bg-[#262626] text-white px-4 py-2 text-sm font-semibold rounded-xs"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {mobileFilterOpen ? 'Close Filters' : 'Filters'}
          </button>
          <span className="text-xs text-[#767676]">{totalProducts} Items found</span>
        </div>

        {mobileFilterOpen && (
          <div className="lg:hidden p-6 mb-8 bg-[#f5f5f3] rounded-sm">
            <SidebarContent />
          </div>
        )}

        {/* Main Two-Column Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-10 xl:gap-14">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-[260px] xl:w-[280px] shrink-0">
            <SidebarContent />
          </aside>

          {/* Right Product Area */}
          <main className="flex-1 w-full">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4">
              {/* Grid / List View Buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsGridView(true)}
                  aria-label="Grid View"
                  className={`w-9 h-9 flex items-center justify-center cursor-pointer transition-colors ${
                    isGridView
                      ? 'bg-[#262626] text-white'
                      : 'border border-[#F0F0F0] text-[#767676] hover:text-[#262626]'
                  }`}
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="1" y="1" width="5.5" height="5.5" />
                    <rect x="9.5" y="1" width="5.5" height="5.5" />
                    <rect x="1" y="9.5" width="5.5" height="5.5" />
                    <rect x="9.5" y="9.5" width="5.5" height="5.5" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setIsGridView(false)}
                  aria-label="List View"
                  className={`w-9 h-9 flex items-center justify-center cursor-pointer transition-colors ${
                    !isGridView
                      ? 'bg-[#262626] text-white'
                      : 'border border-[#F0F0F0] text-[#767676] hover:text-[#262626]'
                  }`}
                >
                  <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12.4375V10.5625C4 10.2518 3.71219 10 3.35715 10H0.642854C0.287811 10 0 10.2518 0 10.5625V12.4375C0 12.7482 0.287811 13 0.642854 13H3.35712C3.71219 13 4 12.7482 4 12.4375V12.4375Z" fill="#737373"/>
                  <path d="M5.94141 0.5625V2.4375C5.94141 2.74816 6.58899 3 7.38784 3H13.495C14.2938 3 14.9414 2.74816 14.9414 2.4375V0.5625C14.9414 0.251836 14.2938 0 13.495 0H7.38784C6.58899 0 5.94141 0.251836 5.94141 0.5625H5.94141Z" fill="#737373"/>
                  <path d="M4 2.4375V0.5625C4 0.251836 3.71219 0 3.35715 0H0.642854C0.287811 0 0 0.251836 0 0.5625V2.4375C0 2.74816 0.287811 3 0.642854 3H3.35712C3.71219 3 4 2.74816 4 2.4375V2.4375Z" fill="#737373"/>
                  <path d="M4 7.4375V5.5625C4 5.25184 3.71219 5 3.35715 5H0.642854C0.287811 5 0 5.25184 0 5.5625V7.4375C0 7.74816 0.287811 8 0.642854 8H3.35712C3.71219 8 4 7.74816 4 7.4375V7.4375Z" fill="#737373"/>
                  <path d="M7.38784 8H13.495C14.2938 8 14.9414 7.74816 14.9414 7.4375V5.5625C14.9414 5.25184 14.2938 5 13.495 5H7.38784C6.58899 5 5.94141 5.25184 5.94141 5.5625V7.4375C5.94141 7.74816 6.58899 8 7.38784 8Z" fill="#737373"/>
                  <path d="M7.38784 13H13.495C14.2938 13 14.9414 12.7482 14.9414 12.4375V10.5625C14.9414 10.2518 14.2938 10 13.495 10H7.38784C6.58899 10 5.94141 10.2518 5.94141 10.5625V12.4375C5.94141 12.7482 6.58899 13 7.38784 13Z" fill="#737373"/>
                  </svg>
                </button>
              </div>

              {/* Sort By & Show Dropdowns */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-[#767676]">
                {/* 1. Sort By Dropdown */}
                <div className="flex items-center gap-3 relative" ref={sortRef}>
                  <span>Sort by:</span>
                  <div className="relative">
                    <div
                      onClick={() => {
                        setIsSortOpen(!isSortOpen)
                        setIsShowOpen(false)
                      }}
                      className="flex items-center justify-between w-48 sm:w-56 h-9 px-4 bg-white border border-[#EAEAEA] text-[#767676] text-sm cursor-pointer select-none"
                    >
                      <span className="truncate">{sortBy}</span>
                      <span className="text-[10px] text-[#767676] ml-2">▼</span>
                    </div>

                    {isSortOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#EAEAEA] shadow-md z-30 flex flex-col">
                        {['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest'].map((opt) => (
                          <div
                            key={opt}
                            onClick={() => {
                              setSortBy(opt)
                              setIsSortOpen(false)
                            }}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                              sortBy === opt
                                ? 'bg-[#1e60c6] text-white font-medium'
                                : 'text-[#262626] hover:bg-[#F5F5F3]'
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Show Dropdown */}
                <div className="flex items-center gap-3 relative" ref={showRef}>
                  <span>Show:</span>
                  <div className="relative">
                    <div
                      onClick={() => {
                        setIsShowOpen(!isShowOpen)
                        setIsSortOpen(false)
                      }}
                      className="flex items-center justify-between w-20 sm:w-24 h-9 px-4 bg-white border border-[#EAEAEA] text-[#767676] text-sm cursor-pointer select-none"
                    >
                      <span>{itemsPerPage}</span>
                      <span className="text-[10px] text-[#767676] ml-2">▼</span>
                    </div>

                    {isShowOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#EAEAEA] shadow-md z-30 flex flex-col">
                        {[12, 24, 36].map((num) => (
                          <div
                            key={num}
                            onClick={() => {
                              setItemsPerPage(num)
                              setCurrentPage(1)
                              setIsShowOpen(false)
                            }}
                            className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                              itemsPerPage === num
                                ? 'bg-[#1e60c6] text-white font-medium'
                                : 'text-[#262626] hover:bg-[#F5F5F3]'
                            }`}
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Rendering */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col gap-4">
                    <div className="w-full aspect-square bg-gray-200" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : currentItems.length === 0 ? (
              <div className="py-20 text-center text-lg text-gray-500">
                No products match the selected filters.
              </div>
            ) : isGridView ? (
              /* Grid View: 3 cards per row on desktop */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-10 justify-items-center">
                {currentItems.map((item) => (
                  <Card
                    id={item.id}
                    key={item.id}
                    image={item.image}
                    title={item.title}
                    price={item.price}
                    color={item.colorName}
                    badgeText={item.badgeText}
                    showBadge={!!item.badgeText}
                    className="w-full! max-w-[370px]"
                  >
                    {/* Hover Action Menu */}
                    <div className="absolute inset-x-0 bottom-0 z-20 bg-white/95 px-6 py-5 flex flex-col items-end gap-3 translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0">
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
                ))}
              </div>
            ) : (
              /* List View */
              <div className="flex flex-col gap-6">
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-[#F0F0F0] hover:shadow-md transition-shadow group"
                  >
                    <div className="relative w-48 h-48 bg-[#f5f5f3] flex items-center justify-center shrink-0 overflow-hidden">
                      {item.badgeText && (
                        <span className="absolute top-3 left-3 bg-[#262626] text-white text-[11px] font-bold px-4 py-1">
                          {item.badgeText}
                        </span>
                      )}
                      <img src={item.image} alt={item.title} className="w-3/4 h-3/4 object-contain" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-2 w-full text-left">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-bold text-[#262626] hover:text-black cursor-pointer">
                          {item.title}
                        </h4>
                        <span className="text-[#767676] font-normal text-base">
                          ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                        </span>
                      </div>
                      <p className="text-sm text-[#767676] mb-3 capitalize">{item.colorName}</p>
                      <p className="text-sm text-[#767676] line-clamp-2 mb-6">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          className="bg-[#262626] text-white px-6 py-2.5 text-xs font-bold hover:bg-black transition-colors"
                        >
                          Add to Cart
                        </button>
                        <button
                          type="button"
                          className="text-xs text-[#767676] hover:text-black font-semibold"
                        >
                          Add to Wish List
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dynamic Pagination Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-12 pb-16">
              {/* Page Number Buttons */}
              <div className="flex items-center gap-3 select-none">
                {getPaginationRange().map((item, index) => {
                  if (item === '...') {
                    return (
                      <span
                        key={`dots-${index}`}
                        className="w-6 flex items-center justify-center text-xs text-[#767676]"
                      >
                        ...
                      </span>
                    )
                  }

                  const isCurrent = validCurrentPage === item

                  return (
                    <button
                      key={`page-${item}`}
                      type="button"
                      onClick={() => handlePageSelect(item)}
                      className={`w-9 h-9 flex items-center justify-center text-xs cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-[#262626] text-white font-bold border border-[#262626]'
                          : 'bg-white border border-[#F0F0F0] text-[#767676] hover:border-[#262626] hover:text-[#262626]'
                      }`}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>

              {/* Exact Figma Status Text */}
              <p className="text-xs sm:text-sm text-[#767676]">
                Products from {totalProducts === 0 ? 0 : startIndex + 1} to {endIndex} of {totalProducts}
              </p>
            </div>
          </main>
        </div>
      </Container>
    </div>
  )
}

export default Products