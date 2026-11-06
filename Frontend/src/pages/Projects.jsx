import { useEffect, useState } from 'react'
import { Head, useTitle } from '../components/ui'

const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

const STATUS_STYLES = {
  O: { label: 'Ongoing', background: '#fef3c7', color: '#854d0e', dot: '#d97706' },
  C: { label: 'Completed', background: '#dcfce7', color: '#166534', dot: '#16a34a' },
}

function displayText(value, fallback) {
  return typeof value === 'string' && value.trim() ? value : fallback
}

export default function Projects() {
  useTitle('Projects')
  const [selectedType, setSelectedType] = useState('all')
  const [types, setTypes] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, 10000)

    async function loadProjects() {
      try {
        if (!API) throw new Error('Project API URL is not configured.')

        const response = await fetch(
          `${API}/api/projects?type=${encodeURIComponent(selectedType)}`,
          {
            signal: controller.signal,
          },
        )
        if (!response.ok) {
          throw new Error(`Could not load projects (HTTP ${response.status}).`)
        }

        const data = await response.json()
        if (!Array.isArray(data.projects) || !Array.isArray(data.types)) {
          throw new Error('The project API returned an invalid response.')
        }
        if (!active) return
        setTypes(data.types.filter(type => typeof type === 'string' && type.trim() && type.toLowerCase() !== 'all'))
        setProjects(data.projects)
      } catch (err) {
        if (!active) return
        if (timedOut) {
          setError('The project request timed out. Please try again.')
        } else if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Could not load projects.')
        }
      } finally {
        clearTimeout(timer)
        if (active) setLoading(false)
      }
    }

    loadProjects()
    return () => {
      active = false
      clearTimeout(timer)
      controller.abort()
    }
  }, [selectedType])

  function selectType(type) {
    if (selectedType.toLowerCase() !== type.toLowerCase()) {
      setLoading(true)
      setError('')
      setSelectedType(type)
    }
  }

  return (
    <section className="wrap page">
      <Head
        k="Projects"
        t="Projects we've built"
        p="Browse projects by name, type, description and current status."
      />

      <nav aria-label="Filter projects by type" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {['all', ...types].map(type => (
          <button
            key={type}
            type="button"
            className={`btn${selectedType.toLowerCase() === type.toLowerCase() ? '' : ' ghost'}`}
            aria-pressed={selectedType.toLowerCase() === type.toLowerCase()}
            onClick={() => selectType(type)}
          >
            {type === 'all' ? 'All' : type}
          </button>
        ))}
      </nav>

      {loading && <p role="status">Loading projects…</p>}
      {!loading && error && <p className="err" role="alert">{error}</p>}
      {!loading && !error && projects.length === 0 && <p>No projects found.</p>}

      {!loading && !error && projects.length > 0 && (
        <div className="grid">
          {projects.map((project, index) => {
            const projectStatus = project.status ?? project['"status"']
            const code = typeof projectStatus === 'string' ? projectStatus.toUpperCase() : ''
            const status = STATUS_STYLES[code] || STATUS_STYLES.O

            return (
              <article className="card" key={project._id || `${project.name || 'project'}-${index}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <span className="kicker">{displayText(project.type, 'Uncategorized')}</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: status.background,
                      color: status.color,
                      fontSize: '.8rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: status.dot }} />
                    {status.label}
                  </span>
                </div>
                <h3>{displayText(project.name, 'Untitled project')}</h3>
                <p>{displayText(project.description, 'No description available.')}</p>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
