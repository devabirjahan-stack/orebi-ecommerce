import React, { useState, useEffect, useRef } from 'react'
import Image from './Components/Image.jsx'
import LogoImage from './assets/Header/Logo.png'
import { Link, useNavigate } from 'react-router-dom'
import Container from './Components/Container.jsx'

const Header = () => {
  const navigate = useNavigate()

  // UI Dropdown States
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  // Search Engine States
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Click-outside References
  const categoryRef = useRef(null)
  const userRef = useRef(null)
  const searchRef = useRef(null)

  const header = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contacts', path: '/contact' },
  ]

  const categories = [
    'Accessories',
    'Furniture',
    'Electronics',
    'Clothes',
    'Bags',
    'Home appliances',
  ]

  // Handle outside clicks to close open menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false)
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropdownOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Live search query with 300ms debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(searchQuery.trim())}`)
        const data = await res.json()
        if (data?.products) {
          setSearchResults(data.products.slice(0, 8)) // Limit to top 8 preview items
          setShowSearchResults(true)
        }
      } catch (err) {
        console.error('Failed to execute search:', err)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Enter key submits search to Shop page
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setShowSearchResults(false)
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
  }

  const handleProductClick = (productId) => {
    setSearchQuery('')
    setShowSearchResults(false)
    navigate(`/product/${productId}`)
  }

  return (
    <header className="w-full font-sans">
      {/* 1. Top Navbar (White) */}
      <div className="bg-white py-6 relative">
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div>
              <Link to="/">
                <Image Source={LogoImage} Alt="Logo" />
              </Link>
            </div>

            {/* Desktop Menu Links */}
            <ul className="hidden md:flex items-center gap-10">
              {header.map((item) => (
                <li key={item.name} className="text-[#767676] text-sm hover:text-black active:text-black transition-colors">
                  <Link to={item.path}>{item.name}</Link>
                </li>
              ))}
            </ul>

            {/* Desktop Spacer to keep menu centered */}
            <div className="hidden md:block w-16"></div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[#262626] p-1 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Dropdown Nav */}
          {menuOpen && (
            <ul className="md:hidden flex flex-col gap-4 pt-6 pb-2 border-t border-gray-100 mt-4">
              {header.map((item) => (
                <li key={item.name} className="text-[#767676] text-sm hover:text-black active:text-black">
                  <Link to={item.path} onClick={() => setMenuOpen(false)}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </div>

      {/* 2. Category & Search Bar (Light Gray) */}
      <div className="bg-[#f5f5f3] py-4 lg:py-6 border-y border-gray-200">
        <Container>
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
            
            {/* Shop by Category with Dropdown */}
            <div className="relative order-1" ref={categoryRef}>
              <div
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <svg width="19" height="10" viewBox="0 0 19 10" fill="none">
                  <path d="M0.653061 2.93878H17.6327C17.9933 2.93878 18.2857 2.64641 18.2857 2.28571V0.653061C18.2857 0.292367 17.9933 0 17.6327 0H0.653061C0.292367 0 0 0.292367 0 0.653061V2.28571C0 2.64641 0.292367 2.93878 0.653061 2.93878Z" fill="#262626"/>
                  <path d="M0.5 9.46929H13.5C13.7762 9.46929 14 9.17693 14 8.81623V7.18358C14 6.82288 13.7762 6.53052 13.5 6.53052H0.5C0.223844 6.53052 0 6.82288 0 7.18358V8.81623C0 9.17693 0.223844 9.46929 0.5 9.46929Z" fill="#262626"/>
                </svg>
                <span className="text-sm font-normal text-[#262626]">Shop by Category</span>
              </div>

              {/* Exact Dark Category Dropdown Panel */}
              {categoryOpen && (
                <div className="absolute top-full left-0 mt-5 w-64 bg-[#262626] z-50 shadow-2xl flex flex-col py-1">
                  {categories.map((cat, idx) => (
                    <Link
                      key={cat}
                      to="/shop"
                      onClick={() => setCategoryOpen(false)}
                      className={`flex items-center justify-between px-6 py-4 text-sm text-[#767676] hover:text-white hover:font-bold hover:pl-8 transition-all duration-200 cursor-pointer ${
                        idx !== categories.length - 1 ? 'border-b border-[#2d2d2d]' : ''
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-xs text-[#767676]">›</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Interactive Live Search Input Box */}
            <div className="relative w-full lg:w-125 order-3 lg:order-2" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowSearchResults(true)
                  }}
                  placeholder="Search Products"
                  className="w-full bg-white px-5 py-3 text-sm outline-none placeholder:text-[#c4c4c4]"
                />
                
                {/* Search Icon / Clear Action */}
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="cursor-pointer absolute right-4 top-3.5 text-[#262626] hover:text-black"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.6409 10.6979L15.7505 13.8074C16.0405 14.1006 16.0405 14.5747 15.7474 14.8678L14.8647 15.7505C14.5747 16.0437 14.1006 16.0437 13.8074 15.7505L10.6979 12.6409C10.5575 12.5006 10.4795 12.3103 10.4795 12.1107V11.6023C9.37856 12.4632 7.99376 12.9747 6.48733 12.9747C2.9037 12.9747 0 10.071 0 6.48733C0 2.9037 2.9037 0 6.48733 0C10.071 0 12.9747 2.9037 12.9747 6.48733C12.9747 7.99376 12.4632 9.37856 11.6023 10.4795H12.1107C12.3103 10.4795 12.5006 10.5575 12.6409 10.6979ZM2.49513 6.48733C2.49513 8.69552 4.28226 10.4795 6.48733 10.4795C8.69552 10.4795 10.4795 8.6924 10.4795 6.48733C10.4795 4.27914 8.6924 2.49513 6.48733 2.49513C4.27914 2.49513 2.49513 4.28226 2.49513 6.48733Z"
                    />
                  </svg>
                </button>
              </form>

              {/* Live Search Results Popup Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 mt-2 w-full max-h-96 bg-white border border-[#F0F0F0] shadow-2xl z-50 overflow-y-auto divide-y divide-[#F0F0F0]">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-[#767676]">Searching catalog...</div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="flex items-center gap-4 p-3 hover:bg-[#F5F5F3] cursor-pointer transition-colors"
                        >
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-12 h-12 object-contain bg-[#F5F5F3] p-1 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-[#262626] truncate">{product.title}</h4>
                            <p className="text-xs text-[#767676] capitalize">{product.category}</p>
                          </div>
                          <span className="text-sm font-bold text-[#262626] shrink-0">
                            ${Number(product.price).toFixed(2)}
                          </span>
                        </div>
                      ))}

                      {/* View All Matches Footer */}
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full py-3 text-center text-xs font-bold bg-[#262626] text-white hover:bg-black transition-colors cursor-pointer"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </>
                  ) : (
                    <div className="p-4 text-center text-xs text-[#767676]">
                      No products match "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Dropdown & Cart Icons */}
            <div className="flex items-center gap-6 cursor-pointer order-2 lg:order-3">
              
              {/* User Dropdown */}
              <div className="relative" ref={userRef}>
                <div
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 select-none"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#262626]">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span className="text-[10px] text-[#262626]">▼</span>
                </div>

                {/* User Dropdown Panel */}
                {userDropdownOpen && (
                  <div className="absolute top-full right-0 mt-5 w-48 bg-white border border-[#F0F0F0] shadow-xl z-50 flex flex-col overflow-hidden">
                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="bg-[#262626] text-white font-bold text-sm text-center py-4 hover:bg-black transition-colors block"
                    >
                      My Account
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false)
                        console.log('Logged out')
                      }}
                      className="bg-white text-[#262626] text-sm text-center py-4 hover:bg-[#F5F5F3] transition-colors block cursor-pointer border-t border-[#F0F0F0]"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Icon */}
              <div>
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.8966 9.0698L17.3195 2.80893C17.4223 2.35689 17.0787 1.92642 16.6151 1.92642H4.79221L4.51631 0.577625C4.44757 0.241435 4.15174 0 3.80857 0H0.722408C0.323428 0 0 0.323428 0 0.722408V1.20401C0 1.60299 0.323428 1.92642 0.722408 1.92642H2.82591L4.9404 12.2639C4.43453 12.5548 4.09365 13.1003 4.09365 13.7258C4.09365 14.6567 4.84832 15.4114 5.77926 15.4114C6.71021 15.4114 7.46488 14.6567 7.46488 13.7258C7.46488 13.254 7.27083 12.8277 6.95848 12.5217H13.2689C12.9566 12.8277 12.7625 13.254 12.7625 13.7258C12.7625 14.6567 13.5172 15.4114 14.4482 15.4114C15.3791 15.4114 16.1338 14.6567 16.1338 13.7258C16.1338 13.0584 15.7458 12.4816 15.1832 12.2085L15.3493 11.4778C15.452 11.0258 15.1084 10.5953 14.6449 10.5953H6.56539L6.36839 9.63211H15.1922C15.5295 9.63211 15.8218 9.39871 15.8966 9.0698Z" fill="#262626"/>
                </svg>
              </div>

            </div>
          </div>
        </Container>
      </div>
    </header>
  )
}

export default Header