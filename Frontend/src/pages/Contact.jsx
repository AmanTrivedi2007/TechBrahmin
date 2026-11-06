import { useState } from 'react'
import { useSubmit } from '../api'
import { Err, Head, useTitle } from '../components/ui'
import { SERVICES } from '../data'

const EMPTY = { name: '', email: '', mobile_number: '', company: '', service: '', message: '', website: '' }

export default function Contact() {
  useTitle('Contact')
  const [f, setF] = useState(EMPTY)
  const [s, submit] = useSubmit('/api/contact')
  const set = k => e => setF({ ...f, [k]: e.target.value })

  const onSubmit = e => {
    e.preventDefault()
    const { website, ...data } = f
    submit(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.trim()])), website)
  }

  return (
    <section className="wrap page">
      <Head k="Contact" t="Tell us what you're building" p="Share a few details and we'll get back to you soon." />
      {s === 'sent' ? (
        <p className="ok">Thank you! We've received your message. 🙏</p>
      ) : (
        <form className="form" onSubmit={onSubmit}>
          <input required maxLength={100} placeholder="Your name" aria-label="Name" value={f.name} onChange={set('name')} />
          <input required type="email" maxLength={200} placeholder="Work email" aria-label="Email" value={f.email} onChange={set('email')} />
          <input type="tel" maxLength={10} minLength={10} pattern="[0-9+\-\s()]*" placeholder="Phone" aria-label="Phone" value={f.mobile_number} onChange={set('mobile_number')} required/>
          <input maxLength={120} placeholder="Company (optional)" aria-label="Company" value={f.company} onChange={set('company')} />
          <select aria-label="Service" value={f.service} onChange={set('service')}>
            <option value="">What do you need? (optional)</option>
            {SERVICES.map(([, t]) => <option key={t}>{t}</option>)}
            <option>Something else</option>
          </select>
          <textarea required rows={5} maxLength={2000} placeholder="Tell us about your project" aria-label="Message" value={f.message} onChange={set('message')} />
          <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set('website')} />
          <button className="btn" disabled={s === 'sending'}>{s === 'sending' ? 'Sending…' : 'Send message'}</button>
          <Err s={s} />
        </form>
      )}
    </section>
  )
}
