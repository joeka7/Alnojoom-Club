import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
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
        <Route path="/about"    element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact"  element={<Contact />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
