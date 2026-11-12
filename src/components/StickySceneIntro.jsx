import { useEffect, useRef, useState } from 'react'

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const range = (p, a, b) => clamp((p - a) / (b - a), 0, 1)

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    if (mq.addEventListener) mq.addEventListener('change', update)
    else if (mq.addListener) mq.addListener(update)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update)
      else if (mq.removeListener) mq.removeListener(update)
    }
  }, [])
  return reduced
}

function Scene({ label, children, opacity, scale, reduced }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity,
        transform: `scale(${scale})`,
        willChange: reduced ? 'auto' : 'transform, opacity',
      }}
      aria-hidden={opacity < 0.5}
    >
      <div className="absolute inset-0">
        {children}
      </div>
      <div className="absolute top-8 left-6 md:top-12 md:left-12 z-10">
        <p className="font-mono text-xs md:text-sm tracking-[0.25em] text-white/70">{label}</p>
      </div>
    </div>
  )
}

function ArchitectureScene({ reduced }) {
  const hLines = Array.from({ length: 18 }, (_, i) => 80 + i * 48)
  const vLines = Array.from({ length: 26 }, (_, i) => -200 + i * 80)
  const beams = [
    { y: 220, w: 420, dur: 5.5, delay: 0 },
    { y: 360, w: 360, dur: 6.8, delay: 1.2 },
    { y: 520, w: 500, dur: 7.2, delay: 0.6 },
    { y: 660, w: 320, dur: 6.2, delay: 2.0 },
  ]
  const vBeams = [
    { x: 260, h: 260, dur: 6.5, delay: 0.4 },
    { x: 620, h: 320, dur: 7.4, delay: 1.6 },
    { x: 980, h: 280, dur: 6.9, delay: 0.9 },
    { x: 1240, h: 340, dur: 7.8, delay: 2.2 },
  ]
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" role="img" aria-label="Web and AI architecture visualization">
      <defs>
        <linearGradient id="archFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#160D11" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#160D11" stopOpacity="0" />
          <stop offset="100%" stopColor="#160D11" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="beamH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E11D48" stopOpacity="0" />
          <stop offset="50%" stopColor="#E11D48" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beamV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E11D48" stopOpacity="0" />
          <stop offset="50%" stopColor="#E11D48" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1440" height="900" fill="#160D11" />
      <g stroke="#E11D48" strokeOpacity="0.16">
        {hLines.map((y, i) => (
          <line key={`h-${i}`} x1="-200" y1={y} x2="1640" y2={y + 120} strokeWidth="1" />
        ))}
        {vLines.map((x, i) => (
          <line key={`v-${i}`} x1={x} y1="0" x2={x + 260} y2="900" strokeWidth="1" />
        ))}
      </g>
      <g>
        {beams.map((b, i) => (
          <rect key={`bh-${i}`} x="-500" y={b.y} width={b.w} height="3" rx="1.5" fill="url(#beamH)" opacity="0.9">
            {!reduced && (
              <animate attributeName="x" values="-500;1600;-500" dur={`${b.dur}s`} begin={`${b.delay}s`} repeatCount="indefinite" />
            )}
            {reduced && <animate attributeName="x" values="500;500" dur="1s" />}
          </rect>
        ))}
        {vBeams.map((b, i) => (
          <rect key={`bv-${i}`} x={b.x} y="-400" width="3" height={b.h} rx="1.5" fill="url(#beamV)" opacity="0.8">
            {!reduced && (
              <animate attributeName="y" values="-400;1000;-400" dur={`${b.dur}s`} begin={`${b.delay}s`} repeatCount="indefinite" />
            )}
            {reduced && <animate attributeName="y" values="300;300" dur="1s" />}
          </rect>
        ))}
      </g>
      <g stroke="#E11D48" strokeOpacity="0.35" strokeWidth="2">
        <line x1="0" y1="760" x2="1440" y2="760" />
        <line x1="120" y1="0" x2="120" y2="900" strokeOpacity="0.18" />
        <line x1="1320" y1="0" x2="1320" y2="900" strokeOpacity="0.18" />
      </g>
      <rect width="1440" height="900" fill="url(#archFade)" />
    </svg>
  )
}

function SecurityScene({ reduced }) {
  const rows = Array.from({ length: 16 }, (_, i) => i)
  const bars = Array.from({ length: 24 }, (_, i) => i)
  const hex = (i) => ((i * 2654435761) >>> 0).toString(16).slice(0, 4).toUpperCase()
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" role="img" aria-label="Ethical hacking and AppSec visualization">
      <defs>
        <linearGradient id="scan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E11D48" stopOpacity="0" />
          <stop offset="45%" stopColor="#E11D48" stopOpacity="0.05" />
          <stop offset="50%" stopColor="#E11D48" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#E11D48" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="secFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#160D11" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#160D11" stopOpacity="0" />
          <stop offset="100%" stopColor="#160D11" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect width="1440" height="900" fill="#160D11" />
      <g opacity="0.18" stroke="#E11D48">
        {Array.from({ length: 30 }, (_, i) => (
          <line key={i} x1={i * 48} y1="0" x2={i * 48} y2="900" strokeWidth="1" />
        ))}
        {Array.from({ length: 20 }, (_, i) => (
          <line key={`h-${i}`} x1="0" y1={i * 48} x2="1440" y2={i * 48} strokeWidth="1" />
        ))}
      </g>
      <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="14" fill="#E11D48">
        {rows.map((r) => (
          <g key={r} opacity={0.18 + (r % 4) * 0.08}>
            <text x="40" y={70 + r * 52}>
              {bars.map((b) => hex(r * 31 + b)).join('  ')}
            </text>
            {!reduced && (
              <animate attributeName="opacity" values={`${0.12 + (r % 3) * 0.08};${0.3 + (r % 3) * 0.1};${0.12 + (r % 3) * 0.08}`} dur={`${4 + (r % 5) * 0.7}s`} repeatCount="indefinite" />
            )}
          </g>
        ))}
      </g>
      <g>
        {bars.map((b) => {
          const x = 40 + b * 58
          const base = 220 + (b % 5) * 40
          const h = 120 + (b % 7) * 45
          return (
            <g key={b}>
              <rect x={x} y={760 - base} width="18" height={base} rx="2" fill="#E11D48" opacity="0.08" />
              <rect x={x} y={760 - h} width="18" height={h} rx="2" fill="#E11D48" opacity={0.18 + (b % 3) * 0.12}>
                {!reduced && (
                  <animate attributeName="height" values={`${h};${h * 0.45};${h}`} dur={`${2.8 + (b % 4) * 0.5}s`} repeatCount="indefinite" />
                )}
                {!reduced && (
                  <animate attributeName="y" values={`${760 - h};${760 - h * 0.45};${760 - h}`} dur={`${2.8 + (b % 4) * 0.5}s`} repeatCount="indefinite" />
                )}
              </rect>
            </g>
          )
        })}
      </g>
      <rect x="0" y="-200" width="1440" height="220" fill="url(#scan)">
        {!reduced && (
          <animate attributeName="y" values="-220;920;-220" dur="5.5s" repeatCount="indefinite" />
        )}
        {reduced && <animate attributeName="y" values="340;340" dur="1s" />}
      </rect>
      <rect x="0" y="330" width="1440" height="2" fill="#E11D48" opacity="0.5">
        {!reduced && <animate attributeName="opacity" values="0.2;0.7;0.2" dur="5.5s" repeatCount="indefinite" />}
      </rect>
      <rect width="1440" height="900" fill="url(#secFade)" />
    </svg>
  )
}

function SystemsScene({ reduced }) {
  const lines = [
    { y: 260, amp: 28, w: 3.5, o: 0.9, dur: 7 },
    { y: 360, amp: 36, w: 2.5, o: 0.55, dur: 8.5 },
    { y: 460, amp: 22, w: 2, o: 0.35, dur: 10 },
    { y: 560, amp: 30, w: 2.5, o: 0.45, dur: 9 },
  ]
  const pathFor = (y, amp) => {
    let d = `M -40 ${y}`
    for (let x = -40; x <= 1480; x += 40) {
      const t = x / 1440
      const yy = y + Math.sin(t * Math.PI * 5) * amp + Math.sin(t * Math.PI * 2) * (amp * 0.35)
      d += ` L ${x} ${yy}`
    }
    return d
  }
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" role="img" aria-label="Digital content and systems visualization">
      <defs>
        <linearGradient id="sysFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#160D11" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#160D11" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="waveStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E11D48" stopOpacity="0.05" />
          <stop offset="20%" stopColor="#E11D48" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#E11D48" stopOpacity="1" />
          <stop offset="80%" stopColor="#E11D48" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#E11D48" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="1440" height="900" fill="#160D11" />
      <g stroke="#E11D48" strokeOpacity="0.08">
        {Array.from({ length: 19 }, (_, i) => (
          <line key={i} x1="0" y1={i * 50} x2="1440" y2={i * 50} strokeWidth="1" />
        ))}
      </g>
      {lines.map((l, i) => (
        <g key={i}>
          <path d={pathFor(l.y, l.amp)} fill="none" stroke="url(#waveStroke)" strokeWidth={l.w} opacity={l.o}>
            {!reduced && (
              <animateTransform attributeName="transform" type="translate" values="0 0; -120 0; 0 0" dur={`${l.dur}s`} repeatCount="indefinite" />
            )}
          </path>
          <path d={pathFor(l.y + 14, l.amp * 0.5)} fill="none" stroke="#E11D48" strokeWidth="1.5" opacity={l.o * 0.3}>
            {!reduced && (
              <animateTransform attributeName="transform" type="translate" values="0 0; 80 0; 0 0" dur={`${l.dur + 2}s`} repeatCount="indefinite" />
            )}
          </path>
        </g>
      ))}
      <g>
        {Array.from({ length: 12 }, (_, i) => {
          const x = 80 + i * 120
          return (
            <rect key={i} x={x} y="220" width="40" height="360" rx="3" fill="#E11D48" opacity="0.05">
              {!reduced && (
                <animate attributeName="opacity" values={`0.03;${0.08 + (i % 3) * 0.04};0.03`} dur={`${3.5 + (i % 4) * 0.6}s`} repeatCount="indefinite" />
              )}
            </rect>
          )
        })}
      </g>
      <rect width="1440" height="900" fill="url(#sysFade)" />
    </svg>
  )
}

export default function StickySceneIntro() {
  const sectionRef = useRef(null)
  const [p, setP] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) {
      setP(1)
      return
    }
    let ticking = false
    const update = () => {
      ticking = false
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = Math.max(1, el.offsetHeight - window.innerHeight)
      const scrolled = -rect.top
      const next = clamp(scrolled / total, 0, 1)
      setP(next)
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced])

  const effectiveP = reduced ? 1 : p

  const s1o = 1 - range(effectiveP, 0.29, 0.37)
  const s3o = range(effectiveP, 0.62, 0.70)
  const s2o = clamp(1 - s1o - s3o, 0, 1)

  const s1s = 1.05 - 0.05 * range(effectiveP, 0, 0.33)
  const s2s = 1.05 - 0.05 * range(effectiveP, 0.33, 0.66)
  const s3s = 1.05 - 0.05 * range(effectiveP, 0.66, 1)

  const titleT = range(effectiveP, 0.8, 1)
  const titleOpacity = titleT
  const titleY = 20 * (1 - titleT)

  const skip = () => {
    const el = sectionRef.current
    if (!el) return
    const target = el.offsetTop + el.offsetHeight
    window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-[#160D11]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[#160D11]" />
        <Scene label="01 // WEB & AI ARCHITECTURE" opacity={s1o} scale={s1s} reduced={reduced}>
          <ArchitectureScene reduced={reduced} />
        </Scene>
        <Scene label="02 // ETHICAL HACKING & APPSEC" opacity={s2o} scale={s2s} reduced={reduced}>
          <SecurityScene reduced={reduced} />
        </Scene>
        <Scene label="03 // DIGITAL CONTENT & SYSTEMS" opacity={s3o} scale={s3s} reduced={reduced}>
          <SystemsScene reduced={reduced} />
        </Scene>

        <div className="absolute inset-x-0 bottom-24 md:bottom-28 flex items-center justify-center pointer-events-none z-10">
          <h2
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              textShadow: '0 0 40px rgba(225,29,72,0.25)',
            }}
          >
            DRIPPY <span className="text-[#E11D48]">DEE</span>
          </h2>
        </div>

        <button
          type="button"
          onClick={skip}
          className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 rounded-full border border-white/20 bg-black/30 backdrop-blur px-4 py-2 text-sm text-white/90 hover:text-white hover:border-[#E11D48] transition"
        >
          Skip ↓
        </button>
      </div>
    </section>
  )
}
