import { Link } from 'react-router-dom'
import { Scene } from '../components/Art'
import { Card, CTA, Head, Steps, useTitle } from '../components/ui'
import { PHASES, PILLARS, SERVICES } from '../data'

export default function Home() {
  useTitle('')
  return (
    <>
      <section className="hero wrap">
        <div>
          <span className="pill">Software · Engineering · Products</span>
          <h1>We build what your <em>technology</em> needs next.</h1>
          <p className="lead">Tech Brahmin partners with agencies and software companies to design, build and scale their products, and is building products of its own.</p>
          <div className="row">
            <Link className="btn" to="/contact">Start a project</Link>
            <Link className="btn ghost" to="/services">Explore services</Link>
          </div>
        </div>
        <Scene />
      </section>

      <section className="wrap">
        <Head k="Who we are" t="An engineering-first technology company" />
        <div className="grid">{PILLARS.map(([t, d]) => <Card key={t} icon="●" title={t} text={d} />)}</div>
      </section>

      <section className="wrap">
        <Head k="What we do" t="Software support and solutions for B2B" />
        <div className="grid">{SERVICES.slice(0, 3).map(([i, t, d]) => <Card key={t} icon={i} title={t} text={d} />)}</div>
        <p className="more"><Link to="/services">See all services →</Link></p>
      </section>

      <section className="wrap">
        <Head k="How we collaborate" t="Simple, Transparent, Fast" />
        <Steps />
      </section>

      <section className="wrap">
        <Head k="Where we're going" t="Services today. Products next." />
        <div className="grid">{PHASES.map(([i, t, d, tag]) => <Card key={t} icon={i} title={t} text={d} tag={tag} />)}</div>
      </section>

      <section className="wrap"><CTA t="Have something to build? Let's talk." /></section>
    </>
  )
}
