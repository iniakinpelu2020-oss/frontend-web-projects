import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function ScrollytellingIntro({ onComplete }) {
  const container = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (onComplete) onComplete(self.progress >= 0.995)
        },
      },
    })

    tl.set('.intro-nav-fade', { autoAlpha: 0 })
      .set('.stage2, .stage3', { autoAlpha: 0 })
      .set('.hud2, .hud3', { autoAlpha: 0, y: 10 })
      .set('.dock-container', { y: 0 })
      .set('.truck-group', { x: 0, y: 0, scale: 1 })

    // Stage 1 (0-30%) Loading
    tl.to('.dock-container', { y: 32, duration: 0.12, ease: 'power2.inOut' }, 0)
      .to('.dock-container', { y: 18, duration: 0.08, ease: 'power2.out' }, 0.12)
      .to('.crane-arm', { rotation: -18, transformOrigin: '160px 220px', duration: 0.12, ease: 'power2.inOut' }, 0.02)
      .to('.crane-arm', { rotation: 0, duration: 0.08, ease: 'power2.out' }, 0.14)
      .to('.hud1', { autoAlpha: 0, y: -10, duration: 0.06 }, 0.24)
      .to('.stage1', { autoAlpha: 0, duration: 0.08 }, 0.22)

    // Stage 2 (30-65%) Highway
      .to('.stage2', { autoAlpha: 1, duration: 0.08 }, 0.24)
      .fromTo('.hud2', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.26)
      .to('.road-lines', { strokeDashoffset: -400, duration: 0.35, ease: 'none' }, 0.3)
      .to('.truck-drive', { y: -10, duration: 0.18, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0.3)
      .to('.trail-streaks', { opacity: 0.9, duration: 0.1 }, 0.32)
      .to('.trail-streaks', { opacity: 0.2, duration: 0.1 }, 0.52)
      .to('.hud2', { autoAlpha: 0, y: -10, duration: 0.06 }, 0.58)
      .to('.stage2', { autoAlpha: 0, duration: 0.08 }, 0.58)

    // Stage 3 (65-90%) Launch
      .to('.stage3', { autoAlpha: 1, duration: 0.08 }, 0.6)
      .fromTo('.hud3', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.62)
      .fromTo('.vehicle-truck', { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 0.85, duration: 0.12, ease: 'power2.inOut' }, 0.66)
      .fromTo('.vehicle-shuttle', { autoAlpha: 0, scale: 0.85, y: 40 }, { autoAlpha: 1, scale: 1, y: -220, duration: 0.22, ease: 'power3.out' }, 0.66)
      .to('.launch-flame', { scaleY: 1.4, opacity: 1, transformOrigin: '50% 0%', duration: 0.12, repeat: 1, yoyo: true }, 0.7)
      .to('.sky-stars', { y: 80, duration: 0.25, ease: 'none' }, 0.65)
      .to('.hud3', { autoAlpha: 0, y: -10, duration: 0.06 }, 0.86)

    // Stage 4 (90-100%) Reveal
      .to('.stage3', { scale: 1.6, transformOrigin: '50% 50%', duration: 0.1, ease: 'power2.in' }, 0.9)
      .to('.intro-iris', { clipPath: 'circle(150% at 50% 50%)', duration: 0.1, ease: 'power2.out' }, 0.9)
      .to('.intro-overlay', { autoAlpha: 0, duration: 0.08 }, 0.92)
      .to('.intro-nav-fade', { autoAlpha: 1, duration: 0.06 }, 0.94)

    const progress = { value: 0 }
    gsap.to(progress, {
      value: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: '+=300%',
        scrub: 1,
        onUpdate: (self) => {
          const bar = container.current?.querySelector('.progress-fill')
          if (bar) bar.style.width = `${self.progress * 100}%`
        },
      },
    })
  }, { scope: container })

  const skipIntro = () => {
    const el = container.current
    if (!el) return
    const end = el.offsetTop + el.offsetHeight
    window.scrollTo({ top: end, behavior: 'smooth' })
  }

  return (
    <section ref={container} className="relative h-screen w-full overflow-hidden bg-[#0D080A] text-white">
      <div className="intro-stage absolute inset-0">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <defs>
            <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#160D11" />
              <stop offset="100%" stopColor="#0D080A" />
            </linearGradient>
            <linearGradient id="neon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E11D48" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#E11D48" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#E11D48" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <rect width="1440" height="900" fill="url(#bgGrad)" />

          {/* Stage 1: Dock */}
          <g className="stage1">
            <g opacity="0.35" stroke="#E11D48">
              {[...Array(12)].map((_, i) => <line key={`h${i}`} x1="0" y1={120 + i * 60} x2="1440" y2={120 + i * 60} strokeOpacity="0.18" />)}
              {[...Array(16)].map((_, i) => <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="900" strokeOpacity="0.12" />)}
            </g>
            <g transform="translate(420,380)">
              <rect x="0" y="120" width="520" height="50" rx="8" fill="#141418" stroke="#2a1d23" />
              <rect x="60" y="100" width="120" height="30" rx="4" fill="#0f0b0d" stroke="#2a1d23" />
              <rect x="160" y="40" width="300" height="70" rx="8" fill="#1b1418" stroke="#3a232c" />
              <circle cx="120" cy="180" r="28" fill="#222" stroke="#444" />
              <circle cx="440" cy="180" r="28" fill="#222" stroke="#444" />
              <rect x="360" y="55" width="80" height="30" rx="4" fill="#E11D48" opacity="0.2" />
            </g>
            <g className="dock-container" transform="translate(620,300)">
              <rect x="0" y="0" width="180" height="90" rx="8" fill="#120b0f" stroke="#E11D48" filter="url(#glow)" />
              <rect x="10" y="10" width="160" height="70" rx="6" fill="#160D11" stroke="#E11D48" strokeOpacity="0.5" />
              <text x="90" y="42" textAnchor="middle" fill="#fff" fontSize="14" fontFamily="Space Grotesk, sans-serif" fontWeight="700">DRIPPY DEE</text>
              <text x="90" y="62" textAnchor="middle" fill="#E11D48" fontSize="12" fontFamily="Space Grotesk, sans-serif">// 2026</text>
            </g>
            <g className="crane-arm" transform="translate(0,0)">
              <rect x="140" y="220" width="40" height="360" fill="#1b1418" />
              <rect x="140" y="220" width="380" height="24" rx="6" fill="#1b1418" />
              <line x1="520" y1="244" x2="700" y2="300" stroke="#E11D48" strokeWidth="3" />
              <rect x="680" y="300" width="40" height="20" rx="4" fill="#E11D48" />
            </g>
            <text className="hud1" x="80" y="120" fill="#E11D48" fontSize="22" fontFamily="Space Grotesk, sans-serif" letterSpacing="2">01 // CONCEPT &amp; ARCHITECTURE</text>
          </g>

          {/* Stage 2: Highway */}
          <g className="stage2">
            <rect x="360" y="0" width="720" height="900" fill="#120b0f" />
            <rect x="360" y="0" width="12" height="900" fill="#E11D48" opacity="0.5" />
            <rect x="1068" y="0" width="12" height="900" fill="#E11D48" opacity="0.5" />
            <g stroke="#f8fafc" strokeWidth="8" strokeDasharray="40 40" className="road-lines" opacity="0.7">
              <line x1="600" y1="-200" x2="600" y2="1100" />
              <line x1="840" y1="-200" x2="840" y2="1100" />
            </g>
            <g className="truck-drive" transform="translate(620,420)">
              <g className="trail-streaks" opacity="0.3">
                <rect x="40" y="220" width="16" height="160" fill="#E11D48" filter="url(#glow)" />
                <rect x="144" y="220" width="16" height="160" fill="#E11D48" filter="url(#glow)" />
              </g>
              <rect x="0" y="0" width="200" height="220" rx="16" fill="#141418" stroke="#2d1e25" />
              <rect x="20" y="20" width="160" height="140" rx="10" fill="#1b1418" stroke="#E11D48" strokeOpacity="0.4" />
              <rect x="30" y="-30" width="140" height="50" rx="10" fill="#0f0b0d" stroke="#2d1e25" />
              <rect x="45" y="-20" width="110" height="28" rx="6" fill="#67e8f9" opacity="0.15" />
              <rect x="20" y="190" width="30" height="12" fill="#fde68a" />
              <rect x="150" y="190" width="30" height="12" fill="#fde68a" />
            </g>
            <text className="hud2" x="80" y="120" fill="#E11D48" fontSize="22" fontFamily="Space Grotesk, sans-serif" letterSpacing="2">02 // FULL-STACK &amp; AI ENGINEERING</text>
          </g>

          {/* Stage 3: Launch */}
          <g className="stage3">
            <rect width="1440" height="900" fill="#0a0e1a" />
            <g className="sky-stars" fill="#fff" opacity="0.7">
              {[...Array(40)].map((_, i) => <circle key={i} cx={(i * 97) % 1440} cy={(i * 53) % 900} r={(i % 3) + 1} />)}
            </g>
            <rect x="420" y="520" width="600" height="380" rx="40" fill="#111827" opacity="0.7" />
            <rect x="700" y="420" width="40" height="480" fill="#334155" opacity="0.5" />
            <g transform="translate(620,520)">
              <g className="vehicle-truck">
                <rect x="0" y="0" width="200" height="160" rx="16" fill="#141418" stroke="#2d1e25" />
                <rect x="20" y="20" width="160" height="100" rx="10" fill="#1b1418" stroke="#E11D48" strokeOpacity="0.4" />
              </g>
              <g className="vehicle-shuttle" opacity="0">
                <path d="M100 0 L160 90 L140 160 L60 160 L40 90 Z" fill="#e5e7eb" stroke="#94a3b8" />
                <rect x="80" y="40" width="40" height="30" rx="6" fill="#38bdf8" opacity="0.5" />
                <path d="M40 120 L10 180 L60 160 Z" fill="#E11D48" />
                <path d="M160 120 L190 180 L140 160 Z" fill="#E11D48" />
                <g className="launch-flame" opacity="0.7">
                  <path d="M80 160 L100 240 L120 160 Z" fill="#fb7185" />
                  <path d="M88 160 L100 210 L112 160 Z" fill="#fde68a" />
                </g>
              </g>
            </g>
            <text className="hud3" x="80" y="120" fill="#E11D48" fontSize="22" fontFamily="Space Grotesk, sans-serif" letterSpacing="2">03 // DEPLOYED TO THE WORLD</text>
          </g>
        </svg>

        <div className="intro-iris absolute inset-0 bg-[#160D11] pointer-events-none" style={{ clipPath: 'circle(0% at 50% 50%)' }} />
        <div className="intro-overlay absolute inset-0 pointer-events-none" />

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/80">
          <span className="text-sm tracking-wide">Scroll to explore ↓</span>
          <div className="h-1.5 w-48 rounded-full bg-white/15 overflow-hidden">
            <div className="progress-fill h-full w-0 bg-[#E11D48]" />
          </div>
        </div>

        <button onClick={skipIntro} className="absolute top-6 right-6 z-20 rounded-full border border-white/20 bg-black/30 backdrop-blur px-4 py-2 text-sm text-white/90 hover:text-white hover:border-[#E11D48] transition">
          Skip Intro →
        </button>
      </div>
    </section>
  )
}
