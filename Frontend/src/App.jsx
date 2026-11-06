import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Services from './pages/Services'
import Products from './pages/Products'
import Contact from './pages/Contact'
import Projects from './pages/Projects'

const LINKS = [['/', 'Home'], ['/services', 'Services'], ['/products', 'Products'], ['/projects', 'Projects'], ['/contact', 'Contact']]

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <header className="nav">
        <div className="wrap bar">
          <Link to="/" className="logo">Tech<span>Brahmin</span></Link>
          <button className="menu" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
          <nav className={'links' + (open ? ' open' : '')} onClick={() => setOpen(false)}>
            {LINKS.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'}>{l}</NavLink>)}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="foot">
        <div className="wrap">
          <span className="logo">Tech<span>Brahmin</span></span>
          <p>Software engineering today. Products tomorrow.</p>
          <p>© {new Date().getFullYear()} Tech Brahmin</p>
        </div>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
