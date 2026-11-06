import { Card, CTA, Head, Reveal, Steps, useTitle } from '../components/ui'
import { MODELS, SERVICES, WHO } from '../data'

export default function Services() {
  useTitle('Services')
  return (
    <>
      <section className="wrap page">
        <Head k="Services" t="Engineering support for teams that ship" p="We extend your team or build under your brand, whichever fits." />
        <div className="grid">{SERVICES.map(([i, t, d]) => <Card key={t} icon={i} title={t} text={d} />)}</div>
        <Reveal className="chips">{WHO.map(w => <span key={w}>{w}</span>)}</Reveal>
      </section>

      <section className="wrap">
        <Head k="How we collaborate" t="From first call to launch" />
        <Steps />
      </section>

      <section className="wrap">
        <Head k="Engagement models" t="Pick what fits you" />
        <div className="grid">{MODELS.map(([t, d]) => <Card key={t} icon="◆" title={t} text={d} />)}</div>
      </section>

      <section className="wrap"><CTA t="Tell us what you're building." /></section>
    </>
  )
}
