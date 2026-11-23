import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Menu, X, ArrowRight, Send, Sparkles, Mail, MapPin, Github, Linkedin, Globe, CheckCircle2, XCircle, ExternalLink, BarChart3, Code, Zap, Shield } from 'lucide-react'
import HangingBadge from './components/HangingBadge'
import EntryIntro from './components/EntryIntro'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const WHATSAPP_URL = 'https://wa.me/2347038273216?text=Hi%20Drippy%20Dee%2C%20I%27d%20like%20to%20book%20a%20website%20for%20my%20business.'
const WHATSAPP_BASE = 'https://wa.me/2347038273216'
const EMAIL_URL = 'mailto:iniakinpelu2020@gmail.com'
const PROFILE_PHOTO = '[PASTE_YOUR_DIRECT_IMAGE_URL_HERE]'
const hasProfilePhoto = PROFILE_PHOTO && !PROFILE_PHOTO.includes('PASTE_YOUR_DIRECT_IMAGE_URL_HERE')

// Project/live links - update these with verified production URLs.
const PROJECT_LINKS = {
  apexos: 'https://wa.me/2347038273216?text=Hi%20Drippy%20Dee%2C%20I%27d%20like%20to%20see%20the%20ApexOS%20live%20demo.',
  apexAi: 'https://apex-ai-9ho.pages.dev',
  stellbeauty: 'https://stellbeauty-massage-spa.pages.dev',
  autoDoctor: 'https://auto-doctor.pages.dev',
  portfolio: 'https://drippydee.vercel.app',
  github: 'https://github.com/iniakinpelu2020-oss',
  linkedin: 'https://www.linkedin.com/in/daniel-akinpelu',
}

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'process', label: 'How It Works' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

const roles = ['Web Developer', 'Ethical Hacker & Cybersecurity Expert', 'AI & Automation Builder', 'Content Creator']

const clientProjects = [
  {
    title: 'Stellbeauty Massage & Spa',
    category: 'Client Concept',
    dark: false,
    desc: 'Luxury wellness & spa website featuring service menus and a seamless mobile appointment booking flow.',
    tags: ['Mobile-Ready', 'Booking Flow', 'Service Menu', 'Luxury UI'],
    caseStudy: 'Designed a premium, mobile-first spa experience with clear service menus, trust-building visuals, and a frictionless appointment booking flow that helps turn visitors into booked clients.',
    liveUrl: PROJECT_LINKS.stellbeauty,
    badge: 'Mobile-Ready',
  },
  {
    title: 'Auto Doctor Manchester',
    category: 'Client Concept',
    dark: true,
    desc: 'Car repair, servicing & diagnostics landing page in South Manchester with instant repair booking, call/directions CTAs, and 5.0-star customer proof.',
    tags: ['Mobile-Ready', 'Instant Booking', 'Call/Direction CTAs', '5.0-Star Proof'],
    caseStudy: 'Built a conversion-focused landing page for Auto Doctor Manchester that makes it easy for local drivers to book repairs, call instantly, get directions, and trust the service through clear 5.0-star customer proof.',
    liveUrl: PROJECT_LINKS.autoDoctor,
    badge: 'Mobile-Ready',
  },
]

const flagshipProjects = [
  {
    title: 'ApexOS — Interactive Web Desktop Environment',
    category: 'Flagship Engineering',
    dark: true,
    desc: 'A browser-based desktop operating system featuring draggable windows, multi-app multitasking, and sandboxed iframe applications built from scratch.',
    tags: ['React', 'TypeScript', 'Sandboxed Iframes', 'Window Manager'],
    caseStudy: 'ApexOS is a browser-native desktop environment engineered from scratch with draggable window management, multi-app multitasking, and sandboxed iframe applications for safe, modular app execution.',
    liveUrl: PROJECT_LINKS.apexos,
    ctaLabel: 'Request Live Demo',
    featured: true,
  },
  {
    title: 'The Apex Ai⚡',
    category: 'Flagship Engineering',
    dark: false,
    desc: 'Multi-provider AI chat & workflow platform showcasing full-stack AI engineering, fast interfaces, and production-ready integrations.',
    tags: ['AI', 'Full-Stack', 'Multi-Provider', 'Workflows'],
    caseStudy: 'The Apex Ai⚡ is a multi-provider AI chat and workflow platform built for speed and flexibility, combining modern frontend UX with robust AI orchestration and deployment-ready engineering.',
    liveUrl: PROJECT_LINKS.apexAi,
    ctaLabel: 'View Live Project',
  },
]

const projects = [
  ...clientProjects,
  ...flagshipProjects,
  {
    title: 'WhatsApp AI Auto-Reply Bot',
    category: 'AI & Bots',
    dark: true,
    desc: 'Automated Node.js + Gemini API WhatsApp integration for smart real-time responses.',
    tags: ['Node.js', 'Gemini API', 'Automation'],
    caseStudy: 'Designed an event-driven bot pipeline that parses incoming messages, routes intents, and responds with context-aware replies while logging interactions.',
  },
  {
    title: 'SecAudit // Vulnerability & Pentest Suite',
    category: 'AI & Security',
    dark: false,
    desc: 'Offensive security assessment toolkit for web apps: automated scans, vulnerability triage, and remediation guidance.',
    tags: ['Ethical Hacking', 'AppSec', 'Penetration Testing', 'Security Audit'],
    caseStudy: 'Conducted offensive security testing across web surfaces with responsible disclosure workflows. Findings were validated, prioritized by risk, and remediated with hardened configurations and secure coding fixes, resulting in a clean audit baseline: OWASP Top 10 coverage and 0 critical vulnerabilities.',
  },
]

const filters = ['All', 'Client Concept', 'Flagship Engineering', 'AI & Bots', 'AI & Security']

const blogPosts = [
  { title: 'Building Apex AI: Lessons from a Custom Frontend', category: 'Tech Life', excerpt: 'What I learned designing a fast AI interface with vanilla web tech and serverless deployment.', body: 'From prompt UX to performance budgets, building Apex AI reinforced that clarity and speed matter as much as model quality. I focused on lean UI, resilient API handling, and iteration loops that made shipping improvements easy.' },
  { title: 'Automating WhatsApp Replies with Node.js', category: 'Tech Life', excerpt: 'A practical look at wiring messaging, intent handling, and AI responses together.', body: 'Automation works best when it feels human and reliable. This build combined webhook flows, Gemini-powered responses, and guardrails so replies stayed useful without losing control.' },
  { title: 'Balancing Academics & Building in Public', category: 'The Twist', excerpt: 'How I juggle student life with shipping projects and creating content.', body: 'Structure beats motivation. I plan deep-work blocks, keep scope realistic, and treat every small release as momentum—whether it is code, content, or coursework.' },
  { title: 'From Ideas to Execution: My Creative Process', category: 'The Twist', excerpt: 'Turning scattered inspiration into finished web and content projects.', body: 'I capture ideas quickly, validate them with tiny prototypes, and only scale what proves useful. The twist is consistency: showing up, refining, and publishing.' },
]

const techStack = ['React', 'Next.js', 'Node.js', 'Python', 'OpenAI / Gemini API', 'WhatsApp Cloud API', 'GSAP', 'Tailwind CSS', 'Ethical Hacking', 'Penetration Testing', 'Vulnerability Audits', 'AppSec']

const apexEcosystem = [
  {
    name: 'Apex AI Router',
    status: 'Live',
    description:
      'Multi-model edge inference gateway powered by Cloudflare Workers AI with automatic Gemini fallback, audio transcription, and zero-cold-start routing',
    href: 'https://apex-ai-9ho.pages.dev',
  },
  {
    name: 'Apex Studio (IDE)',
    status: 'Live',
    description:
      'Browser-native code editor and AI software engineering environment built for rapid full-stack prototyping and edge deployment',
    href: 'https://apexaicoder.pages.dev',
  },
  {
    name: 'Apex-Sec & Vault',
    status: 'Active',
    description:
      'Client-side AES-GCM / PBKDF2 encrypted credential vault paired with real-time security diagnostics and malware/spyware alert protection',
  },
  {
    name: 'Apex Editor & Media Gen',
    status: 'Active',
    description:
      'Dedicated AI voiceover, image, and video generation engine paired with a multi-track browser photo and video editor with hardware MP4 export',
  },
  {
    name: 'Apex Drive & Nexus',
    status: 'Active',
    description:
      'Auto-sync cloud backup that preserves original device files in a dedicated local synced folder, paired with custom workflow automation',
  },
  {
    name: 'ApexOS (Mobile & Desktop)',
    status: 'In Development',
    description:
      'Independent Wayland & AOSP-compatible OS featuring Apex Connect (native global/local eSIM provisioning), Apex Agent (offline-capable on-device assistant), and Apex Browser (SearXNG)',
  },
]

const apexStack = [
  'Cloudflare Workers & Pages',
  'Workers AI & Gemini API',
  'Linux Wayland / AOSP',
  'eUICC / LPA eSIM',
  'WebCrypto (AES-GCM)',
  'JavaScript / Python / Rust',
  'SearXNG Self-Hosted',
  'WebCodecs & PWAs',
]

const packages = [
  {
    name: 'Starter',
    price: '₦75,000 / $50',
    perks: [
      '1 short-form video (Reels / TikTok / Shorts)',
      'Scriptwriting, pacing & captions',
      '1 revision round',
      'Delivery in 3–5 days',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    price: '₦180,000 / $120',
    perks: [
      '3 high-retention videos (Tech, AI, or Finance breakdown)',
      'Full hook strategy, scripting & motion graphics',
      'Cross-platform posting (@InsightDeskHQ & Drippy Dee)',
      '2 revision rounds',
      'Delivery in 5–7 days',
    ],
    featured: true,
  },
  {
    name: 'Custom',
    price: 'From ₦350,000 / $250+',
    perks: [
      'Dedicated brand campaign or custom web + AI build',
      'Multi-platform content rollout & product demo',
      'Priority turnaround & flexible scope',
    ],
    featured: false,
  },
]


function ApexStatusBadge({ status }) {
  const live = status === 'Live'
  const active = status === 'Active'
  const cls = live
    ? 'text-[#38bdf8] border-[#38bdf8]/40 bg-[#38bdf8]/10'
    : active
      ? 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10'
      : 'text-amber-300 border-amber-400/30 bg-amber-400/10'
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${cls}`}>
      {status}
    </span>
  )
}

function Section({ id, className = '', children }) {
  return <section id={id} className={`scroll-mt-28 ${className}`}>{children}</section>
}

function Toast({ toast, onClose }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} className="fixed bottom-5 right-5 z-[60]">
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-xl border ${toast.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-700'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={onClose} className="ml-1 text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="relative w-full max-w-2xl rounded-2xl bg-white p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="font-display text-2xl font-bold text-ink">{title}</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close"><X size={18} /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ApexPreview() {
  const [model, setModel] = useState('Gemini')
  const [text, setText] = useState('')
  const full = model === 'Gemini'
    ? 'Generating React component...\n- Validating props\n- Styling with Tailwind\n- Ready to ship.'
    : 'Streaming response...\nfunction Hero(){\n  return <section className=\"hero\">Apex AI</section>\n}'
  useEffect(() => {
    setText('')
    let i = 0
    const id = setInterval(() => {
      i += 2
      setText(full.slice(0, i))
      if (i >= full.length) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [full])
  return (
    <div className="rounded-xl border border-white/10 bg-[#0b0f17] text-white p-3 h-full min-h-[220px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-white/70"><Code size={14} className="text-accent" /> Apex AI Playground</div>
        <select value={model} onChange={e => setModel(e.target.value)} className="bg-white/10 border border-white/10 rounded-md px-2 py-1 text-xs outline-none">
          <option>Gemini</option>
          <option>GPT-4</option>
        </select>
      </div>
      <div className="rounded-lg bg-white/5 border border-white/10 p-2 text-xs text-white/70 mb-2">Prompt: Build a modern hero with CTA and animation.</div>
      <div className="relative flex-1 rounded-lg bg-black/40 border border-accent/20 p-3 font-mono text-[11px] leading-relaxed text-emerald-300 overflow-hidden">
        <pre className="whitespace-pre-wrap">{text}<span className="animate-pulse">▋</span></pre>
        <div className="absolute bottom-2 right-2 text-[10px] text-white/50">streaming</div>
      </div>
    </div>
  )
}

function WhatsAppPreview() {
  const [typing, setTyping] = useState(true)
  useEffect(() => {
    const id = setTimeout(() => setTyping(false), 1400)
    return () => clearTimeout(id)
  }, [])
  return (
    <div className="rounded-xl border border-white/10 bg-[#0b141a] text-white p-3 h-full min-h-[220px] flex flex-col">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
        <div className="h-7 w-7 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold">AI</div>
        <div className="text-sm font-medium">WhatsApp Bot</div>
        <span className="ml-auto text-[10px] text-emerald-400">online</span>
      </div>
      <div className="space-y-2 text-xs flex-1">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#1f2c34] p-2.5">Hi, how much for a landing page + AI bot?</div>
        {typing ? (
          <div className="max-w-[60%] ml-auto rounded-2xl rounded-tr-sm bg-[#005c4b] p-2.5 text-emerald-100">Typing...</div>
        ) : (
          <div className="max-w-[90%] ml-auto rounded-2xl rounded-tr-sm bg-[#005c4b] p-2.5">
            Landing page + AI bot starts at ₦180k/$120. I can deliver in 5–7 days. Want to book now?
            <div className="mt-1 text-[10px] underline text-emerald-100">Book via WhatsApp →</div>
          </div>
        )}
      </div>
    </div>
  )
}

function InsightDeskPreview() {
  const bars = [35, 55, 45, 70, 60, 85, 78]
  return (
    <div className="rounded-xl border border-black/10 bg-white p-3 h-full min-h-[220px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-ink"><BarChart3 size={14} className="text-accent" /> @InsightDeskHQ Analytics</div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">+12% subs</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5 items-end h-24 mb-3 bg-light rounded-lg p-2 border border-black/5">
        {bars.map((h, i) => <div key={i} className="rounded-t bg-gradient-to-t from-accent to-pink-400" style={{ height: `${h}%` }} />)}
      </div>
      <div className="grid grid-cols-3 gap-2 text-[10px]">
        {['Tech', 'AI', 'Finance'].map(t => (
          <div key={t} className="rounded-md border border-black/10 p-2 bg-light">
            <div className="h-10 rounded bg-gradient-to-br from-dark/80 to-accent/40 mb-1.5" />
            <div className="font-medium text-ink">{t} breakdown</div>
            <div className="text-gray-500">High retention</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScrollShowcasePreview() {
  const ref = useRef(null)
  const [p, setP] = useState({ x: 50, y: 50 })
  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const t = e.touches?.[0]
    const x = ((t ? t.clientX : e.clientX) - r.left) / r.width * 100
    const y = ((t ? t.clientY : e.clientY) - r.top) / r.height * 100
    setP({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }
  const amp = 18 + p.y * 0.25
  const freq = 1.2 + p.x * 0.02
  const phase = p.x * 1.2
  const path = Array.from({ length: 12 }).map((_, i) => {
    const x = i * 100
    const y = 70 + Math.sin((i / freq) + phase / 20) * amp
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
  return (
    <div ref={ref} onMouseMove={onMove} onTouchMove={onMove} className="rounded-xl border border-black/10 bg-[#0f1118] text-white p-3 h-full min-h-[220px] overflow-hidden relative">
      <div className="flex items-center justify-between text-xs mb-2"><span className="flex items-center gap-2"><Zap size={14} className="text-accent" /> Kinetic Visualizer</span><span className="text-white/50">hover / touch</span></div>
      <svg viewBox="0 0 1100 180" className="w-full h-28">
        <path d={path} fill="none" stroke="#E11D48" strokeWidth="4" />
        <path d={path} fill="none" stroke="#fb7185" strokeWidth="10" opacity="0.25" />
        <circle cx={p.x * 11} cy={70 + Math.sin((p.x/20)) * amp} r={18 + (p.y/10)} fill="#E11D48" opacity="0.25" />
        <rect x={p.x * 9} y={20} width={40 + p.y/2} height={40 + p.y/2} rx="10" fill="#67e8f9" opacity="0.18" transform={`rotate(${p.x/2} ${p.x*9} 40)`} />
      </svg>
      <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] text-white/70">
        <div className="rounded bg-white/5 border border-white/10 p-2">Amplitude: {Math.round(amp)}</div>
        <div className="rounded bg-white/5 border border-white/10 p-2">Flow: {freq.toFixed(2)}</div>
        <div className="rounded bg-white/5 border border-white/10 p-2">Morph: {Math.round(p.x)}%</div>
      </div>
    </div>
  )
}

function SecAuditPreview() {
  const lines = [
    { t: '[SCAN] Initializing SecAudit engine...', c: 'text-cyan-300' },
    { t: '[OK] SSL/TLS Hardened', c: 'text-emerald-400' },
    { t: '[OK] Secure headers & CSP validated', c: 'text-emerald-400' },
    { t: '[WARN] IDOR / XSS Vector Patched', c: 'text-amber-300' },
    { t: '[OK] Auth/session controls verified', c: 'text-emerald-400' },
    { t: '[OK] OWASP Top 10 Audit Passed', c: 'text-emerald-400' },
    { t: '[INFO] Remediation report generated', c: 'text-cyan-300' },
  ]
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(0)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setCount(i)
      if (i >= lines.length) clearInterval(id)
    }, 450)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-[#050b0a] text-white p-3 h-full min-h-[220px] font-mono">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-emerald-300"><Shield size={14} className="text-emerald-400" /> SecAudit Terminal</div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">0 Critical Vulnerabilities</span>
      </div>
      <div className="rounded-lg bg-black/50 border border-white/10 p-3 text-[11px] leading-relaxed space-y-1.5 min-h-[150px]">
        {lines.slice(0, count).map((l, i) => <div key={i} className={l.c}>{l.t}</div>)}
        {count < lines.length && <div className="text-emerald-200/70 animate-pulse">▌ scanning...</div>}
      </div>
      <div className="mt-2 flex gap-2 text-[10px] text-white/60">
        <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Pentest</span>
        <span className="px-2 py-1 rounded bg-white/5 border border-white/10">AppSec</span>
        <span className="px-2 py-1 rounded bg-white/5 border border-white/10">OWASP Top 10</span>
      </div>
    </div>
  )
}

function DeviceFrame({ dark, title }) {
  const isSpa = title.includes('Stellbeauty')
  const isAuto = title.includes('Auto Doctor')
  return (
    <div className={`relative rounded-2xl border ${dark ? 'border-white/10 bg-[#111827]' : 'border-black/10 bg-[#f8fafc]'} p-3 md:p-4 overflow-hidden`}>
      <div className="flex items-center gap-1.5 mb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <div className={`ml-3 h-5 flex-1 rounded-full ${dark ? 'bg-white/10' : 'bg-black/5'}`} />
      </div>
      <div className={`rounded-xl overflow-hidden border ${dark ? 'border-white/10 bg-[#0b1220]' : 'border-black/10 bg-white'}`}>
        <div className={`h-28 md:h-32 ${isSpa ? 'bg-gradient-to-br from-[#f5d0c5] via-[#fff1ec] to-[#fde68a]/40' : isAuto ? 'bg-gradient-to-br from-[#0f172a] via-[#1d4ed8]/40 to-[#111827]' : 'bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900'} relative`}>
          <div className="absolute inset-0 flex items-end p-4">
            <div>
              <div className={`text-xs uppercase tracking-[0.2em] mb-1 ${isSpa ? 'text-[#7c2d12]/70' : 'text-white/60'}`}>{isSpa ? 'Luxury Wellness' : isAuto ? 'Car Repair & Diagnostics' : 'Photography Studio'}</div>
              <div className={`font-display text-xl md:text-2xl font-bold ${isSpa ? 'text-[#431407]' : 'text-white'}`}>{isSpa ? 'Stellbeauty' : isAuto ? 'Auto Doctor' : 'Ivory Lens'}</div>
            </div>
          </div>
        </div>
        <div className={`p-3 grid grid-cols-3 gap-2 ${dark ? 'bg-[#0b1220]' : 'bg-white'}`}>
          {[0,1,2].map(i => (
            <div key={i} className={`h-14 rounded-lg ${isSpa ? ['bg-[#fde7df]','bg-[#fce7f3]','bg-[#fef3c7]'][i] : isAuto ? ['bg-blue-500/20','bg-emerald-500/20','bg-slate-700'][i] : ['bg-slate-700','bg-slate-600','bg-slate-800'][i]}`} />
          ))}
        </div>
        <div className="p-3 pt-0">
          <div className={`rounded-lg px-3 py-2 text-xs font-semibold text-center ${isSpa ? 'bg-[#7c2d12] text-white' : isAuto ? 'bg-blue-600 text-white' : 'bg-white text-slate-900'}`}>
            {isSpa ? 'Book Appointment' : isAuto ? 'Book Repair Now' : 'Schedule Session'}
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 shadow">{isAuto ? '5.0★ Proof' : 'Mobile-Ready'}</div>
    </div>
  )
}

function ApexOSPreview() {
  return (
    <div className="rounded-xl border border-[#38bdf8]/20 bg-[#05080f] text-white p-3 h-full min-h-[260px] overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-[#93c5fd]"><Code size={14} className="text-[#38bdf8]" /> ApexOS Desktop</div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/20">Live Environment</span>
      </div>
      <div className="relative rounded-lg border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] h-[210px] overflow-hidden">
        <div className="absolute top-3 left-3 w-[62%] rounded-lg border border-white/10 bg-[#111827]/95 shadow-xl">
          <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-white/10">
            <span className="h-2 w-2 rounded-full bg-red-400" /><span className="h-2 w-2 rounded-full bg-amber-400" /><span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="ml-2 text-[10px] text-white/60">Apex AI</span>
          </div>
          <div className="p-2 space-y-1.5">
            <div className="h-2 rounded bg-white/10 w-3/4" />
            <div className="h-2 rounded bg-[#38bdf8]/30 w-full" />
            <div className="h-2 rounded bg-white/10 w-5/6" />
          </div>
        </div>
        <div className="absolute bottom-10 right-3 w-[45%] rounded-lg border border-[#38bdf8]/20 bg-[#0b1220]/95 shadow-xl">
          <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-white/10">
            <span className="h-2 w-2 rounded-full bg-red-400" /><span className="h-2 w-2 rounded-full bg-amber-400" /><span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="ml-2 text-[10px] text-white/60">Terminal</span>
          </div>
          <div className="p-2 font-mono text-[10px] text-emerald-300 space-y-1">
            <div>$ apex run</div>
            <div className="text-[#38bdf8]">sandbox: ready</div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-8 bg-black/40 border-t border-white/10 flex items-center px-3 gap-2">
          {['AI','Files','Code','Web'].map(a => <span key={a} className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70">{a}</span>)}
        </div>
      </div>
    </div>
  )
}

function ApexAiPreview() {
  const [text, setText] = useState('')
  const full = 'Routing prompt → Gemini + Workers AI...\n✓ Workflow generated\n✓ Response streamed\n✓ Ready to deploy'
  useEffect(() => {
    setText('')
    let i = 0
    const id = setInterval(() => { i += 2; setText(full.slice(0, i)); if (i >= full.length) clearInterval(id) }, 28)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="rounded-xl border border-white/10 bg-[#0b0f17] text-white p-3 h-full min-h-[260px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-white/70"><Zap size={14} className="text-accent" /> The Apex Ai⚡</div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-accent/15 text-accent border border-accent/20">Multi-provider</span>
      </div>
      <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-xs text-white/70 mb-2">Prompt: Build a customer support workflow for my business.</div>
      <div className="relative flex-1 rounded-lg bg-black/40 border border-accent/20 p-3 font-mono text-[11px] leading-relaxed text-emerald-300 overflow-hidden">
        <pre className="whitespace-pre-wrap">{text}<span className="animate-pulse">▋</span></pre>
      </div>
    </div>
  )
}

function ProjectPreview({ title }) {
  if (title === 'Apex AI') return <ApexPreview />
  if (title === 'ApexOS — Interactive Web Desktop Environment') return <ApexOSPreview />
  if (title === 'The Apex Ai⚡') return <ApexAiPreview />
  if (title === 'WhatsApp AI Auto-Reply Bot') return <WhatsAppPreview />
  if (title === 'The Insight Desk (@InsightDeskHQ)') return <InsightDeskPreview />
  if (title === 'SecAudit // Vulnerability & Pentest Suite') return <SecAuditPreview />
  if (title.includes('Stellbeauty')) return <DeviceFrame dark={false} title={title} />
  if (title.includes('Auto Doctor')) return <DeviceFrame dark={true} title={title} />
  return <ScrollShowcasePreview />
}

export default function App() {
  const [route, setRoute] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({ name: '', businessType: '', contact: '', details: '' })
  const [sending, setSending] = useState(false)
  const toastTimer = useRef(null)
  const [showIntro, setShowIntro] = useState(true)

  const filteredProjects = useMemo(() => activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter), [activeFilter])

  const navigate = (id) => {
    setRoute(id)
    setMenuOpen(false)
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const openWhatsApp = () => {
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')
  }

  const showToast = (type, message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ type, message })
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  const [formStatus, setFormStatus] = useState(null)
  const submitContact = async (e) => {
    e.preventDefault()
    if (sending) return
    setSending(true)
    setFormStatus(null)
    try {
      const contact = form.contact.trim()
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
      const payload = {
        name: form.name.trim(),
        email: isEmail ? contact : 'quickquote@drippydee.com',
        message: `Business Type: ${form.businessType}\nWhatsApp/Email: ${contact}\n\nProject Details:\n${form.details}`,
      }
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const text = await res.text()
      let data = {}
      try { data = text ? JSON.parse(text) : {} } catch { data = {} }
      if (!res.ok || data.ok === false) throw new Error(data.error || 'Failed to send message')
      setForm({ name: '', businessType: '', contact: '', details: '' })
      const msg = data.message || "Message sent! I'll reply within 24 hours."
      setFormStatus({ type: 'success', message: msg })
      showToast('success', msg)
    } catch (err) {
      const msg = err?.message || 'Something went wrong. Please try again or chat on WhatsApp.'
      setFormStatus({ type: 'error', message: msg })
      showToast('error', msg)
    } finally {
      setSending(false)
    }
  }

  const appRef = useRef(null)

  useGSAP(() => {
    const batch = (selector, stagger) => {
      ScrollTrigger.batch(selector, {
        start: 'top 88%',
        once: true,
        onEnter: (elements) => gsap.fromTo(elements, { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.75, stagger, ease: 'power2.out', overwrite: true }),
      })
    }
    batch('.reveal-role', 0.12)
    batch('.reveal-project', 0.14)
    batch('.reveal-package', 0.12)
    batch('.reveal-blog', 0.1)
  }, { scope: appRef })

  return (
    <div ref={appRef} className="min-h-screen bg-light text-ink overflow-x-hidden">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="fixed top-4 left-0 right-0 z-[60] px-4">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-full border border-white/10 bg-dark/70 backdrop-blur-md text-white shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16">
              <button onClick={() => navigate('home')} className="font-display font-bold tracking-tight text-lg">Drippy Dee</button>
              <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
                {navLinks.map(link => (
                  <button key={link.id} onClick={() => navigate(link.id)} className={`hover:text-white transition ${route === link.id ? 'text-white' : ''}`}>{link.label}</button>
                ))}
              </nav>
              <div className="hidden md:block">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openWhatsApp} className="inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accentHover px-4 py-2 text-sm font-semibold transition">Work with me <ArrowRight size={16} /></motion.button>
              </div>
              <button className="md:hidden p-2" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
                {menuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
          {menuOpen && (
            <div className="md:hidden mt-2 rounded-2xl border border-white/10 bg-[#160D11] px-4 py-3 flex flex-col gap-2 text-sm shadow-xl">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => navigate(link.id)} className="text-left py-2 text-white/90">{link.label}</button>
              ))}
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openWhatsApp} className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-accent hover:bg-accentHover px-4 py-2 font-semibold">Work with me</motion.button>
            </div>
          )}
        </div>
      </div>

      {showIntro && <EntryIntro onComplete={() => setShowIntro(false)} />}
      <Section id="home" className="relative z-20 overflow-x-hidden overflow-y-visible bg-[#160D11] text-white min-h-screen pt-28 md:pt-32 pb-10 md:pb-14">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E0F15] to-[#160D11]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid lg:grid-cols-[1fr_auto_1fr] items-center gap-8 lg:gap-6 min-h-[70vh]">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="order-2 lg:order-1 text-center lg:text-left">
              <p className="text-accent font-semibold tracking-wide uppercase text-sm md:text-base mb-3">Drippy Dee · Web Designer & Developer</p>
              <h1 className="font-display font-bold leading-[0.95] tracking-tight text-[2.5rem] sm:text-[3.4rem] md:text-[4.2rem] lg:text-[4.8rem]">
                <span className="block">Websites that get</span>
                <span className="block text-accent">more clients</span>
                <span className="block">&amp; bookings.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-white/75 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Fast, custom, mobile-first websites built to turn your TikTok and Instagram traffic into real inquiries. <span className="text-white font-semibold">Delivered in 48–72 hours. Zero bloat.</span>
              </p>
              <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start">
                <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('projects')} className="inline-flex items-center justify-center gap-2 rounded-full bg-accent hover:bg-accentHover px-7 py-3.5 font-semibold shadow-lg shadow-accent/30 transition">View Live Work <ArrowRight size={18} /></motion.button>
                <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('contact')} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 hover:border-accent/60 hover:bg-white/5 px-7 py-3.5 font-semibold transition text-white">Book a Website <Mail size={18} /></motion.button>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-7 py-3.5 font-semibold transition text-emerald-300">Chat on WhatsApp <ExternalLink size={16} /></a>
              </div>
              <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3 text-xs sm:text-sm text-white/60">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5"><CheckCircle2 size={14} className="text-accent" /> Mobile-first design</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5"><CheckCircle2 size={14} className="text-accent" /> 48–72 hour delivery</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5"><CheckCircle2 size={14} className="text-accent" /> Built to convert</span>
              </div>
            </motion.div>

            <div className="order-1 lg:order-2 flex justify-center">
              <HangingBadge />
            </div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="order-3 hidden lg:block text-right">
              <div className="inline-flex flex-col gap-4 text-left max-w-xs ml-auto">
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
                  <p className="text-xs uppercase tracking-wider text-white/50 mb-2">Perfect for</p>
                  <ul className="space-y-2 text-sm text-white/85">
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" /> Spas, salons & local services</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" /> Creators & personal brands</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" /> Studios & portfolios</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-[#38bdf8]/20 bg-[#38bdf8]/5 p-5">
                  <p className="text-xs uppercase tracking-wider text-[#38bdf8]/80 mb-2">Also building</p>
                  <p className="text-sm text-white/85">ApexOS & Apex AI — flagship engineering systems showcased below.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="relative mt-12 border-y border-white/10 bg-black/20 overflow-hidden">
          <div className="marquee-track py-4 flex w-max items-center gap-8 text-sm md:text-base font-medium text-white/80">
            {[...techStack, ...techStack].map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center gap-3 whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-accent inline-block" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section id="about" className="bg-light py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative px-2 sm:px-0">
              <div className="relative mx-auto max-w-md aspect-[4/5] rounded-3xl bg-white border border-black/5 shadow-xl overflow-hidden">
                {hasProfilePhoto ? (
                  <img src={PROFILE_PHOTO} alt="Drippy Dee" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-dark/10 flex items-center justify-center">
                    <div className="h-28 w-28 rounded-2xl bg-dark text-white flex items-center justify-center font-display text-4xl font-bold">DD</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 backdrop-blur px-4 py-3 border border-black/5">
                  <p className="font-display text-lg font-semibold">Daniel Adegoke Akinpelu</p>
                  <p className="text-sm text-gray-600">Drippy Dee</p>
                </div>
              </div>
              <div className="absolute -top-3 left-2 md:left-4 bg-white border border-black/5 shadow-md rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium">Web Dev & AppSec</div>
              <div className="absolute top-10 right-2 md:right-2 bg-dark text-white rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium">Ethical Hacker</div>
              <div className="absolute -bottom-3 left-6 sm:left-8 bg-accent text-white rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium">Content Creator</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}>
              <p className="text-accent font-semibold mb-3">About</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-5">Building sharp digital experiences with code, AI, and creativity.</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                I’m <span className="font-semibold text-ink">Daniel Adegoke Akinpelu</span> (aka <span className="font-semibold text-ink">Drippy Dee</span>) — <span className="font-semibold text-ink">Founder &amp; Lead Architect of the Apex Ecosystem and ApexOS</span>, a Web Developer, Ethical Hacker &amp; Cybersecurity Expert, AI &amp; Automation Builder, and Digital Content Creator based in Ibadan / Ile-Ife, NG. I craft modern web products, automate workflows with intelligent systems, and architect privacy-first edge infrastructure — including a lightweight operating system, edge AI router, encrypted vault, and productivity suite built for independent hardware and sovereign users — while creating engaging content that breaks down tech, finance, and digital culture.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-3 py-1.5"><MapPin size={14} className="text-accent"/> Ibadan / Ile-Ife, NG</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-3 py-1.5"><Sparkles size={14} className="text-accent"/> Fast, modern, reliable</span>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {roles.map((role, i) => (
              <motion.div key={role} whileHover={{ y: -4, scale: 1.01 }} className="reveal-role group rounded-2xl border border-black/10 bg-white p-5 shadow-sm hover:shadow-lg hover:border-accent/40 transition">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Role 0{i + 1}</p>
                <h3 className="font-display text-xl md:text-2xl font-bold group-hover:text-accent transition">{role}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>


      <Section id="ecosystem" className="bg-[#07090e] text-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10">
            <p className="text-[#38bdf8] font-semibold mb-2">Apex Ecosystem</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Core Apex Ecosystem &amp; ApexOS</h2>
            <p className="text-gray-400 mt-4 max-w-3xl text-lg leading-relaxed">A unified stack of edge-native AI, secure productivity, and operating system components designed for privacy, speed, and sovereignty.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {apexEcosystem.map((item) => (
              <article key={item.name} className="flex flex-col rounded-2xl border border-white/10 bg-[#0f131c] p-6 shadow-sm hover:border-[#38bdf8]/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white leading-snug">{item.name}</h3>
                  <ApexStatusBadge status={item.status} />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-400 flex-1">{item.description}</p>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#38bdf8] hover:text-sky-300">
                    Visit {item.name.replace(' (IDE)', '')} <ExternalLink size={14} />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
          <div className="mt-14 border-t border-white/10 pt-10">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-6">Technical Stack</h3>
            <div className="flex flex-wrap gap-3">
              {apexStack.map((item) => (
                <span key={item} className="inline-flex items-center rounded-full border border-white/10 bg-[#0f131c] px-4 py-2 text-sm text-gray-200">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="projects" className="bg-[#F2ECEA] py-16 md:py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-3xl mb-12">
            <p className="text-accent font-semibold mb-2">Live Work & Flagship Builds</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">Websites that convert. Systems that impress.</h2>
            <p className="mt-4 text-gray-700 text-lg">Client-ready business designs for fast bookings, plus flagship engineering projects that prove serious technical depth.</p>
          </div>

          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-bold">01</span>
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold">Client Concepts</h3>
                <p className="text-gray-600 text-sm">Designed to turn social media visitors into paying customers.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {clientProjects.map((p) => (
                <article key={p.title} className={`reveal-project group rounded-3xl overflow-hidden border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${p.dark ? 'bg-cardDark text-white border-white/10' : 'bg-white text-ink border-black/10'}`}>
                  <div className="p-4 md:p-5">
                    <DeviceFrame dark={p.dark} title={p.title} />
                  </div>
                  <div className="p-6 md:p-7 pt-0 md:pt-0">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold">Mobile-Ready</span>
                      {p.tags.filter(t => t !== 'Mobile-Ready').map(t => <span key={t} className={`text-xs px-2.5 py-1 rounded-full border ${p.dark ? 'border-white/15 bg-white/5 text-white/80' : 'border-black/10 bg-light text-gray-700'}`}>{t}</span>)}
                    </div>
                    <h4 className="font-display text-2xl font-bold mb-2">{p.title}</h4>
                    <p className={`${p.dark ? 'text-white/75' : 'text-gray-700'} mb-5 leading-relaxed`}>{p.desc}</p>
                    <div className="flex flex-wrap gap-3">
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold transition ${p.dark ? 'bg-white text-ink hover:bg-gray-100' : 'bg-accent text-white hover:bg-accentHover'}`}>
                        View Live Demo <ExternalLink size={15} />
                      </a>
                      <button onClick={() => setSelectedProject(p)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold border transition ${p.dark ? 'border-white/20 hover:bg-white/10' : 'border-black/10 hover:border-accent/40 hover:text-accent'}`}>
                        Project Details
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#38bdf8]/15 text-[#38bdf8] font-bold">02</span>
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold">Flagship Engineering</h3>
                <p className="text-gray-600 text-sm">Deep technical builds that show what’s possible beyond templates.</p>
              </div>
            </div>
            <div className="space-y-6">
              {flagshipProjects.map((p) => (
                <article key={p.title} className={`reveal-project rounded-3xl overflow-hidden border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${p.dark ? 'bg-[#0b0f17] text-white border-[#38bdf8]/20' : 'bg-white text-ink border-black/10'} ${p.featured ? 'ring-1 ring-[#38bdf8]/30' : ''}`}>
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="p-6 md:p-8 lg:p-10">
                      {p.featured && <span className="inline-flex items-center rounded-full bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 px-3 py-1 text-xs font-semibold mb-4">Flagship Spotlight</span>}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.tags.map(t => <span key={t} className={`text-xs px-2.5 py-1 rounded-full border ${p.dark ? 'border-[#38bdf8]/25 bg-[#38bdf8]/10 text-[#93c5fd]' : 'border-black/10 bg-light text-gray-700'}`}>{t}</span>)}
                      </div>
                      <h4 className="font-display text-2xl md:text-3xl font-bold mb-3">{p.title}</h4>
                      <p className={`${p.dark ? 'text-white/75' : 'text-gray-700'} mb-6 leading-relaxed`}>{p.desc}</p>
                      <div className="flex flex-wrap gap-3">
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold transition ${p.dark ? 'bg-[#38bdf8] text-[#07090e] hover:bg-sky-300' : 'bg-accent text-white hover:bg-accentHover'}`}>
                          {p.ctaLabel || 'View Live Project'} <ExternalLink size={15} />
                        </a>
                        <button onClick={() => setSelectedProject(p)} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold border transition ${p.dark ? 'border-white/20 hover:bg-white/10' : 'border-black/10 hover:border-accent/40 hover:text-accent'}`}>
                          Case Study
                        </button>
                      </div>
                    </div>
                    <div className="p-4 md:p-6 bg-black/10">
                      <ProjectPreview title={p.title} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="reviews" className="bg-light py-16 md:py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-10">
            <p className="text-accent font-semibold mb-2">Reviews</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">What collaborators say</h2>
          </div>
          <div className="relative mx-auto max-w-5xl">
            <div className="hidden md:block absolute -left-4 top-8 rotate-[-6deg] bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium shadow">Fast & reliable delivery</div>
            <div className="hidden md:block absolute -right-6 top-24 rotate-[5deg] bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium shadow">Clean modern UI</div>
            <div className="hidden md:block absolute -left-8 bottom-20 rotate-[4deg] bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium shadow">Problem solver</div>
            <div className="hidden md:block absolute -right-4 bottom-10 rotate-[-4deg] bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium shadow">Attention to detail</div>

            <div className="mx-auto max-w-sm rounded-[2rem] border border-black/10 bg-white shadow-2xl overflow-hidden">
              <div className="bg-dark text-white px-5 py-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center font-bold">DD</div>
                <div>
                  <p className="font-semibold leading-tight">Drippy Dee</p>
                  <p className="text-xs text-white/70">Project chat</p>
                </div>
              </div>
              <div className="p-4 space-y-3 bg-[#F7F3F1] min-h-[360px]">
                <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white p-3 text-sm shadow-sm">Hey! Loved how fast you delivered the landing page and fixed issues on the go.</div>
                <div className="max-w-[85%] ml-auto rounded-2xl rounded-tr-md bg-accent text-white p-3 text-sm shadow-sm">Appreciate it! I focus on clean UI and quick iteration so we can ship confidently.</div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white p-3 text-sm shadow-sm">The UI feels modern and the automation flow works smoothly. Great problem-solving.</div>
                <div className="max-w-[85%] ml-auto rounded-2xl rounded-tr-md bg-dark text-white p-3 text-sm shadow-sm">Glad it helped. Want to start your project?</div>
                <button onClick={openWhatsApp} className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accentHover text-white py-3 font-semibold transition">Book a call / Start a project <ArrowRight size={16} /></button>
              </div>
            </div>
            <div className="mt-6 flex md:hidden flex-wrap justify-center gap-2">
              {['Fast & reliable delivery','Clean modern UI','Problem solver','Attention to detail'].map((t,i)=>(
                <span key={t} className={`px-3 py-1.5 rounded-full text-sm ${['bg-pink-100 text-pink-700','bg-amber-100 text-amber-700','bg-emerald-100 text-emerald-700','bg-sky-100 text-sky-700'][i]}`}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {route === 'creator' && (
        <Section id="creator" className="bg-light">
          <div className="bg-dark text-white overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
              <p className="text-accent font-semibold mb-3">Creator & Media</p>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] mb-4">CONTENT CREATOR</h1>
              <p className="text-white/75 text-lg md:text-xl max-w-3xl">Creating engaging tech, finance, and gaming breakdowns for <span className="text-white font-semibold">@InsightDeskHQ</span> & <span className="text-white font-semibold">Drippy Dee</span> — blending clarity, storytelling, and practical value.</p>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20">
            <div className="grid md:grid-cols-3 gap-5 mb-14">
              {packages.map(pkg => (
                <div key={pkg.name} className={`reveal-package rounded-2xl border p-6 ${pkg.featured ? 'bg-dark text-white border-dark shadow-xl scale-[1.01]' : 'bg-white border-black/10'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-2xl font-bold">{pkg.name}</h3>
                    {pkg.featured && <span className="text-xs bg-accent text-white px-2.5 py-1 rounded-full">Popular</span>}
                  </div>
                  <p className={`font-semibold mb-4 ${pkg.featured ? 'text-white/90' : 'text-accent'}`}>{pkg.price}</p>
                  <ul className="space-y-2 text-sm">
                    {pkg.perks.map(perk => <li key={perk} className="flex gap-2"><CheckCircle2 size={16} className="text-accent mt-0.5" /> <span className={pkg.featured ? 'text-white/85' : 'text-gray-700'}>{perk}</span></li>)}
                  </ul>
                </div>
              ))}
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">How Booking Works</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Share your goal & audience', 'Pick a package or custom scope', 'Create, review, and refine', 'Publish-ready delivery'].map((step, i) => (
                  <div key={step} className="rounded-2xl bg-white border border-black/10 p-5">
                    <div className="h-9 w-9 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center mb-3">{i + 1}</div>
                    <p className="font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      )}

      {route === 'blog' && (
        <Section id="blog" className="bg-light py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-10">
              <p className="text-accent font-semibold mb-2">Blog</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold">Tech Life & The Twist</h1>
              <p className="text-gray-700 mt-3 max-w-2xl">Stories from building AI apps, web projects, and automation — plus the twists of student life, balance, and creativity.</p>
            </div>
            {['Tech Life', 'The Twist'].map(cat => (
              <div key={cat} className="mb-10">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">{cat}</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {blogPosts.filter(p => p.category === cat).map(post => (
                    <button key={post.title} onClick={() => setSelectedPost(post)} className="reveal-blog text-left rounded-2xl bg-white border border-black/10 p-6 hover:shadow-lg hover:border-accent/30 transition">
                      <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full mb-3">{post.category}</span>
                      <h3 className="font-display text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-700">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold mt-4 text-ink">Read article <ArrowRight size={15} /></span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section id="process" className="bg-light py-16 md:py-20 border-y border-black/5">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-accent font-semibold mb-2">How It Works</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">From idea to bookings in 3 simple steps</h2>
            <p className="mt-4 text-gray-700">A clear, fast process built for busy business owners.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Share Your Business & Vision', desc: 'Send your business details, goals, references, and what you want customers to do — book, call, or buy.', icon: Mail },
              { step: '02', title: 'Fast Custom Build (48–72 Hours)', desc: 'I design and build a clean, mobile-first website tailored to your brand with zero bloat and fast load times.', icon: Zap },
              { step: '03', title: 'Launch & Start Getting Bookings', desc: 'We go live with clear CTAs, WhatsApp/contact flow, and a site ready to convert visitors into real customers.', icon: CheckCircle2 },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="reveal-package relative rounded-2xl bg-white border border-black/10 p-6 md:p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent font-display font-bold">{step}</span>
                  <Icon size={22} className="text-accent" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-700 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="contact" className="bg-dark text-white rounded-t-[2rem] md:rounded-t-[3rem] mt-8">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-accent font-semibold mb-3">Quick Quote</p>
              <h2 className="font-display text-4xl md:text-6xl font-bold leading-[0.95] mb-5">Ready for more bookings?</h2>
              <p className="text-white/75 text-lg max-w-xl">Tell me about your business and I’ll send you a clear plan for a fast, mobile-first website that converts your social traffic into customers.</p>
              <div className="mt-8 grid gap-3">
                <div className="flex items-center gap-3 text-white/85"><CheckCircle2 size={18} className="text-accent shrink-0" /> Fast 48–72 hour delivery</div>
                <div className="flex items-center gap-3 text-white/85"><CheckCircle2 size={18} className="text-accent shrink-0" /> Mobile-first, conversion-focused design</div>
                <div className="flex items-center gap-3 text-white/85"><CheckCircle2 size={18} className="text-accent shrink-0" /> Easy WhatsApp booking flow</div>
              </div>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#052e16] px-6 py-3.5 font-semibold transition shadow-lg shadow-emerald-500/20">
                Chat on WhatsApp <ExternalLink size={16} />
              </a>
              <p className="mt-4 text-sm text-white/50">Prefer email? <a href="mailto:iniakinpelu2020@gmail.com" className="underline hover:text-white">iniakinpelu2020@gmail.com</a></p>
            </div>
            <form onSubmit={submitContact} className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm mb-1.5 text-white/80">Name</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-accent" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 text-white/80">Business Type</label>
                  <input required value={form.businessType} onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-accent" placeholder="Spa, studio, restaurant, creator..." />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 text-white/80">WhatsApp or Email</label>
                  <input required value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-accent" placeholder="+234... or you@example.com" />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 text-white/80">Project Details</label>
                  <textarea required rows={4} value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-accent resize-y" placeholder="What do you need? Pages, booking, gallery, timeline..." />
                </div>
                {formStatus && (
                  <div className={`rounded-xl px-4 py-3 text-sm border ${formStatus.type === 'success' ? 'bg-green-500/10 border-green-400/30 text-green-200' : 'bg-red-500/10 border-red-400/30 text-red-200'}`}>
                    {formStatus.message}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" disabled={sending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accentHover disabled:opacity-60 px-5 py-3 font-semibold transition flex-1">
                    {sending ? 'Sending...' : 'Get My Quick Quote'} <Send size={16} />
                  </button>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-emerald-400/50 hover:bg-white/5 px-5 py-3 font-semibold transition text-white">
                    Chat on WhatsApp <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </form>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
            <div className="text-center md:text-left">
              <p>© 2026 Drippy Dee (Daniel Adegoke Akinpelu) — Apex Ecosystem. All rights reserved.</p>
            </div>
            <div className="flex items-center flex-wrap justify-center gap-4">
              <a href={EMAIL_URL} className="hover:text-white inline-flex items-center gap-1"><Mail size={15}/> iniakinpelu2020@gmail.com</a>
              <a href={PROJECT_LINKS.github} target="_blank" rel="noopener noreferrer" className="hover:text-white inline-flex items-center gap-1"><Github size={15}/> GitHub</a>
              <a href={PROJECT_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white inline-flex items-center gap-1"><Linkedin size={15}/> LinkedIn</a>
            </div>
          </div>
        </div>
      </Section>

      <Modal open={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject?.title || ''}>
        {selectedProject && (
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">{selectedProject.caseStudy}</p>
            <div className="flex flex-wrap gap-2">
              {selectedProject.tags.map(t => <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-light border border-black/10">{t}</span>)}
            </div>
            {selectedProject.liveUrl && (
              <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accentHover text-white px-4 py-2 font-semibold transition">
                Open Live Project <ExternalLink size={15} />
              </a>
            )}
            <div className="rounded-xl border border-black/10 p-3 bg-gray-50">
              <ProjectPreview title={selectedProject.title} />
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!selectedPost} onClose={() => setSelectedPost(null)} title={selectedPost?.title || ''}>
        {selectedPost && (
          <article className="space-y-3">
            <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">{selectedPost.category}</span>
            <p className="text-gray-700 leading-relaxed">{selectedPost.body}</p>
          </article>
        )}
      </Modal>
    </div>
  )
}
