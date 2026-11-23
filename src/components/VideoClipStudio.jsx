import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Download, Pause, Play, RefreshCw, Square } from 'lucide-react'

const FORMATS = {
  vertical: { label: '9:16 (Vertical)', width: 1080, height: 1920 },
  square: { label: '1:1 (Square)', width: 1080, height: 1080 },
  landscape: { label: '16:9 (Landscape)', width: 1920, height: 1080 },
}

const PRESETS = [
  {
    id: 'apexos',
    label: 'ApexOS',
    tagline: 'Interactive Web Desktop',
    hook: 'A desktop OS… in your browser.',
    body: 'Draggable windows, multitasking, and sandboxed apps built from scratch with React and TypeScript.',
    cta: 'Launch the live experience.',
    accent: '#38bdf8',
    bgFrom: '#05080f',
    bgTo: '#0b1220',
  },
  {
    id: 'apexai',
    label: 'The Apex Ai⚡',
    tagline: 'Multi-provider AI Workflows',
    hook: 'One platform. Every model.',
    body: 'Fast AI chat and workflows with multi-provider orchestration, built for real production use.',
    cta: 'Try The Apex Ai live.',
    accent: '#E11D48',
    bgFrom: '#160D11',
    bgTo: '#1f2937',
  },
  {
    id: 'stellbeauty',
    label: 'Stellbeauty Massage & Spa',
    tagline: 'Luxury Wellness Website',
    hook: 'Turn scrolls into bookings.',
    body: 'A premium mobile-first spa site with service menus and a seamless appointment booking flow.',
    cta: 'Book your clients in minutes.',
    accent: '#be123c',
    bgFrom: '#431407',
    bgTo: '#7c2d12',
  },
  {
    id: 'ivorylens',
    label: 'Ivory Lens Studio',
    tagline: 'Photography Studio Portfolio',
    hook: 'Showcase every shot beautifully.',
    body: 'Modern galleries and session scheduling designed to convert visitors into booked sessions.',
    cta: 'Book a session today.',
    accent: '#38bdf8',
    bgFrom: '#0f172a',
    bgTo: '#1e293b',
  },
  {
    id: 'drippydee',
    label: 'drippydee.vercel.app',
    tagline: 'Personal Brand & Web Design',
    hook: 'Websites that get clients.',
    body: 'Custom, mobile-first sites delivered in 48–72 hours with zero bloat and clear CTAs.',
    cta: 'Let’s build your site.',
    accent: '#E11D48',
    bgFrom: '#160D11',
    bgTo: '#111827',
  },
]

function pickMime() {
  const candidates = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ]
  for (const type of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(type)) return type
  }
  return ''
}

function wrapLines(ctx, text, maxWidth, maxLines) {
  const words = text.split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
      if (lines.length >= maxLines) break
    } else {
      line = test
    }
  }
  if (lines.length < maxLines && line) lines.push(line)
  if (words.length > 0 && ctx.measureText((lines[lines.length - 1] || '') + '…').width > maxWidth && lines.length > 0) {
    // keep as is
  }
  return lines.slice(0, maxLines)
}

export default function VideoClipStudio() {
  const canvasRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const animRef = useRef(null)
  const startTimeRef = useRef(0)

  const [presetId, setPresetId] = useState(PRESETS[0].id)
  const [formatKey, setFormatKey] = useState('vertical')
  const [durationSec, setDurationSec] = useState(6)
  const [isRecording, setIsRecording] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [downloadExt, setDownloadExt] = useState('webm')
  const [error, setError] = useState('')

  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId) || PRESETS[0], [presetId])
  const format = FORMATS[formatKey]

  const [hookText, setHookText] = useState(preset.hook)
  const [bodyText, setBodyText] = useState(preset.body)
  const [ctaText, setCtaText] = useState(preset.cta)

  useEffect(() => {
    setHookText(preset.hook)
    setBodyText(preset.body)
    setCtaText(preset.cta)
  }, [preset])

  const drawFrame = useCallback((ctx, w, h, t, totalMs) => {
    const p = Math.min(1, Math.max(0, t / totalMs))
    const zoom = 1 + p * 0.12
    const panX = Math.sin(p * Math.PI * 2) * 18
    const panY = Math.cos(p * Math.PI * 2) * 12

    ctx.save()
    ctx.clearRect(0, 0, w, h)

    const grad = ctx.createLinearGradient(0, 0, w, h)
    grad.addColorStop(0, preset.bgFrom)
    grad.addColorStop(1, preset.bgTo)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    ctx.translate(w / 2 + panX, h / 2 + panY)
    ctx.scale(zoom, zoom)
    ctx.translate(-w / 2, -h / 2)

    const isVertical = h >= w
    const padding = Math.round(w * 0.08)
    const maxW = w - padding * 2

    ctx.globalAlpha = 0.18
    ctx.strokeStyle = preset.accent
    ctx.lineWidth = 2
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      const y = h * (0.2 + i * 0.15) + Math.sin(p * Math.PI * 2 + i) * 8
      ctx.moveTo(padding, y)
      ctx.bezierCurveTo(w * 0.4, y - 30, w * 0.6, y + 30, w - padding, y)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    ctx.textBaseline = 'top'
    ctx.fillStyle = preset.accent
    ctx.font = `${Math.round(w * 0.035)}px system-ui, -apple-system, sans-serif`
    ctx.fillText(preset.tagline.toUpperCase(), padding, padding)

    ctx.fillStyle = '#ffffff'
    const hookSize = Math.round(w * (isVertical ? 0.09 : 0.075))
    ctx.font = `700 ${hookSize}px system-ui, -apple-system, sans-serif`
    const hookLines = wrapLines(ctx, hookText || preset.hook, maxW, 3)
    let y = padding + Math.round(h * 0.08)
    for (const line of hookLines) {
      ctx.fillText(line, padding, y)
      y += hookSize * 1.15
    }

    y += Math.round(h * 0.03)
    ctx.fillStyle = 'rgba(255,255,255,0.82)'
    const bodySize = Math.round(w * (isVertical ? 0.045 : 0.038))
    ctx.font = `400 ${bodySize}px system-ui, -apple-system, sans-serif`
    const bodyLines = wrapLines(ctx, bodyText || preset.body, maxW, isVertical ? 5 : 4)
    for (const line of bodyLines) {
      ctx.fillText(line, padding, y)
      y += bodySize * 1.35
    }

    const cta = ctaText || preset.cta
    const ctaSize = Math.round(w * 0.042)
    ctx.font = `600 ${ctaSize}px system-ui, -apple-system, sans-serif`
    const ctaMetrics = ctx.measureText(cta)
    const ctaPadX = Math.round(w * 0.05)
    const ctaPadY = Math.round(h * 0.02)
    const ctaW = ctaMetrics.width + ctaPadX * 2
    const ctaH = ctaSize + ctaPadY * 2
    const ctaX = padding
    const ctaY = Math.min(h - padding - ctaH, y + Math.round(h * 0.06))

    const r = 14
    ctx.fillStyle = preset.accent
    ctx.beginPath()
    ctx.roundRect(ctaX, ctaY, ctaW, ctaH, r)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.fillText(cta, ctaX + ctaPadX, ctaY + ctaPadY * 0.6)

    ctx.restore()

    const barW = w * 0.7
    const barH = Math.max(6, Math.round(h * 0.006))
    const barX = (w - barW) / 2
    const barY = h - padding - barH
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.fillRect(barX, barY, barW, barH)
    ctx.fillStyle = preset.accent
    ctx.fillRect(barX, barY, barW * p, barH)

    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = `${Math.round(w * 0.025)}px system-ui, sans-serif`
    ctx.textBaseline = 'bottom'
    ctx.fillText(`drippydee.vercel.app • ${preset.label}`, padding, h - padding * 0.5)
  }, [preset, hookText, bodyText, ctaText])

  const stopAll = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current)
      animRef.current = null
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop() } catch {}
    }
    setIsPreviewing(false)
    setIsRecording(false)
  }, [])

  useEffect(() => () => stopAll(), [stopAll])

  const renderLoop = useCallback((recording) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const totalMs = durationSec * 1000
    startTimeRef.current = performance.now()

    const frame = (now) => {
      const elapsed = now - startTimeRef.current
      const clamped = Math.min(elapsed, totalMs)
      setProgress(Math.round((clamped / totalMs) * 100))
      drawFrame(ctx, canvas.width, canvas.height, clamped, totalMs)
      if (clamped < totalMs) {
        animRef.current = requestAnimationFrame(frame)
      } else {
        setProgress(100)
        if (recording && mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          try { mediaRecorderRef.current.stop() } catch {}
        }
        setIsPreviewing(false)
        if (!recording) setIsRecording(false)
      }
    }
    animRef.current = requestAnimationFrame(frame)
  }, [durationSec, drawFrame])

  const startPreview = useCallback(() => {
    stopAll()
    setError('')
    setDownloadUrl('')
    setIsPreviewing(true)
    setProgress(0)
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = format.width
      canvas.height = format.height
      renderLoop(false)
    }
  }, [format, renderLoop, stopAll])

  const startRecording = useCallback(async () => {
    stopAll()
    setError('')
    setDownloadUrl('')
    setProgress(0)

    const canvas = canvasRef.current
    if (!canvas) {
      setError('Canvas not ready.')
      return
    }
    canvas.width = format.width
    canvas.height = format.height

    if (typeof canvas.captureStream !== 'function') {
      setError('Your browser does not support canvas recording (captureStream). Try Chrome or Edge.')
      return
    }
    if (typeof MediaRecorder === 'undefined') {
      setError('MediaRecorder is not supported in this browser.')
      return
    }

    const mimeType = pickMime()
    let stream
    try {
      stream = canvas.captureStream(30)
    } catch (e) {
      setError('Could not start screen capture from canvas.')
      return
    }

    chunksRef.current = []
    let recorder
    try {
      recorder = new MediaRecorder(stream, mimeType ? { mimeType, videoBitsPerSecond: 4500000 } : { videoBitsPerSecond: 4500000 })
    } catch (e) {
      try { recorder = new MediaRecorder(stream) } catch (e2) {
        setError('Could not create a MediaRecorder. Try a recent Chrome/Edge/Firefox browser.')
        return
      }
    }
    const actualType = recorder.mimeType || mimeType || 'video/webm'
    setDownloadExt(actualType.includes('mp4') ? 'mp4' : 'webm')

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
    }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: actualType || 'video/webm' })
      const url = URL.createObjectURL(blob)
      setDownloadUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return url
      })
      setIsRecording(false)
      setIsPreviewing(false)
    }
    recorder.onerror = () => {
      setError('Recording failed. Please try again in a supported browser.')
      setIsRecording(false)
      setIsPreviewing(false)
    }

    mediaRecorderRef.current = recorder
    setIsRecording(true)
    setIsPreviewing(true)
    recorder.start(200)
    renderLoop(true)
  }, [format, renderLoop, stopAll])

  const resetTexts = useCallback(() => {
    setHookText(preset.hook)
    setBodyText(preset.body)
    setCtaText(preset.cta)
  }, [preset])

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    }
  }, [downloadUrl])

  const previewStyle = useMemo(() => {
    const aspect = format.width / format.height
    return { aspectRatio: `${format.width} / ${format.height}`, maxHeight: '70vh' }
  }, [format])

  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 items-start">
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-black/5 flex flex-wrap items-center justify-between gap-3 bg-[#F2ECEA]/60">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Preview</p>
              <p className="font-display font-semibold">{format.label} • {durationSec}s clip</p>
            </div>
            <div className="text-sm text-gray-600">{progress}%</div>
          </div>
          <div className="p-4 sm:p-6 bg-[#e9e2df]">
            <div className="mx-auto w-full max-w-[420px] bg-black rounded-xl overflow-hidden shadow-xl" style={previewStyle}>
              <canvas
                ref={canvasRef}
                width={format.width}
                height={format.height}
                className="w-full h-full block"
                aria-label="Video clip preview canvas"
              />
            </div>
          </div>
          <div className="p-4 sm:p-5 flex flex-wrap gap-3 border-t border-black/5">
            <button type="button" onClick={startPreview} disabled={isRecording} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold hover:border-accent/40 transition disabled:opacity-50">
              <Play size={16} /> Preview
            </button>
            {!isRecording ? (
              <button type="button" onClick={startRecording} className="inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accentHover text-white px-4 py-2.5 text-sm font-semibold transition">
                <Square size={16} /> Record & Export
              </button>
            ) : (
              <button type="button" onClick={stopAll} className="inline-flex items-center gap-2 rounded-full bg-dark text-white px-4 py-2.5 text-sm font-semibold transition">
                <Pause size={16} /> Stop
              </button>
            )}
            {downloadUrl && (
              <a href={downloadUrl} download={`drippy-dee-clip-${preset.id}.${downloadExt}`} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-sm font-semibold transition">
                <Download size={16} /> Download .{downloadExt}
              </a>
            )}
          </div>
          {error && <p className="px-4 sm:px-5 pb-4 text-sm text-red-600">{error}</p>}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-sm">
            <h3 className="font-display text-xl font-bold mb-4">Scene Template</h3>
            <div className="grid gap-3">
              <label className="text-sm font-medium text-gray-700">Preset</label>
              <select value={presetId} onChange={(e) => setPresetId(e.target.value)} className="w-full rounded-xl border border-black/10 bg-light px-4 py-3 outline-none focus:border-accent">
                {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label} — {p.tagline}</option>)}
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Format</label>
                <select value={formatKey} onChange={(e) => setFormatKey(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 bg-light px-4 py-3 outline-none focus:border-accent">
                  {Object.entries(FORMATS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Duration</label>
                <select value={durationSec} onChange={(e) => setDurationSec(Number(e.target.value))} className="mt-1.5 w-full rounded-xl border border-black/10 bg-light px-4 py-3 outline-none focus:border-accent">
                  {[4, 5, 6, 8, 10].map((s) => <option key={s} value={s}>{s} seconds</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="font-display text-xl font-bold">Edit Text</h3>
              <button type="button" onClick={resetTexts} className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"><RefreshCw size={14} /> Reset</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Hook</label>
                <input value={hookText} onChange={(e) => setHookText(e.target.value)} maxLength={80} className="mt-1.5 w-full rounded-xl border border-black/10 bg-light px-4 py-3 outline-none focus:border-accent" placeholder="Attention-grabbing opener" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Body</label>
                <textarea value={bodyText} onChange={(e) => setBodyText(e.target.value)} rows={3} maxLength={220} className="mt-1.5 w-full rounded-xl border border-black/10 bg-light px-4 py-3 outline-none focus:border-accent resize-y" placeholder="What you do and why it matters" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">CTA</label>
                <input value={ctaText} onChange={(e) => setCtaText(e.target.value)} maxLength={60} className="mt-1.5 w-full rounded-xl border border-black/10 bg-light px-4 py-3 outline-none focus:border-accent" placeholder="Book a Website / Launch Live OS..." />
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">Runs entirely in your browser (no uploads). Recording quality depends on your device and browser. For best results use Chrome/Edge. Export is WebM (MP4 if your browser supports it).</p>
        </div>
      </div>
    </div>
  )
}
