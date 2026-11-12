import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const PROFILE_PHOTO = '[PASTE_YOUR_DIRECT_IMAGE_URL_HERE]'
const hasProfilePhoto = PROFILE_PHOTO && !PROFILE_PHOTO.includes('PASTE_YOUR_DIRECT_IMAGE_URL_HERE')

export default function HangingBadge() {
  const [flipped, setFlipped] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 12 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 150, damping: 12 })

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mx.set(x)
    my.set(y)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div className="relative w-[280px] sm:w-[320px] md:w-[340px] h-[520px] md:h-[560px] flex items-start justify-center select-none">
      <motion.div
        className="relative origin-top"
        animate={{ rotate: [1.2, -1.2, 1.2] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'top center' }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-1.5 h-16 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full shadow" />
        <div className="absolute left-1/2 -translate-x-1/2 top-12 w-10 h-10 rounded-full border-4 border-gray-300 bg-dark z-10" />

        <motion.div
          className="mt-16 perspective-1000"
          style={{ rotateX, rotateY }}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onClick={() => setFlipped(f => !f)}
        >
          <motion.div
            className="relative w-[260px] sm:w-[290px] md:w-[310px] h-[420px] md:h-[450px] preserve-3d cursor-pointer"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-b from-[#1f1519] to-[#120b0f] border border-white/15 shadow-2xl overflow-hidden backface-hidden">
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-accent/20 to-transparent" />
              <div className="p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] tracking-[0.25em] text-white/60">IDENTITY CARD</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-accent/20 text-accent border border-accent/30">ACTIVE</span>
                </div>
                <div className="mx-auto mt-2 mb-4 h-28 w-28 rounded-2xl bg-gradient-to-br from-accent to-[#fb7185] p-[2px] shadow-lg shadow-accent/20">
                  <div className="h-full w-full rounded-2xl bg-dark flex items-center justify-center overflow-hidden">
                    {hasProfilePhoto ? (
                      <img src={PROFILE_PHOTO} alt="Drippy Dee" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-20 w-20 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center font-display text-3xl font-bold">DD</div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-display text-2xl font-bold tracking-tight">DRIPPY DEE</h3>
                  <p className="text-xs tracking-wider text-white/70 mt-1">DEVELOPER • ETHICAL HACKER • CREATOR</p>
                </div>
                <div className="mt-5 rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="h-10 w-full rounded bg-[repeating-linear-gradient(90deg,#fff_0,#fff_2px,transparent_2px,transparent_5px)] opacity-80" />
                  <div className="mt-2 flex items-center justify-between text-[10px] text-white/60">
                    <span>ID NUMBER</span>
                    <span className="font-mono text-white/80">DD-2026-NG</span>
                  </div>
                </div>
                <div className="mt-auto pt-4 flex items-center justify-between text-[11px] text-white/60">
                  <span>Tap/Hover to flip</span>
                  <span className="text-accent">VERIFIED</span>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-b from-[#1a1115] to-[#10090c] border border-accent/30 shadow-2xl overflow-hidden backface-hidden rotate-y-180">
              <div className="p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] tracking-[0.25em] text-white/60">QUICK STATS</span>
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                </div>
                <div className="space-y-3 mt-2">
                  {['Full-Stack Web Dev', 'Ethical Hacker & Cybersecurity', 'AI & Automation', 'Content Creator', 'Ibadan / Ile-Ife, NG'].map((item) => (
                    <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-sm font-medium text-white">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-auto rounded-xl bg-accent/10 border border-accent/20 p-4">
                  <p className="text-xs text-white/70 uppercase tracking-wider mb-1">Focus</p>
                  <p className="text-sm text-white">Building modern products, smart automations, and engaging digital content.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
