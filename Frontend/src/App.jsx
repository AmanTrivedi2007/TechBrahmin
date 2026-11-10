import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Services from './pages/Services'
import Products from './pages/Products'
import Contact from './pages/Contact'
import Projects from './pages/Projects'

const LINKS = [['/', 'Home'], ['/services', 'Services'], ['/products', 'Products'], ['/projects', 'Projects'], ['/contact', 'Contact']]

function getInitialTheme() {
  try {
    const savedTheme = window.localStorage.getItem('tech-brahmin-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  } catch (error) {
    console.warn('Could not read the saved theme preference.', error)
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout({ children, theme, onThemeToggle }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <header className="nav">
        <div className="wrap bar">
          <Link to="/" className="logo">Tech<span>Brahmin</span></Link>
          <nav className={'links' + (open ? ' open' : '')} onClick={() => setOpen(false)}>
            {LINKS.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'}>{l}</NavLink>)}
          </nav>
          <div className="nav-actions">
            <button
              className="theme-toggle"
              type="button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              onClick={onThemeToggle}
            >
              <span className="theme-icon" aria-hidden="true">{theme === 'light' ? '◐' : '☼'}</span>
              <span className="theme-label">{theme === 'light' ? 'Dark' : 'Light'} mode</span>
            </button>
            <button className="menu" type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
          </div>
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
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem('tech-brahmin-theme', theme)
    } catch (error) {
      console.warn('Could not save the theme preference.', error)
    }
  }, [theme])

  return (
    <BrowserRouter>
      <ScrollTop />
      <Layout theme={theme} onThemeToggle={() => setTheme(current => current === 'light' ? 'dark' : 'light')}>
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
