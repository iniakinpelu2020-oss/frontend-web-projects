import { useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function ScrollytellingIntro({ onComplete }) {
  const container = useRef(null)
  const [done, setDone] = useState(false)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const complete = self.progress >= 0.995
          setDone(complete)
          if (onComplete) onComplete(complete)
          const bar = container.current?.querySelector('.progress-fill')
          if (bar) bar.style.width = `${self.progress * 100}%`
        },
      },
    })

    // Initial states
    tl.set('.stage2', { autoAlpha: 0 })
      .set('.stage3', { autoAlpha: 0 })
      .set('.hud2, .hud3', { autoAlpha: 0, y: 16 })
      .set('.hud1', { autoAlpha: 1, y: 0 })
      .set('.intro-veil', { autoAlpha: 0 })
      .set('.cargo-group', { y: -140 })
      .set('.crane-trolley', { x: 0 })
      .set('.crane-cable', { scaleY: 0.3, transformOrigin: '50% 0%' })
      .set('.crane-hook', { y: -60 })
      .set('.truck-body', { y: 0 })
      .set('.highway-scene', { rotation: 0, scale: 1 })
      .set('.road-dash', { attr: { 'stroke-dashoffset': 0 } })
      .set('.speed-lines', { autoAlpha: 0 })
      .set('.shuttle', { autoAlpha: 0, scale: 0.7, y: 60, x: 0 })
      .set('.truck-morph', { autoAlpha: 1, scale: 1 })
      .set('.engine-glow', { autoAlpha: 0, scale: 0.5, transformOrigin: '50% 100%' })

    // Stage 1: 0% -> 35% (Crane & Container Load)
    tl.to('.crane-trolley', { x: 120, duration: 0.08, ease: 'power1.inOut' }, 0)
      .to('.crane-cable', { scaleY: 1.25, duration: 0.12, ease: 'power1.inOut' }, 0.02)
      .to('.crane-hook', { y: 40, duration: 0.12, ease: 'power1.inOut' }, 0.02)
      .to('.cargo-group', { y: 0, duration: 0.14, ease: 'power2.in' }, 0.08)
      .to('.truck-body', { y: 6, duration: 0.03, ease: 'power2.out' }, 0.21)
      .to('.truck-body', { y: -2, duration: 0.03, ease: 'power2.inOut' }, 0.24)
      .to('.truck-body', { y: 0, duration: 0.03, ease: 'power2.out' }, 0.27)
      .to('.cargo-group', { y: -2, duration: 0.03, yoyo: true, repeat: 1 }, 0.24)
      .to('.crane-cable', { scaleY: 0.7, duration: 0.06, ease: 'power1.out' }, 0.23)
      .to('.crane-hook', { y: -10, duration: 0.06, ease: 'power1.out' }, 0.23)
      .to('.hud1', { autoAlpha: 0, y: -12, duration: 0.04 }, 0.31)
      .to('.stage1', { autoAlpha: 0, duration: 0.05 }, 0.30)

    // Stage 2: 35% -> 70% (Highway Drive)
    tl.to('.stage2', { autoAlpha: 1, duration: 0.05 }, 0.33)
      .to('.hud2', { autoAlpha: 1, y: 0, duration: 0.04 }, 0.35)
      .to('.highway-scene', { rotation: -8, scale: 1.08, transformOrigin: '50% 60%', duration: 0.12, ease: 'power1.inOut' }, 0.35)
      .to('.road-dash', { attr: { 'stroke-dashoffset': -900 }, duration: 0.33, ease: 'none' }, 0.36)
      .to('.side-markings', { y: 120, duration: 0.33, ease: 'none' }, 0.36)
      .to('.speed-lines', { autoAlpha: 0.8, duration: 0.05 }, 0.42)
      .to('.truck-drive', { x: 40, duration: 0.18, ease: 'power1.in' }, 0.38)
      .to('.truck-drive', { y: -3, duration: 0.06, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 0.38)
      .to('.headlight-beam', { opacity: 0.9, duration: 0.06 }, 0.4)
      .to('.tail-trail', { scaleX: 1.4, transformOrigin: '100% 50%', duration: 0.2, ease: 'power1.in' }, 0.42)
      .to('.hud2', { autoAlpha: 0, y: -12, duration: 0.04 }, 0.66)
      .to('.stage2', { autoAlpha: 0, duration: 0.05 }, 0.66)

    // Stage 3: 70% -> 100% (Morph & Reveal)
    tl.to('.stage3', { autoAlpha: 1, duration: 0.05 }, 0.68)
      .to('.hud3', { autoAlpha: 1, y: 0, duration: 0.04 }, 0.70)
      .to('.truck-morph', { scale: 0.85, y: -20, duration: 0.08, ease: 'power2.inOut' }, 0.72)
      .to('.truck-morph', { autoAlpha: 0, scale: 0.6, duration: 0.07, ease: 'power2.in' }, 0.78)
      .to('.shuttle', { autoAlpha: 1, scale: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.78)
      .to('.engine-glow', { autoAlpha: 1, scale: 1.2, duration: 0.06 }, 0.82)
      .to('.starfield', { y: 180, duration: 0.22, ease: 'none' }, 0.72)
      .to('.warp-lines', { autoAlpha: 1, duration: 0.04 }, 0.84)
      .to('.warp-lines line', { attr: { y2: (i) => 300 + i * 20 }, duration: 0.12, stagger: 0.01, ease: 'power2.in' }, 0.84)
      .to('.shuttle', { y: -260, scale: 1.15, duration: 0.14, ease: 'power3.in' }, 0.84)
      .to('.hud3', { autoAlpha: 0, y: -12, duration: 0.04 }, 0.93)
      .to('.intro-veil', { autoAlpha: 1, duration: 0.07, ease: 'power2.inOut' }, 0.93)
      .to('.intro-controls', { autoAlpha: 0, duration: 0.04 }, 0.94)
  }, { scope: container })

  const skipIntro = () => {
    const el = container.current
    if (!el) return
    const st = ScrollTrigger.getAll().find(s => s.trigger === el)
    const end = st ? st.end : el.offsetTop + window.innerHeight * 2.5
    window.scrollTo({ top: end + 2, behavior: 'smooth' })
  }

  const replayIntro = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section ref={container} className="relative z-10 h-screen w-full overflow-hidden bg-[#0D080A] text-white">
      <div className="intro-stage absolute inset-0">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <defs>
            <linearGradient id="bgG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#160D11" />
              <stop offset="100%" stopColor="#0D080A" />
            </linearGradient>
            <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a3440" />
              <stop offset="50%" stopColor="#1b1720" />
              <stop offset="100%" stopColor="#0f0b12" />
            </linearGradient>
            <linearGradient id="metalLight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6b7280" />
              <stop offset="100%" stopColor="#374151" />
            </linearGradient>
            <linearGradient id="crimson" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="50%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9f1239" />
            </linearGradient>
            <linearGradient id="roadG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1520" />
              <stop offset="100%" stopColor="#0b0a10" />
            </linearGradient>
            <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fde68a" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="engine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="50%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
            </linearGradient>
            <filter id="softGlow"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000" floodOpacity="0.5" /></filter>
          </defs>

          <rect width="1440" height="900" fill="url(#bgG)" />

          {/* STAGE 1: Crane & Container Load (isometric) */}
          <g className="stage1">
            <g opacity="0.25" stroke="#E11D48">
              {[...Array(14)].map((_, i) => <line key={`gh${i}`} x1={-200 + i * 120} y1="900" x2={400 + i * 120} y2="200" strokeOpacity="0.22" />)}
              {[...Array(12)].map((_, i) => <line key={`gv${i}`} x1={200 + i * 120} y1="900" x2={-400 + i * 120} y2="200" strokeOpacity="0.18" />)}
            </g>
            <ellipse cx="720" cy="760" rx="420" ry="90" fill="#120b0f" opacity="0.6" />

            {/* Gantry */}
            <g transform="translate(420,260)">
              <rect x="0" y="0" width="30" height="420" fill="url(#metal)" stroke="#4b5563" />
              <rect x="520" y="40" width="30" height="380" fill="url(#metal)" stroke="#4b5563" />
              <rect x="-20" y="0" width="590" height="26" rx="4" fill="url(#metalLight)" stroke="#6b7280" />
              <rect x="60" y="26" width="10" height="360" fill="#374151" opacity="0.5" />
              <rect x="480" y="26" width="10" height="320" fill="#374151" opacity="0.5" />
              <g className="crane-trolley">
                <rect x="160" y="-6" width="90" height="38" rx="6" fill="#2a2430" stroke="#6b7280" />
                <circle cx="180" cy="36" r="7" fill="#9ca3af" />
                <circle cx="230" cy="36" r="7" fill="#9ca3af" />
                <rect className="crane-cable" x="202" y="32" width="4" height="120" fill="#9ca3af" />
                <g className="crane-hook">
                  <rect x="192" y="150" width="24" height="14" rx="3" fill="#E11D48" />
                  <path d="M204 164 v16 a10 10 0 0 0 20 0" stroke="#d1d5db" strokeWidth="4" fill="none" />
                </g>
              </g>
            </g>

            {/* Isometric 18-wheeler */}
            <g className="truck-body" transform="translate(520,560)" filter="url(#shadow)">
              {/* trailer */}
              <polygon points="120,40 360,0 520,60 280,110" fill="#1b2430" stroke="#334155" />
              <polygon points="280,110 520,60 520,120 280,170" fill="#111827" stroke="#334155" />
              <polygon points="120,40 280,110 280,170 120,100" fill="#0f172a" stroke="#334155" />
              {/* cab */}
              <polygon points="40,70 120,40 160,58 80,90" fill="#2a2430" stroke="#4b5563" />
              <polygon points="80,90 160,58 160,100 80,132" fill="#1f2937" stroke="#4b5563" />
              <polygon points="40,70 80,90 80,132 40,112" fill="#111827" stroke="#4b5563" />
              <polygon points="52,78 74,70 74,88 52,96" fill="#67e8f9" opacity="0.35" />
              {/* wheels */}
              {[{cx:90,cy:135},{cx:130,cy:150},{cx:320,cy:165},{cx:380,cy:175},{cx:440,cy:185}].map((w,i)=>(
                <g key={i}><ellipse cx={w.cx} cy={w.cy} rx="18" ry="10" fill="#0b0b0b" stroke="#4b5563" /><ellipse cx={w.cx} cy={w.cy} rx="7" ry="4" fill="#6b7280" /></g>
              ))}
              {/* chassis detail */}
              <line x1="160" y1="85" x2="280" y2="120" stroke="#475569" strokeWidth="4" />

              {/* Container on flatbed */}
              <g className="cargo-group" transform="translate(0,-10)">
                <polygon points="170,10 350,-20 480,30 300,65" fill="url(#crimson)" stroke="#fecdd3" strokeOpacity="0.6" />
                <polygon points="300,65 480,30 480,85 300,120" fill="#9f1239" stroke="#fecdd3" strokeOpacity="0.4" />
                <polygon points="170,10 300,65 300,120 170,65" fill="#7f1d1d" stroke="#fecdd3" strokeOpacity="0.4" />
                <polygon points="185,15 335,-10 335,10 185,35" fill="#fff" opacity="0.08" />
                <text x="320" y="35" fill="#fff" fontSize="16" fontWeight="700" fontFamily="Space Grotesk, sans-serif" transform="skewY(-9)">DRIPPY DEE</text>
                <text x="350" y="55" fill="#ffe4e6" fontSize="11" fontFamily="Space Grotesk, sans-serif" transform="skewY(-9)">// 2026</text>
                <g stroke="#fecdd3" strokeOpacity="0.25">
                  <line x1="230" y1="5" x2="230" y2="95" />
                  <line x1="290" y1="-5" x2="290" y2="105" />
                  <line x1="350" y1="-12" x2="350" y2="112" />
                  <line x1="410" y1="0" x2="410" y2="100" />
                </g>
              </g>
            </g>
            <text className="hud1" x="80" y="110" fill="#E11D48" fontSize="22" fontFamily="Space Grotesk, sans-serif" letterSpacing="2">01 // CONCEPT &amp; ARCHITECTURE</text>
            <text className="hud1" x="80" y="145" fill="#ffffff" opacity="0.7" fontSize="14" fontFamily="Plus Jakarta Sans, sans-serif">Loading your vision onto the build pipeline</text>
          </g>

          {/* STAGE 2: Highway Drive */}
          <g className="stage2">
            <g className="highway-scene">
              <rect width="1440" height="900" fill="#0c0a10" />
              <polygon points="720,260 1400,900 40,900" fill="url(#roadG)" />
              <polygon points="720,260 760,260 920,900 520,900" fill="#16131d" />
              <g className="side-markings" stroke="#E11D48" strokeOpacity="0.4" strokeWidth="3">
                <line x1="690" y1="280" x2="120" y2="900" />
                <line x1="750" y1="280" x2="1320" y2="900" />
              </g>
              <g stroke="#334155" strokeWidth="2" opacity="0.5">
                {[0,1,2,3,4,5,6].map(i => <line key={i} x1={720-(i+1)*90} y1={260+(i+1)*90} x2={720+(i+1)*90} y2={260+(i+1)*90} />)}
              </g>
              <line className="road-dash" x1="720" y1="260" x2="720" y2="920" stroke="#f8fafc" strokeWidth="6" strokeDasharray="30 40" opacity="0.7" />

              <g className="speed-lines" stroke="#67e8f9" strokeWidth="2" opacity="0.5">
                <line x1="260" y1="300" x2="420" y2="420" />
                <line x1="220" y1="380" x2="360" y2="480" />
                <line x1="1180" y1="300" x2="1020" y2="420" />
                <line x1="1220" y1="380" x2="1080" y2="480" />
              </g>

              <g className="truck-drive" transform="translate(640,520)">
                <ellipse className="tail-trail" cx="30" cy="150" rx="70" ry="18" fill="#E11D48" opacity="0.25" filter="url(#softGlow)" />
                <ellipse className="tail-trail" cx="130" cy="150" rx="70" ry="18" fill="#E11D48" opacity="0.25" filter="url(#softGlow)" />
                <g filter="url(#shadow)">
                  <polygon points="20,40 140,20 220,50 100,75" fill="#1b2430" stroke="#334155" />
                  <polygon points="100,75 220,50 220,95 100,120" fill="#111827" stroke="#334155" />
                  <polygon points="20,40 100,75 100,120 20,85" fill="#0f172a" stroke="#334155" />
                  <polygon points="-30,55 20,40 40,48 -10,65" fill="#2a2430" stroke="#4b5563" />
                  <polygon points="-10,65 40,48 40,80 -10,98" fill="#1f2937" stroke="#4b5563" />
                  <polygon points="-30,55 -10,65 -10,98 -30,88" fill="#111827" stroke="#4b5563" />
                  <rect className="headlight-beam" x="-120" y="45" width="100" height="30" fill="url(#beam)" opacity="0.5" />
                  <rect x="-28" y="60" width="10" height="8" fill="#fde68a" filter="url(#softGlow)" />
                  <rect x="200" y="90" width="10" height="6" fill="#fb7185" filter="url(#softGlow)" />
                  {[{cx:0,cy:95},{cx:50,cy:105},{cx:130,cy:118},{cx:170,cy:125}].map((w,i)=>(
                    <g key={i}><ellipse cx={w.cx} cy={w.cy} rx="14" ry="8" fill="#0b0b0b" stroke="#4b5563" /><ellipse cx={w.cx} cy={w.cy} rx="5" ry="3" fill="#6b7280" /></g>
                  ))}
                  <polygon points="35,30 130,15 200,38 105,56" fill="url(#crimson)" stroke="#fecdd3" strokeOpacity="0.4" />
                  <polygon points="105,56 200,38 200,65 105,83" fill="#9f1239" />
                  <polygon points="35,30 105,56 105,83 35,57" fill="#7f1d1d" />
                </g>
              </g>
            </g>
            <text className="hud2" x="80" y="110" fill="#E11D48" fontSize="22" fontFamily="Space Grotesk, sans-serif" letterSpacing="2">02 // FULL-STACK &amp; AI ENGINEERING</text>
            <text className="hud2" x="80" y="145" fill="#ffffff" opacity="0.7" fontSize="14" fontFamily="Plus Jakarta Sans, sans-serif">Full-speed execution on the digital highway</text>
          </g>

          {/* STAGE 3: Shuttle Morph & Reveal */}
          <g className="stage3">
            <rect width="1440" height="900" fill="#060814" />
            <g className="starfield" fill="#fff">
              {[...Array(70)].map((_, i) => <circle key={i} cx={(i * 137) % 1440} cy={(i * 97) % 1200 - 150} r={(i % 3) * 0.6 + 0.6} opacity={0.4 + (i % 5) * 0.12} />)}
            </g>
            <g className="warp-lines" opacity="0" stroke="#67e8f9" strokeWidth="2">
              {[200,360,520,720,920,1080,1240].map((x,i)=><line key={i} x1={x} y1={200+i*10} x2={x} y2={240+i*10} opacity={0.3+(i%3)*0.2} />)}
            </g>
            <ellipse cx="720" cy="780" rx="520" ry="120" fill="#0f172a" opacity="0.8" />
            <ellipse cx="720" cy="760" rx="360" ry="30" fill="#1e293b" opacity="0.6" />

            <g transform="translate(720,560)">
              <g className="truck-morph">
                <polygon points="-120,20 -10,0 120,30 10,55" fill="#1b2430" stroke="#334155" />
                <polygon points="10,55 120,30 120,70 10,95" fill="#111827" />
                <polygon points="-120,20 10,55 10,95 -120,60" fill="#0f172a" />
                <polygon points="-60,5 40,-10 100,10 0,28" fill="url(#crimson)" />
                <polygon points="0,28 100,10 100,35 0,53" fill="#9f1239" />
                <polygon points="-60,5 0,28 0,53 -60,30" fill="#7f1d1d" />
              </g>

              <g className="shuttle" filter="url(#softGlow)">
                <g className="engine-glow">
                  <ellipse cx="0" cy="110" rx="26" ry="60" fill="url(#engine)" opacity="0.9" />
                  <ellipse cx="0" cy="100" rx="14" ry="30" fill="#cffafe" opacity="0.7" />
                </g>
                <polygon points="0,-80 70,-10 45,70 -45,70 -70,-10" fill="#e5e7eb" stroke="#94a3b8" strokeWidth="2" />
                <polygon points="0,-80 70,-10 0,10 -70,-10" fill="#f8fafc" stroke="#94a3b8" />
                <polygon points="0,-40 20,-10 0,0 -20,-10" fill="#38bdf8" opacity="0.6" />
                <polygon points="-70,-10 -120,30 -45,50" fill="url(#crimson)" stroke="#fecdd3" strokeOpacity="0.5" />
                <polygon points="70,-10 120,30 45,50" fill="url(#crimson)" stroke="#fecdd3" strokeOpacity="0.5" />
                <polygon points="-25,70 0,110 25,70" fill="#9ca3af" />
                <line x1="-20" y1="20" x2="20" y2="20" stroke="#94a3b8" />
                <line x1="-30" y1="45" x2="30" y2="45" stroke="#94a3b8" />
              </g>
            </g>

            <text className="hud3" x="80" y="110" fill="#E11D48" fontSize="22" fontFamily="Space Grotesk, sans-serif" letterSpacing="2">03 // DEPLOYED TO THE WORLD</text>
            <text className="hud3" x="80" y="145" fill="#ffffff" opacity="0.7" fontSize="14" fontFamily="Plus Jakarta Sans, sans-serif">Morph, launch, and deliver at light speed</text>
          </g>
        </svg>

        <div className="intro-veil absolute inset-0 bg-[#160D11] pointer-events-none" style={{ opacity: 0 }} />

        <div className={`intro-controls absolute inset-x-0 bottom-0 p-6 md:p-8 transition-opacity duration-300 ${done ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-3 text-white/80">
              <span className="text-sm tracking-wide">Scroll to explore ↓</span>
              <div className="h-1.5 w-48 rounded-full bg-white/15 overflow-hidden">
                <div className="progress-fill h-full w-0 bg-[#E11D48]" />
              </div>
            </div>
          </div>
          <button onClick={skipIntro} className="absolute top-6 right-6 z-20 rounded-full border border-white/20 bg-black/30 backdrop-blur px-4 py-2 text-sm text-white/90 hover:text-white hover:border-[#E11D48] transition">
            Skip Intro →
          </button>
          <button onClick={replayIntro} className="absolute top-6 left-6 z-20 rounded-full border border-white/20 bg-black/30 backdrop-blur px-4 py-2 text-sm text-white/90 hover:text-white hover:border-[#E11D48] transition">
            ↺ Replay Intro
          </button>
        </div>
      </div>
    </section>
  )
}
