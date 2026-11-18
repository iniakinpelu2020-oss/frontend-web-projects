const ecosystem = [
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

const stack = [
  'Cloudflare Workers & Pages',
  'Workers AI & Gemini API',
  'Linux Wayland / AOSP',
  'eUICC / LPA eSIM',
  'WebCrypto (AES-GCM)',
  'JavaScript / Python / Rust',
  'SearXNG Self-Hosted',
  'WebCodecs & PWAs',
]

function StatusBadge({ status }) {
  const live = status === 'Live'
  const active = status === 'Active'
  const color = live
    ? 'text-[#38bdf8] border-[#38bdf8]/40 bg-[#38bdf8]/10'
    : active
      ? 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10'
      : 'text-amber-300 border-amber-400/30 bg-amber-400/10'
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${color}`}>
      {status}
    </span>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#07090e] text-gray-200">
      <main>
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.12),_transparent_55%)]" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-3 py-1 text-xs sm:text-sm font-medium text-[#38bdf8]">
                Founder &amp; Systems Architect
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white">
                Daniel Akinpelu <span className="text-[#38bdf8]">(Drippy Dee)</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-gray-300 max-w-2xl">
                Architecting the Apex Ecosystem &amp; ApexOS — a lightweight, privacy-first operating system, edge AI router, encrypted vault, and productivity suite built for independent hardware and sovereign users.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-3">
                <a
                  href="mailto:iniakinpelu2020@gmail.com"
                  className="inline-flex items-center justify-center rounded-lg bg-[#38bdf8] px-5 py-3 text-sm font-semibold text-[#07090e] hover:bg-sky-300 transition-colors"
                >
                  Contact for OEM &amp; Partnerships
                </a>
                <a
                  href="https://apex-ai-9ho.pages.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-[#38bdf8]/40 bg-[#0f131c] px-5 py-3 text-sm font-semibold text-[#38bdf8] hover:bg-[#38bdf8]/10 transition-colors"
                >
                  Launch Apex AI
                </a>
                <a
                  href="https://apexaicoder.pages.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-[#0f131c] px-5 py-3 text-sm font-semibold text-white hover:border-[#38bdf8]/40 hover:text-[#38bdf8] transition-colors"
                >
                  Open Apex Studio
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">Core Apex Ecosystem</h2>
            <p className="mt-3 text-gray-400 max-w-2xl">
              A unified stack of edge-native AI, secure productivity, and operating system components designed for privacy, speed, and sovereignty.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ecosystem.map((item) => (
              <article
                key={item.name}
                className="flex flex-col rounded-xl border border-white/10 bg-[#0f131c] p-6 shadow-sm hover:border-[#38bdf8]/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white leading-snug">{item.name}</h3>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-400 flex-1">{item.description}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center text-sm font-medium text-[#38bdf8] hover:text-sky-300"
                  >
                    Visit {item.name.replace(' (IDE)', '')} →
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#0b0e14]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">Technical Stack</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {stack.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full border border-white/10 bg-[#0f131c] px-4 py-2 text-sm text-gray-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© 2026 Daniel Akinpelu (Drippy Dee) — Apex Ecosystem</p>
          <a href="mailto:iniakinpelu2020@gmail.com" className="text-[#38bdf8] hover:text-sky-300">
            iniakinpelu2020@gmail.com
          </a>
        </div>
      </footer>
    </div>
  )
}
