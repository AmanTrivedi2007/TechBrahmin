import { useId } from 'react'

const W = [70, 120, 50, 100, 80, 130, 60, 110, 90, 45, 125, 75]

export function Laptop({ className = '', delay = 0 }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={`art ${className}`} style={{ animationDelay: `${delay}s` }} viewBox="0 0 240 145" aria-hidden="true">
      <defs><clipPath id={id}><rect x="38" y="18" width="164" height="94" rx="3" /></clipPath></defs>
      <rect x="30" y="10" width="180" height="108" rx="8" className="lp" />
      <rect x="38" y="18" width="164" height="94" rx="3" className="lp-screen" />
      <g clipPath={`url(#${id})`}>
        <g className="scroll">
          {[0, 1].map(k => (
            <g key={k} transform={`translate(0 ${k * 120})`}>
              {W.map((w, i) => (
                <rect key={i} x={46 + (i % 3) * 10} y={i * 10 + 6} width={w} height="4" rx="2" className={i % 4 === 0 ? 'ln acc' : 'ln'} />
              ))}
            </g>
          ))}
        </g>
      </g>
      <path d="M12 122h216l-14 18H26z" className="lp" />
    </svg>
  )
}

export function Chip({ className = '', delay = 0 }) {
  return (
    <svg className={`art ${className}`} style={{ animationDelay: `${delay}s` }} viewBox="0 0 100 100" aria-hidden="true">
      {[35, 50, 65].map(p => <path key={p} d={`M${p} 25V11M${p} 75v14M25 ${p}H11M75 ${p}h14`} className="pin" />)}
      <rect x="25" y="25" width="50" height="50" rx="8" className="lp" />
      <rect x="38" y="38" width="24" height="24" rx="4" className="core" />
    </svg>
  )
}

export const Scene = () => (
  <div className="scene" aria-hidden="true">
    <div className="orb" />
    <Laptop className="s1" />
    <Laptop className="s2" delay={-2} />
    <Laptop className="s3" delay={-4} />
    <Chip className="c1" delay={-1} />
    <Chip className="c2" delay={-3} />
  </div>
)
