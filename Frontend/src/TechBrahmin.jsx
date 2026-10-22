import { useEffect, useRef, useState } from 'react'
import './techbrahmin.css'

const PROJECTS = [
  { type: 'AI', name: 'Project One', text: 'An AI tool that saves hours of manual work.' },
  { type: 'Web', name: 'Project Two', text: 'A fast web platform for growing businesses.' },
  { type: 'Mobile', name: 'Project Three', text: 'A mobile app people open every day.' },
  { type: 'AI', name: 'Project Four', text: 'Smart automation for everyday tasks.' },
  { type: 'Web', name: 'Project Five', text: 'A dashboard that makes data simple.' },
]
const STEPS = [['01','Understand','We listen to your problem first.'],['02','Build','We design and code it carefully.'],['03','Launch','We ship it and keep improving.']]
const VALUES = [['Jnana','Knowledge','We learn deeply before we build.'],['Karma','Craft','Clean code, careful work.'],['Seva','Service','Software that truly helps people.']]
const LINES = ['$ namaste --world', '$ build --smart --software', '$ deploy --with-purpose']
const API = import.meta.env.VITE_API_URL

function Mandala() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d')
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let w, H, t = 0, raf, m = { x: 0, y: 0, on: false }
    const resize = () => {
      const d = devicePixelRatio || 1
      w = c.clientWidth; H = c.clientHeight
      c.width = w * d; c.height = H * d
      x.setTransform(d, 0, 0, d, 0, 0)
    }
    const move = e => { const r = c.getBoundingClientRect(); m = { x: e.clientX - r.left, y: e.clientY - r.top, on: true } }
    const leave = () => (m.on = false)
    resize()
    addEventListener('resize', resize)
    c.addEventListener('pointermove', move)
    c.addEventListener('pointerleave', leave)
    const draw = () => {
      const s = getComputedStyle(c), acc = s.getPropertyValue('--acc'), line = s.getPropertyValue('--line')
      if (!still) t += 0.0008
      x.clearRect(0, 0, w, H)
      const cx = w / 2, cy = H / 2, u = Math.min(w, H) / 2 / 6.3
      let prev = null
      for (let i = 1; i <= 6; i++) {
        const n = i * 6, r = i * u
        const pts = Array.from({ length: n }, (_, k) => {
          const a = (k / n) * Math.PI * 2 + t * (i % 2 ? 1 : -1) * (1 + i * 0.15)
          return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
        })
        x.strokeStyle = line; x.lineWidth = 1
        x.beginPath(); pts.forEach((p, k) => (k ? x.lineTo(...p) : x.moveTo(...p))); x.closePath(); x.stroke()
        if (prev) {
          x.beginPath()
          pts.forEach((p, k) => { x.moveTo(...p); x.lineTo(...prev[Math.floor((k * prev.length) / n)]) })
          x.stroke()
        }
        pts.forEach(p => {
          const g = m.on ? Math.max(0, 1 - Math.hypot(p[0] - m.x, p[1] - m.y) / 110) : 0
          x.fillStyle = acc; x.globalAlpha = 0.4 + g * 0.3
          x.beginPath(); x.arc(p[0], p[1], 2 + g * 2, 0, Math.PI * 2); x.fill()
        })
        x.globalAlpha = 1; prev = pts
      }
      x.fillStyle = acc; x.beginPath(); x.arc(cx, cy, 5, 0, Math.PI * 2); x.fill()
      if (!still) raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      c.removeEventListener('pointermove', move)
      c.removeEventListener('pointerleave', leave)
    }
  }, [])
  return <canvas ref={ref} className="tb-mandala" />
}

function Typewriter() {
  const [i, setI] = useState(0), [n, setN] = useState(0)
  useEffect(() => {
    const done = n >= LINES[i].length
    const id = setTimeout(() => {
      if (!done) setN(n + 1)
      else { setN(0); setI((i + 1) % LINES.length) }
    }, done ? 1400 : 70)
    return () => clearTimeout(id)
  }, [n, i])
  return <div className="tb-term">{LINES[i].slice(0, n)}</div>
}

const Cards = ({ items }) => (
  <div className="tb-grid">
    {items.map(([tag, title, text]) => (
      <div className="tb-card" key={title}><div className="tb-tag">{tag}</div><h3>{title}</h3><p>{text}</p></div>
    ))}
  </div>
)

function Home({ go }) {
  return (
    <>
      <div className="tb-hero tb-fade">
        <div>
          <h1>Ancient wisdom. <em>Modern code.</em></h1>
          <p>Tech Brahmin builds smart software that solves real problems.</p>
          <Typewriter />
          <button className="tb-btn" onClick={() => go('Projects')}>View our projects</button>
        </div>
        <Mandala />
      </div>
      <div className="tb-fade"><h2>How we work</h2><Cards items={STEPS} /></div>
    </>
  )
}



function Projects() {
  const [f, setF] = useState('All')
  const [types, setTypes] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchProjects() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `${API}/api/projects?type=${encodeURIComponent(f)}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch projects.')
        }

        const data = await response.json()

        if (data.success === false) {
          throw new Error(data.message || 'Failed to fetch projects.')
        }

        setTypes(data.types || [])
        setProjects(data.projects || [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to fetch projects.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchProjects()
    return () => controller.abort()
  }, [f])

  return (
    <div className="tb-fade">
      <h2>What we build</h2>

      <div className="tb-chips">
        {['All', ...types].map(category => (
          <button
            key={category}
            className={'tb-chip' + (
              f.toLowerCase() === category.toLowerCase() ? ' on' : ''
            )}
            onClick={() => setF(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading && <p>Loading projects...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p>No projects found.</p>
      )}

      {!loading && !error && (
        
        <div className="tb-grid">
          {projects.map(p => (
            <div className="tb-card" key={p._id}>
              <div className="tb-card-top">
                <span className="tb-tag">{p.type}</span>

                <span className={`tb-status status-${p.status || 'O'}`}>
                  {{
                    O: 'Ongoing',
                    C: 'Completed',
                    D: 'Deployed'
                  }[p.status] || 'Ongoing'}
                </span>
              </div>

              <h3>{p.name}</h3>
              <p>{p.description}</p>

              {p.link && (
                <a
                  className="tb-project-link"
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View project <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



const About = () => (
  <div className="tb-fade">
    <h2>About us</h2>
    <p>We are a startup that blends deep knowledge with modern technology.</p>
    <Cards items={VALUES.map(([n, t, d]) => [t, n, d])} />
  </div>
)

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', mobile_number: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')
  const set = k => e => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setStatus('sending')
    setFeedback('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus('error')
      setFeedback('Please enter a valid email address.')
      return
    }
    if (!/^[6-9]\d{9}$/.test(form.mobile_number.trim())) {
      setStatus('error')
      setFeedback('Please enter a valid 10-digit Indian mobile number.')
      return
    }

    try {
      if (!API) throw new Error('API URL is not configured.')
      const r = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, email: form.email.trim(), mobile_number: form.mobile_number.trim() })
      })
      const data = await r.json().catch(() => ({}))
      if (!r.message || data.success === false) {
        throw new Error(data.message || data.detail || 'Unable to save your inquiry.')
      }
      setFeedback(data.message || 'Inquiry saved.')
      setStatus('sent')
    } catch (err) {
      setFeedback(err.message || 'Unable to connect to the server. Please try again.')
      setStatus('error')
    }
  }

  return (
    <form className="tb-fade tb-form" onSubmit={submit}>
      <h2>Contact us</h2>
      <input required placeholder="Your name" value={form.name} onChange={set('name')} />
      <input required type="email" placeholder="Email" value={form.email} onChange={set('email')} />
      <input required type="tel" inputMode="numeric" autoComplete="tel" maxLength={10}
        placeholder="Mobile number" value={form.mobile_number}
        onChange={e => setForm({ ...form, mobile_number: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
      <textarea required rows={4} placeholder="Tell us about your idea" value={form.message} onChange={set('message')} />
      <button className="tb-btn" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {feedback && <p role="status">{feedback}</p>}
    </form>
  )
}

const PAGES = { Home, Projects, About, Contact }

export default function TechBrahmin() {
  const [page, setPage] = useState('Home')
  const [theme, setTheme] = useState(() => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  const Page = PAGES[page]
  return (
    <div className="tb" data-theme={theme}>
      <div className="tb-wrap">
        <nav className="tb-nav">
          <div className="tb-logo">Tech<span>Brahmin</span></div>
          <div>
            {Object.keys(PAGES).map(p => (
              <button key={p} className={page === p ? 'on' : ''} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">{theme === 'dark' ? '☀' : '☾'}</button>
          </div>
        </nav>
        <Page go={setPage} />
        <footer className="tb-foot">© Tech Brahmin · contact@techbrahmin.com</footer>
      </div>
    </div>
  )
}