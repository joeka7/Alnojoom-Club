import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import ScrollToTop from './components/routing/ScrollToTop'
import ScrollToHash from './components/routing/ScrollToHash'
import Nav from './components/layout/Nav'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ForWomen from './pages/ForWomen'
import ForMen from './pages/ForMen'
import Contact from './pages/Contact'

function Layout() {
  const { pathname } = useLocation()
  const active = pathname === '/' ? 'home'
    : pathname.startsWith('/about') ? 'about'
    : pathname.startsWith('/services') ? 'services'
    : pathname.startsWith('/contact') ? 'contact'
    : 'home'

  return (
    <>
      <Nav active={active} />
      <Routes>
        <Route path="/"         element={<Home />} />
        {/* /about-us is the canonical About path (it is what the footer links
            to); /about stays mounted so the nav's existing links and any
            external inbound links keep working. `active` above already matches
            both via startsWith('/about'). */}
        <Route path="/about-us"  element={<About />} />
        <Route path="/about"     element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/for-women" element={<ForWomen />} />
        <Route path="/services/for-men"   element={<ForMen />} />
        <Route path="/contact"  element={<Contact />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollToHash />
      <Layout />
    </BrowserRouter>
  )
}
