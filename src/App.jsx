import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Send, Sparkles, Mail, MapPin, Github, Linkedin, Globe, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import HangingBadge from './components/HangingBadge'

const WHATSAPP_URL = 'https://wa.me/2347038273216?text=Hey%20Drippy%20Dee%2C%20I%20want%20to%20work%20with%20you%20on%20a%20project'
const PROFILE_PHOTO = '[PASTE_YOUR_DIRECT_IMAGE_URL_HERE]'
const hasProfilePhoto = PROFILE_PHOTO && !PROFILE_PHOTO.includes('PASTE_YOUR_DIRECT_IMAGE_URL_HERE')

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'creator', label: 'Creator' },
  { id: 'blog', label: 'Blog' },
]

const roles = ['Web Developer', 'AI & Automation Builder', 'Content Creator']

const projects = [
  {
    title: 'Apex AI',
    category: 'Web Dev',
    dark: true,
    desc: 'Custom AI web frontend built with HTML, CSS, JavaScript, and serverless deployment.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Serverless'],
    caseStudy: 'Apex AI delivers a fast, conversational interface with clean UI, streaming-friendly UX patterns, and lightweight deployment for rapid iteration.',
    liveUrl: 'https://apex-ai-9ho.pages.dev',
  },
  {
    title: 'WhatsApp AI Auto-Reply Bot',
    category: 'AI & Bots',
    dark: false,
    desc: 'Automated Node.js + Gemini API WhatsApp integration for smart real-time responses.',
    tags: ['Node.js', 'Gemini API', 'Automation'],
    caseStudy: 'Designed an event-driven bot pipeline that parses incoming messages, routes intents, and responds with context-aware replies while logging interactions.',
  },
  {
    title: 'The Insight Desk (@InsightDeskHQ)',
    category: 'UI/UX',
    dark: true,
    desc: 'Educational & personal finance digital media hub and breakdown platform.',
    tags: ['Content', 'Branding', 'UI/UX'],
    caseStudy: 'Built a content-forward experience focused on clarity, trust, and repeat engagement for tech and finance breakdowns.',
    liveUrl: 'https://youtube.com/@InsightDeskHQ',
  },
  {
    title: 'Interactive Scroll-Render Showcase',
    category: 'HTML/CSS/JS',
    dark: false,
    desc: 'High-FPS SVG filter & scroll-driven product reveal experience.',
    tags: ['SVG', 'Scroll Animations', 'Performance'],
    caseStudy: 'A performance-minded showcase using scroll progress to orchestrate reveals and filters while maintaining smooth 60fps interactions.',
  },
]

const filters = ['All', 'Web Dev', 'AI & Bots', 'HTML/CSS/JS', 'UI/UX']

const blogPosts = [
  { title: 'Building Apex AI: Lessons from a Custom Frontend', category: 'Tech Life', excerpt: 'What I learned designing a fast AI interface with vanilla web tech and serverless deployment.', body: 'From prompt UX to performance budgets, building Apex AI reinforced that clarity and speed matter as much as model quality. I focused on lean UI, resilient API handling, and iteration loops that made shipping improvements easy.' },
  { title: 'Automating WhatsApp Replies with Node.js', category: 'Tech Life', excerpt: 'A practical look at wiring messaging, intent handling, and AI responses together.', body: 'Automation works best when it feels human and reliable. This build combined webhook flows, Gemini-powered responses, and guardrails so replies stayed useful without losing control.' },
  { title: 'Balancing Academics & Building in Public', category: 'The Twist', excerpt: 'How I juggle student life with shipping projects and creating content.', body: 'Structure beats motivation. I plan deep-work blocks, keep scope realistic, and treat every small release as momentum—whether it is code, content, or coursework.' },
  { title: 'From Ideas to Execution: My Creative Process', category: 'The Twist', excerpt: 'Turning scattered inspiration into finished web and content projects.', body: 'I capture ideas quickly, validate them with tiny prototypes, and only scale what proves useful. The twist is consistency: showing up, refining, and publishing.' },
]

const packages = [
  { name: 'Starter', price: '₦', perks: ['1 short-form video/edit', 'Basic script & captions', '1 revision', 'Delivery in 3-5 days'], featured: false },
  { name: 'Pro', price: '₦₦', perks: ['3 content pieces', 'Strategy & hooks', 'Branded visuals', '2 revisions', 'Delivery in 5-7 days'], featured: true },
  { name: 'Custom', price: 'Let’s talk', perks: ['Campaign/content system', 'Tech + creator blend', 'Multi-platform assets', 'Flexible scope & timeline'], featured: false },
]

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

function PreviewFrame({ dark }) {
  return (
    <div className={`rounded-xl border ${dark ? 'border-white/10 bg-black/30' : 'border-black/10 bg-gray-50'} p-3 h-full`}>
      <div className="flex gap-1.5 mb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
      </div>
      <div className="grid grid-cols-3 gap-2 h-40 md:h-48">
        <div className={`col-span-2 rounded-lg ${dark ? 'bg-white/10' : 'bg-white'} border ${dark ? 'border-white/10' : 'border-black/5'} p-3`}>
          <div className={`h-3 w-24 rounded ${dark ? 'bg-white/20' : 'bg-gray-200'} mb-3`} />
          <div className={`h-2 w-full rounded ${dark ? 'bg-white/10' : 'bg-gray-100'} mb-2`} />
          <div className={`h-2 w-5/6 rounded ${dark ? 'bg-white/10' : 'bg-gray-100'} mb-2`} />
          <div className={`h-2 w-2/3 rounded ${dark ? 'bg-white/10' : 'bg-gray-100'} mb-4`} />
          <div className="h-8 w-24 rounded-md bg-accent/80" />
        </div>
        <div className={`rounded-lg ${dark ? 'bg-accent/20' : 'bg-accent/10'} border ${dark ? 'border-accent/30' : 'border-accent/20'} p-3`}>
          <div className="h-full rounded-md bg-gradient-to-b from-accent/40 to-transparent" />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [route, setRoute] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const toastTimer = useRef(null)

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

  const submitContact = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to send message')
      setForm({ name: '', email: '', message: '' })
      showToast('success', data.message || 'Message sent successfully!')
    } catch (err) {
      showToast('error', err.message || 'Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-light text-ink">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="fixed top-4 left-0 right-0 z-50 px-4">
        <div className="mx-auto max-w-6xl rounded-full border border-white/10 bg-dark/70 backdrop-blur-md text-white shadow-lg">
          <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16">
            <button onClick={() => navigate('home')} className="font-display font-bold tracking-tight text-lg">Drippy Dee</button>
            <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => navigate(link.id)} className={`hover:text-white transition ${route === link.id ? 'text-white' : ''}`}>{link.label}</button>
              ))}
            </nav>
            <div className="hidden md:block">
              <button onClick={openWhatsApp} className="inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accentHover px-4 py-2 text-sm font-semibold transition">Work with me <ArrowRight size={16} /></button>
            </div>
            <button className="md:hidden p-2" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-2 text-sm">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => navigate(link.id)} className="text-left py-2 text-white/90">{link.label}</button>
              ))}
              <button onClick={openWhatsApp} className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-accent hover:bg-accentHover px-4 py-2 font-semibold">Work with me</button>
            </div>
          )}
        </div>
      </div>

      <Section id="home" className="relative overflow-hidden bg-dark text-white pt-28 md:pt-32 pb-16 md:pb-24 glow">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)', backgroundSize:'28px 28px'}} />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid lg:grid-cols-[1fr_auto_1fr] items-center gap-8 lg:gap-6 min-h-[70vh]">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="order-2 lg:order-1 text-center lg:text-left">
              <div className="font-display font-bold leading-[0.9] tracking-tight text-[3rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6rem]">
                <div>WEB</div>
                <div className="text-accent">AI &</div>
                <div>CONTENT</div>
              </div>
            </motion.div>

            <div className="order-1 lg:order-2 flex justify-center">
              <HangingBadge />
            </div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="order-3 text-center lg:text-right">
              <div className="font-display font-bold leading-[0.9] tracking-tight text-[3rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6rem]">
                <div>DEVELOPER</div>
                <div className="text-accent">AUTOMATION</div>
                <div>CREATOR</div>
              </div>
            </motion.div>
          </div>
          <div className="mt-8 md:mt-10 flex justify-center">
            <button onClick={openWhatsApp} className="inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accentHover px-7 py-3.5 font-semibold shadow-lg shadow-accent/20 transition">Work with me <ArrowRight size={18} /></button>
          </div>
        </div>
      </Section>

      <Section id="about" className="bg-light py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
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
                  <p className="font-display text-lg font-semibold">Adebisi Daniel Akinpelu</p>
                  <p className="text-sm text-gray-600">Drippy Dee</p>
                </div>
              </div>
              <div className="absolute -top-3 -left-2 md:left-4 bg-white border border-black/5 shadow-md rounded-full px-4 py-2 text-sm font-medium">Full-Stack Web Dev</div>
              <div className="absolute top-10 -right-2 md:right-2 bg-dark text-white rounded-full px-4 py-2 text-sm font-medium">AI & Automation</div>
              <div className="absolute -bottom-3 left-8 bg-accent text-white rounded-full px-4 py-2 text-sm font-medium">Content Creator</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}>
              <p className="text-accent font-semibold mb-3">About</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-5">Building sharp digital experiences with code, AI, and creativity.</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                I’m <span className="font-semibold text-ink">Adebisi Daniel Akinpelu</span> (aka <span className="font-semibold text-ink">Drippy Dee</span>) — a Web Developer, AI & Automation Builder, and Digital Content Creator based in Ibadan / Ile-Ife, NG. I craft modern web products, automate workflows with intelligent systems, and create engaging content that breaks down tech, finance, and digital culture.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-3 py-1.5"><MapPin size={14} className="text-accent"/> Ibadan / Ile-Ife, NG</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-3 py-1.5"><Sparkles size={14} className="text-accent"/> Fast, modern, reliable</span>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {roles.map((role, i) => (
              <motion.div key={role} whileHover={{ y: -4, scale: 1.01 }} className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm hover:shadow-lg hover:border-accent/40 transition">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Role 0{i + 1}</p>
                <h3 className="font-display text-xl md:text-2xl font-bold group-hover:text-accent transition">{role}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="projects" className="bg-[#F2ECEA] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <p className="text-accent font-semibold mb-2">My Projects</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold">Selected work & experiments</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium border transition ${activeFilter === f ? 'bg-accent text-white border-accent' : 'bg-white border-black/10 hover:border-accent/40'}`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {filteredProjects.map((p, idx) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`rounded-3xl overflow-hidden border ${p.dark ? 'bg-cardDark text-white border-white/10' : 'bg-white text-ink border-black/10'} shadow-sm`}>
                <div className="grid md:grid-cols-2 gap-0">
                  <div className={`p-6 md:p-8 lg:p-10 ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.tags.map(t => <span key={t} className={`text-xs px-2.5 py-1 rounded-full border ${p.dark ? 'border-white/15 bg-white/5' : 'border-black/10 bg-light'}`}>{t}</span>)}
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">{p.title}</h3>
                    <p className={`${p.dark ? 'text-white/75' : 'text-gray-700'} mb-6 leading-relaxed`}>{p.desc}</p>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => setSelectedProject(p)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold ${p.dark ? 'bg-white text-ink hover:bg-gray-100' : 'bg-accent text-white hover:bg-accentHover'} transition`}>
                        View Case Study <ArrowRight size={16} />
                      </button>
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold border transition ${p.dark ? 'border-white/20 hover:bg-white/10' : 'border-black/10 hover:border-accent/40 hover:text-accent'}`}>
                          Live Preview <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className={`p-4 md:p-6 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                    <PreviewFrame dark={p.dark} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="reviews" className="bg-light py-16 md:py-24">
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
          <div className="bg-dark text-white glow">
            <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
              <p className="text-accent font-semibold mb-3">Creator & Media</p>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] mb-4">CONTENT CREATOR</h1>
              <p className="text-white/75 text-lg md:text-xl max-w-3xl">Creating engaging tech, finance, and gaming breakdowns for <span className="text-white font-semibold">@InsightDeskHQ</span> & <span className="text-white font-semibold">Drippy Dee</span> — blending clarity, storytelling, and practical value.</p>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20">
            <div className="grid md:grid-cols-3 gap-5 mb-14">
              {packages.map(pkg => (
                <div key={pkg.name} className={`rounded-2xl border p-6 ${pkg.featured ? 'bg-dark text-white border-dark shadow-xl scale-[1.01]' : 'bg-white border-black/10'}`}>
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
                    <button key={post.title} onClick={() => setSelectedPost(post)} className="text-left rounded-2xl bg-white border border-black/10 p-6 hover:shadow-lg hover:border-accent/30 transition">
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

      <Section id="contact" className="bg-dark text-white rounded-t-[2rem] md:rounded-t-[3rem] mt-8">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-accent font-semibold mb-3">Let’s build</p>
              <h2 className="font-display text-4xl md:text-6xl font-bold leading-[0.95] mb-5">Got a project coming up?</h2>
              <p className="text-white/75 text-lg max-w-xl">Tell me about your idea — web app, AI automation, or content collaboration. I’ll get back with next steps.</p>
              <div className="mt-8 space-y-3 text-white/85">
                <div className="flex items-center gap-3"><Mail size={18} className="text-accent" /> Available for freelance & collaborations</div>
                <div className="flex items-center gap-3"><MapPin size={18} className="text-accent" /> Ibadan / Ile-Ife, Nigeria</div>
                <div className="flex items-center gap-3"><Globe size={18} className="text-accent" /> Web, AI & Automation, Content</div>
              </div>
            </div>
            <form onSubmit={submitContact} className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm mb-1.5 text-white/80">Name</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-accent" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 text-white/80">Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-accent" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 text-white/80">Tell me about your project</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-accent resize-y" placeholder="What are you building? Goals, timeline, scope..." />
                </div>
                <button disabled={sending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accentHover disabled:opacity-60 px-5 py-3 font-semibold transition">
                  {sending ? 'Sending...' : 'Send Message'} <Send size={16} />
                </button>
              </div>
            </form>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
            <p>© 2026 Drippy Dee (Adebisi Daniel Akinpelu). All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white inline-flex items-center gap-1"><Github size={15}/> GitHub</a>
              <a href="#" className="hover:text-white inline-flex items-center gap-1"><Linkedin size={15}/> LinkedIn</a>
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
              <PreviewFrame dark={false} />
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
