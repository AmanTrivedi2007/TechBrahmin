import { useState } from 'react'
import { useSubmit } from '../api'
import { Card, Err, Head, Reveal, useTitle } from '../components/ui'
import { PHASES } from '../data'

function Waitlist() {
  const [email, setEmail] = useState('')
  const [trap, setTrap] = useState('')
  const [s, submit] = useSubmit('/api/subscribe')
  if (s === 'sent') return <p className="ok">You're on the list. Thank you! 🙏</p>
  return (
    <form className="inline" onSubmit={e => { e.preventDefault(); submit({ email: email.trim() }, trap) }}>
      <input type="email" required maxLength={200} placeholder="you@company.com" aria-label="Email"
        value={email} onChange={e => setEmail(e.target.value)} />
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={trap} onChange={e => setTrap(e.target.value)} />
      <button className="btn" disabled={s === 'sending'}>{s === 'sending' ? 'Sending…' : 'Notify me'}</button>
      <Err s={s} />
    </form>
  )
}

export default function Products() {
  useTitle('Products')
  return (
    <section className="wrap page">
      <Head k="Products" t="Software products, built in-house" p="We turn what we learn from client work into products of our own. Here's the path." />
      <div className="grid">{PHASES.map(([i, t, d, tag]) => <Card key={t} icon={i} title={t} text={d} tag={tag} />)}</div>
      <Reveal className="panel">
        <h3>Get early access</h3>
        <p>Be the first to hear when our products launch.</p>
        <Waitlist />
      </Reveal>
    </section>
  )
}
