import React from 'react'
import Header from './Header.jsx'
import Image from './Components/Image.jsx'
import Container from './Components/Container.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.jsx'
import Shop from './Pages/Shop.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import ProductDetails from './Pages/ProductDetails.jsx'
import Logo from './assets/Header/Logo.png'
import Facebook from './assets/Footer/Facebook.png'
import Instagram from './assets/Footer/Instagram.png'
import LinkedIn from './assets/Footer/Linkedin.png'
const App = () => {
  const sections = [
    { title: 'MENU', links: ['Home', 'Shop', 'About', 'Contact', 'Journal'] },
    { title: 'SHOP', links: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'] },
    { title: 'HELP', links: ['Privacy Policy', 'Terms & Conditions', 'Special E-shop', 'Shipping', 'Secure Payments'] },
  ]
  return (
   <BrowserRouter>
        <Header />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
      <footer className="w-full bg-[#f5f5f3] py-14 text-sm text-[#767676]">
      <Container>
        {/* Preserves your exact desktop layout untouched */}
        {/* Desktop: Your exact untouched setup */}
{/* Desktop: Your exact setup */}
<div className="hidden lg:grid grid-cols-3 pb-16 items-start">
  <div className="col-span-3 flex items-start">
    {/* 1. Menus */}
    <div className="flex gap-x-35">
      {sections.map(({ title, links }) => (
        <div key={title} className="flex flex-col gap-4">
          <h4 className="font-bold text-[#262626] text-base leading-none tracking-wide">{title}</h4>
          <ul className="flex flex-col gap-2.5">
            {links.map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-[#262626] transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* 2. Contact Details */}
    <div className="flex flex-col justify-start text-left ml-[145px] shrink-0">
      <h4 className="font-bold text-[#262626] text-base leading-6">(052) 611-5711</h4>
      <a href="mailto:company@domain.com" className="font-bold text-[#262626] text-base leading-6 hover:underline">
        company@domain.com
      </a>
      <p className="text-sm text-[#767676] mt-4 leading-relaxed">
        575 Crescent Ave. Quakertown, PA 18951
      </p>
    </div>

    {/* 3. Logo (now sits right next to the contact info at exact Figma gap) */}
    <div className="ml-72 shrink-0">
      <a href="/">
        <Image Source={Logo} Alt="Orebi Logo" ClassName="h-7 w-auto object-contain" />
      </a>
    </div>
  </div>
</div>

{/* Mobile & Tablet Only: Simple clean vertical stack */}
<div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pb-12 lg:hidden">
  {sections.map(({ title, links }) => (
    <div key={title} className="flex flex-col gap-3">
      <h4 className="font-bold text-[#262626] text-sm tracking-wide">{title}</h4>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="hover:text-[#262626] text-xs">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  ))}
  <div className="col-span-2 sm:col-span-1 flex flex-col gap-1">
    <h4 className="font-bold text-[#262626] text-sm">(052) 611-5711</h4>
    <a href="mailto:company@domain.com" className="font-bold text-[#262626] text-xs hover:underline">
      company@domain.com
    </a>
    <p className="text-xs text-[#767676] mt-2">575 Crescent Ave. Quakertown, PA 18951</p>
  </div>
  {/* Column 3: Logo aligned to start of column 3, not shoved to the screen edge */}
  <div className="col-span-1 flex justify-start">
    <a href="/">
      <Image Source={Logo} Alt="Orebi Logo" ClassName="h-7 w-auto object-contain" />
    </a>
  </div>
</div>

        {/* Bottom Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 pt-8">
          <div className="flex items-center gap-6 text-[#262626]">
            <a href="#" aria-label="Facebook" className="hover:opacity-75 transition-opacity">
              <Image Source={Facebook} Alt="Facebook" ClassName="w-4 h-4 object-contain" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:opacity-75 transition-opacity">
              <Image Source={LinkedIn} Alt="LinkedIn" ClassName="w-4 h-4 object-contain" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:opacity-75 transition-opacity">
              <Image Source={Instagram} Alt="Instagram" ClassName="w-4 h-4 object-contain" />
            </a>
          </div>
          <p className="text-xs text-[#767676] sm:text-right">
            2020 Orebi Minimal eCommerce Figma Template by Adveits
          </p>
        </div>
      </Container>
    </footer>
    </BrowserRouter>
  )
}

export default App

