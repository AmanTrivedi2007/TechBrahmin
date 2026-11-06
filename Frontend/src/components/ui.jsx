import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { STEPS } from '../data'

export const useTitle = t =>
  useEffect(() => {
    document.title = t ? `${t} · Tech Brahmin` : 'Tech Brahmin · Software Engineering & Products'
  }, [t])

export function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!('IntersectionObserver' in window)) { el.classList.add('in'); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('in'); io.disconnect() }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

export const Head = ({ k, t, p }) => (
  <Reveal className="head"><span className="kicker">{k}</span><h2>{t}</h2>{p && <p>{p}</p>}</Reveal>
)

export const Card = ({ icon, title, text, tag }) => (
  <Reveal className="card">
    {tag && <span className={`badge b-${tag[0]}`}>{tag[1]}</span>}
    <div className="ico">{icon}</div><h3>{title}</h3><p>{text}</p>
  </Reveal>
)

export const Steps = () => (
  <div className="grid">
    {STEPS.map(([n, t, d]) => (
      <Reveal className="card" key={n}><div className="ico">{n}</div><h3>{t}</h3><p>{d}</p></Reveal>
    ))}
  </div>
)

export const CTA = ({ t }) => (
  <Reveal className="cta"><h2>{t}</h2><Link className="btn" to="/contact">Talk to us</Link></Reveal>
)

export const Err = ({ s }) =>
  s === 'error' ? <p className="err" role="alert">Something went wrong. Please try again.</p>
  : s === 'limit' ? <p className="err" role="alert">Too many attempts. Please wait a minute.</p>
  : null
