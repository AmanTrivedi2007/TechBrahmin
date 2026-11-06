import { useState } from 'react'

const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

async function post(path, body) {
  if (!API) throw new Error('config')
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 10000)
  try {
    const r = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    })
    if (!r.ok) throw new Error(String(r.status))
  } finally {
    clearTimeout(timer)
  }
}

// trap = honeypot value; if a bot filled it, pretend success and send nothing
export function useSubmit(path) {
  const [status, setStatus] = useState('idle')
  const submit = async (data, trap = '') => {
    if (trap) return setStatus('sent')
    setStatus('sending')
    try {
      await post(path, data)
      setStatus('sent')
    } catch (e) {
      setStatus(e.message === '429' ? 'limit' : 'error')
    }
  }
  return [status, submit]
}
