import { useEffect, useRef, useState } from 'react'

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

function ArchitectureScene({ reduced }) {
  const hLines = Array.from({ length: 18 }, (_, i) => 80 + i * 48)
  const vLines = Array.from({ length: 26 }, (_, i) => -200 + i * 80)
  const lasers = [
    { x: 240, h: 340, dur: 2.8, delay: 0 },
    { x: 520, h: 420, dur: 3.2, delay: 0.4 },
    { x: 760, h: 300, dur: 2.6, delay: 0.9 },
    { x: 980, h: 380, dur: 3.4, delay: 0.2 },
    { x: 1220, h: 320, dur: 3.0, delay: 0.7 },
  ]
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="archFadeE" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#160D11" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#160D11" stopOpacity="0" />
          <stop offset="100%" stopColor="#160D11" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="laserDown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E11D48" stopOpacity="0" />
          <stop offset="40%" stopColor="#E11D48" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1440" height="900" fill="#160D11" />
      <g stroke="#E11D48" strokeOpacity="0.18">
        {hLines.map((y, i) => (
          <line key={`h-${i}`} x1="-200" y1={y} x2="1640" y2={y + 120} strokeWidth="1" />
        ))}
        {vLines.map((x, i) => (
          <line key={`v-${i}`} x1={x} y1="0" x2={x + 260} y2="900" strokeWidth="1" />
        ))}
      </g>
      <g>
        {lasers.map((l, i) => (
          <g key={i}>
            <rect x={l.x - 1.5} y={-l.h} width="3" height={l.h} rx="1.5" fill="url(#laserDown)" opacity="0.95">
              {!reduced && (
                <animate attributeName="y" values={`${-l.h};1000;${-l.h}`} dur={`${l.dur}s`} begin={`${l.delay}s`} repeatCount="indefinite" />
              )}
              {reduced && <animate attributeName="y" values="260;260" dur="1s" />}
            </rect>
            <rect x={l.x - 7} y={-l.h} width="14" height={l.h} rx="7" fill="#E11D48" opacity="0.12">
              {!reduced && (
                <animate attributeName="y" values={`${-l.h};1000;${-l.h}`} dur={`${l.dur}s`} begin={`${l.delay}s`} repeatCount="indefinite" />
              )}
              {reduced && <animate attributeName="y" values="260;260" dur="1s" />}
            </rect>
          </g>
        ))}
      </g>
      <g stroke="#E11D48" strokeOpacity="0.35" strokeWidth="2">
        <line x1="0" y1="760" x2="1440" y2="760" />
        <line x1="120" y1="0" x2="120" y2="900" strokeOpacity="0.18" />
        <line x1="1320" y1="0" x2="1320" y2="900" strokeOpacity="0.18" />
      </g>
      <rect width="1440" height="900" fill="url(#archFadeE)" />
    </svg>
  )
}

function SecurityScene({ reduced }) {
  const rows = Array.from({ length: 16 }, (_, i) => i)
  const bars = Array.from({ length: 24 }, (_, i) => i)
  const hex = (i) => ((i * 2654435761) >>> 0).toString(16).slice(0, 4).toUpperCase()
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="scanE" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E11D48" stopOpacity="0" />
          <stop offset="45%" stopColor="#E11D48" stopOpacity="0.05" />
          <stop offset="50%" stopColor="#E11D48" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#E11D48" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="secFadeE" x1="0" y1="0" x2="1" y2="0">
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
                {!reduced && <animate attributeName="height" values={`${h};${h * 0.45};${h}`} dur={`${2.8 + (b % 4) * 0.5}s`} repeatCount="indefinite" />}
                {!reduced && <animate attributeName="y" values={`${760 - h};${760 - h * 0.45};${760 - h}`} dur={`${2.8 + (b % 4) * 0.5}s`} repeatCount="indefinite" />}
              </rect>
            </g>
          )
        })}
      </g>
      <rect x="0" y="-200" width="1440" height="220" fill="url(#scanE)">
        {!reduced && <animate attributeName="y" values="-220;920;-220" dur="5.5s" repeatCount="indefinite" />}
        {reduced && <animate attributeName="y" values="340;340" dur="1s" />}
      </rect>
      <rect x="0" y="330" width="1440" height="2" fill="#E11D48" opacity="0.5">
        {!reduced && <animate attributeName="opacity" values="0.2;0.7;0.2" dur="5.5s" repeatCount="indefinite" />}
      </rect>
      <rect width="1440" height="900" fill="url(#secFadeE)" />
    </svg>
  )
}

export default function EntryIntro() {
  const reduced = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(true)
  const [phase, setPhase] = useState(1) // 1: arch, 2: sec, 3: title, 4: exit
  const [progress, setProgress] = useState(0)
  const timers = useRef([])
  const raf = useRef(null)
  const progressStart = useRef(null)

  const clearAll = () => {
    timers.current.forEach((t) => clearTimeout(t))
    timers.current = []
    if (raf.current) cancelAnimationFrame(raf.current)
    raf.current = null
  }

  const startExit = () => {
    if (timers.current._exiting) return
    timers.current._exiting = true
    clearAll()
    setPhase(4)
    const unmountDelay = reduced ? 0 : 700
    const t = setTimeout(() => setMounted(false), unmountDelay)
    timers.current.push(t)
  }

  useEffect(() => {
    if (!mounted) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mounted])

  useEffect(() => {
    if (reduced) {
      setMounted(false)
      return
    }
    const t1 = setTimeout(() => setPhase(2), 1600)
    const t2 = setTimeout(() => setPhase(3), 3200)
    const t3 = setTimeout(() => startExit(), 4300)
    timers.current.push(t1, t2, t3)

    const progDelay = setTimeout(() => {
      progressStart.current = performance.now()
      const tick = (now) => {
        const elapsed = now - progressStart.current
        const p = Math.min(1, Math.max(0, elapsed / 1100))
        setProgress(p)
        if (p < 1 && !timers.current._exiting) {
          raf.current = requestAnimationFrame(tick)
        }
      }
      raf.current = requestAnimationFrame(tick)
    }, 3200)
    timers.current.push(progDelay)

    return () => {
      clearAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  if (!mounted) return null

  const exiting = phase === 4
  const containerStyle = exiting && !reduced
    ? { transform: 'translateY(100%)', transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)' }
    : { transform: 'translateY(0)' }

  return (
    <div
      className="fixed inset-0 z-50 bg-[#160D11] text-white overflow-hidden"
      style={containerStyle}
      aria-label="Intro"
    >
      <div className="absolute inset-0 pt-20">
        {phase === 1 && (
          <div className="absolute inset-0">
            <ArchitectureScene reduced={reduced} />
            <div className="absolute top-24 left-6 md:left-12 z-10">
              <p className="font-mono text-xs md:text-sm tracking-[0.25em] text-white/80">01 // WEB &amp; AI ARCHITECTURE</p>
            </div>
          </div>
        )}
        {phase === 2 && (
          <div className="absolute inset-0">
            <SecurityScene reduced={reduced} />
            <div className="absolute top-24 left-6 md:left-12 z-10">
              <p className="font-mono text-xs md:text-sm tracking-[0.25em] text-white/80">02 // ETHICAL HACKING &amp; APPSEC</p>
            </div>
          </div>
        )}
        {(phase === 3 || phase === 4) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative z-10 text-center px-6">
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                DRIPPY <span className="text-[#E11D48]">DEE</span>
              </h1>
              <div className="mt-8 mx-auto w-56 sm:w-72 md:w-96">
                <div className="h-[3px] w-full bg-white/10 overflow-hidden rounded-full">
                  <div
                    className="h-full bg-[#E11D48] rounded-full"
                    style={{ width: `${Math.round((exiting ? 1 : progress) * 100)}%`, transition: 'width 60ms linear' }}
                  />
                </div>
                <div className="mt-4 flex justify-center text-[#E11D48] text-2xl md:text-3xl animate-bounce" aria-hidden="true">
                  ↓
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#160D11] to-transparent pointer-events-none" />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={startExit}
        className="absolute bottom-8 right-6 z-20 rounded-full border border-white/20 bg-black/30 backdrop-blur px-4 py-2 text-sm text-white/90 hover:text-white hover:border-[#E11D48] transition"
      >
        Skip ↓
      </button>
    </div>
  )
}
