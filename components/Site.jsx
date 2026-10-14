'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform } from 'framer-motion'

// ---- Edit content here ----
const CO = {
  whatsapp: '910000000000',
  instagram: 'swaramusicacademy',
  address: 'First floor, Building name, Kochi, Kerala',
  hours: 'Mon to Sat, 10 am to 8 pm'
}

const INSTR = [
  ['Piano', 'Ages 5 and up', 'Mon, Wed, Fri evenings', '₹2,500 per month', [261.63, 329.63, 392], 'triangle'],
  ['Guitar', 'Ages 8 and up', 'Tue, Thu, Sat', '₹2,200 per month', [196, 246.94, 293.66, 392], 'triangle'],
  ['Violin', 'Ages 7 and up', 'Mon, Wed', '₹2,800 per month', [293.66, 440, 587.33], 'sawtooth'],
  ['Carnatic vocals', 'All ages', 'Tue, Thu, Sat mornings', '₹1,800 per month', [220, 329.63, 440], 'sine'],
  ['Drums', 'Ages 8 and up', 'Fri, Sat', '₹3,000 per month', [0], 'kick'],
]

const WHITE = [['C', 261.63, 'a'], ['D', 293.66, 's'], ['E', 329.63, 'd'], ['F', 349.23, 'f'], ['G', 392, 'g'], ['A', 440, 'h'], ['B', 493.88, 'j'], ['C', 523.25, 'k']]
const BLACK = [[277.18, 0, 'w'], [311.13, 1, 'e'], [369.99, 3, 't'], [415.3, 4, 'y'], [466.16, 5, 'u']]
const KEYMAP = Object.fromEntries([...WHITE.map((k, i) => [k[2], `w${i}`]), ...BLACK.map((k, i) => [k[2], `b${i}`])])
const FREQ = Object.fromEntries([...WHITE.map((k, i) => [`w${i}`, k[1]]), ...BLACK.map((k, i) => [`b${i}`, k[0]])])
const LABEL = Object.fromEntries(WHITE.map((k, i) => [`w${i}`, k[0]]))

const wa = (t = '') => `https://wa.me/${CO.whatsapp}${t ? `?text=${encodeURIComponent(t)}` : ''}`
const insta = (h = CO.instagram) => `https://instagram.com/${h.replace('@', '')}`

const INSTA_POSTS = [
  {
    id: 'p1',
    img: '/insta-01.jpg',
    category: 'Piano Recital',
    likes: '1,280',
    comments: '46',
    caption: 'Quarterly recital showcase: Aryan (age 9) performing his first Beethoven sonata movement on the grand piano.',
  },
  {
    id: 'p2',
    img: '/insta-02.jpg',
    category: 'Guitar Jam',
    likes: '2,140',
    comments: '63',
    caption: 'Acoustic fingerstyle sessions at sunset. Building muscle memory one clean chord transition at a time.',
  },
  {
    id: 'p3',
    img: '/insta-03.jpg',
    category: 'Violin Masterclass',
    likes: '1,890',
    comments: '52',
    caption: 'Bow posture & string clarity. Watching young violinists discover their unique tone.',
  },
  {
    id: 'p4',
    img: '/insta-04.jpg',
    category: 'Carnatic Vocals',
    likes: '3,420',
    comments: '98',
    caption: 'Morning riyaz with the tanpura. Finding resonance in Mayamalavagowla ragam.',
  },
  {
    id: 'p5',
    img: '/insta-05.jpg',
    category: 'Drum Beats',
    likes: '2,760',
    comments: '81',
    caption: 'Syncopated groove drill in Studio B. Rhythm is not just taught; it is felt.',
  },
  {
    id: 'p6',
    img: '/insta-06.jpg',
    category: 'Ensemble Night',
    likes: '3,950',
    comments: '124',
    caption: 'When individual notes merge into one harmony. Our student ensemble taking the stage together.',
  },
]

// Official Vector Icons
function WhatsAppIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

function InstagramIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

let ctx
function tone(f, type = 'triangle', dur = 1.3) {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime
  o.type = type === 'kick' ? 'sine' : type
  if (type === 'kick') { o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(40, t + .25); dur = .4 } else o.frequency.value = f
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(type === 'sawtooth' ? .12 : .3, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur)
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + .05)
}

function Piano() {
  const box = useRef(null), ptr = useRef(new Map())
  const [down, setDown] = useState({})
  const [ripples, setRipples] = useState([])
  const [last, setLast] = useState(null)
  const strike = (id, el) => {
    tone(FREQ[id]); navigator.vibrate?.(8)
    const r = (el || box.current.querySelector(`[data-note="${id}"]`)).getBoundingClientRect(), b = box.current.getBoundingClientRect()
    const rid = Math.random()
    setRipples((v) => [...v, { id: rid, x: r.left + r.width / 2 - b.left, y: r.top - b.top }]); setTimeout(() => setRipples((v) => v.filter((q) => q.id !== rid)), 1300)
    setLast({ id: rid, t: LABEL[id] || '♯' })
  }
  const set = (id, v) => setDown((d) => ({ ...d, [id]: v }))
  const on = (e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-note]'), n = el?.dataset.note, prev = ptr.current.get(e.pointerId)
    if (n === prev) return
    if (prev) set(prev, 0)
    if (n) { strike(n, el); set(n, 1); ptr.current.set(e.pointerId, n) } else ptr.current.set(e.pointerId, null)
  }
  const off = (e) => { const p = ptr.current.get(e.pointerId); if (p) set(p, 0); ptr.current.delete(e.pointerId) }
  useEffect(() => {
    const kd = (e) => { const id = KEYMAP[e.key]; if (!id || e.repeat || e.metaKey || e.ctrlKey) return; strike(id); set(id, 1) }
    const ku = (e) => { const id = KEYMAP[e.key]; if (id) set(id, 0) }
    addEventListener('keydown', kd); addEventListener('keyup', ku); return () => { removeEventListener('keydown', kd); removeEventListener('keyup', ku) }
  }, [])
  return (
    <div ref={box} onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); ptr.current.set(e.pointerId, null); on(e) }} onPointerMove={(e) => ptr.current.has(e.pointerId) && on(e)} onPointerUp={off} onPointerCancel={off}
      className="relative h-[40dvh] min-h-[230px] touch-none select-none">
      <AnimatePresence>{last && <motion.span key={last.id} initial={{ opacity: .35, scale: .8 }} animate={{ opacity: 0, scale: 1.3 }} transition={{ duration: 1.2 }} className="pointer-events-none absolute -top-[42dvh] left-1/2 -translate-x-1/2 font-display text-[55vw] font-bold leading-none md:text-[28rem]">{last.t}</motion.span>}</AnimatePresence>
      {ripples.map((r) => <motion.span key={r.id} initial={{ scale: 0, opacity: .9 }} animate={{ scale: 9, opacity: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }} className="pointer-events-none absolute -ml-4 -mt-4 h-8 w-8 rounded-full border-2 border-sun" style={{ left: r.x, top: r.y }} />)}
      <div className="flex h-full gap-1">
        {WHITE.map((k, i) => <motion.button key={i} data-note={`w${i}`} aria-label={`Note ${k[0]}`} animate={{ y: down[`w${i}`] ? 8 : 0, backgroundColor: down[`w${i}`] ? '#FFE14D' : '#FFFFFF' }} transition={{ duration: .08 }} className="flex flex-1 items-end justify-center rounded-b-2xl pb-3 font-bold text-navy/50 shadow-[0_8px_0_rgba(10,15,46,.35)]">{k[2].toUpperCase()}</motion.button>)}
      </div>
      {BLACK.map((k, i) => <motion.button key={i} data-note={`b${i}`} aria-label="Sharp note" animate={{ y: down[`b${i}`] ? 6 : 0, backgroundColor: down[`b${i}`] ? '#FFE14D' : '#0A0F2E' }} transition={{ duration: .08 }} className="absolute top-0 z-10 h-[60%] w-[8%] -translate-x-1/2 rounded-b-xl text-xs text-white/40" style={{ left: `${((k[1] + 1) / 8) * 100}%` }} />)}
    </div>
  )
}

function Wave() {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const d = useTransform(p, (v) => { let s = ''; const f = 1.5 + v * 9, a = 18 + Math.sin(v * 6) * 8 + v * 52; for (let x = 0; x <= 800; x += 8) s += `${x ? 'L' : 'M'}${x} ${100 + Math.sin((x / 800) * Math.PI * 2 * f + v * 14) * a} `; return s })
  const label = useTransform(p, (v) => (v < .38 ? 'Week 1' : v < .62 ? 'Month 3' : 'Month 6'))
  return (
    <section ref={ref} className="px-5 py-28 md:px-12">
      <p className="font-display text-sm font-semibold"><motion.span>{label}</motion.span></p>
      <svg viewBox="0 0 800 200" className="mt-4 w-full" aria-hidden><motion.path d={d} fill="none" stroke="#FFE14D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <h2 className="mt-6 max-w-2xl font-display text-5xl font-bold leading-[.95] tracking-tight md:text-8xl">Slow at first. Then it clicks.</h2>
      <p className="mt-6 max-w-md text-xl text-white/80">Small batches, a fixed teacher, and a recital every quarter so every student has something to play toward.</p>
    </section>
  )
}

export default function Site() {
  const [open, setOpen] = useState(0)
  const [who, setWho] = useState(0)
  const [age, setAge] = useState(0)
  const [cta, setCta] = useState(false)

  useEffect(() => {
    const f = () => setCta(scrollY > 500)
    addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])

  const pick = (i) => {
    setOpen(open === i ? -1 : i)
    const [, , , , ch, ty] = INSTR[i]
    ch.forEach((f, k) => setTimeout(() => tone(f, ty, ty === 'sine' ? 1.8 : 1.1), k * 90))
  }

  return (
    <MotionConfig reducedMotion="user">
      {/* Hero Header & Piano */}
      <section className="flex min-h-[100dvh] flex-col px-5 pb-8 pt-[max(20px,env(safe-area-inset-top))] md:px-12">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-bold tracking-tight">Swara</span>
            <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 md:inline-block">Kochi</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Header WhatsApp Quick Link */}
            <a
              href={wa("Hi Swara Music Academy! I'd like to ask a quick question.")}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-[#25D366] hover:text-white"
              aria-label="Direct WhatsApp chat"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366] group-hover:text-white" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Header Instagram Quick Link */}
            <a
              href={insta()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-gradient-to-r hover:from-[#f09433] hover:to-[#bc1888]"
              aria-label="Instagram profile"
            >
              <InstagramIcon className="h-4 w-4 text-sun" />
              <span className="hidden sm:inline">Instagram</span>
            </a>

            {/* Book Trial Button */}
            <a
              href="#book"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-navy shadow-md transition hover:bg-sun active:scale-95"
            >
              Book a trial
            </a>
          </div>
        </header>

        <div className="flex flex-1 flex-col justify-center py-6">
          <motion.h1
            initial={{ y: 70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [.16, 1, .3, 1] }}
            className="font-display text-[28vw] font-bold leading-[.82] tracking-tighter md:text-[17rem]"
          >
            Play.
          </motion.h1>
          <p className="mt-4 max-w-md text-lg text-white/90 md:text-xl">
            Swara Music Academy, Kochi. These keys are real. Tap them, or slide a finger across.
          </p>
        </div>

        <Piano />
        <p className="mt-5 text-sm text-white/70">On a keyboard, press A to K. Turn the volume up.</p>
      </section>

      {/* Courses / Instruments */}
      <section className="px-5 py-24 md:px-12">
        <h2 className="font-display text-5xl font-bold tracking-tight md:text-8xl">Learn</h2>
        <ul className="mt-8 border-b border-white/30">
          {INSTR.map(([n, a, s, f], i) => (
            <li key={n} className="border-t border-white/30">
              <button
                onClick={() => pick(i)}
                className="flex w-full items-center justify-between py-5 text-left transition hover:text-sun"
                aria-expanded={open === i}
              >
                <span className="font-display text-4xl font-bold md:text-7xl">{n}</span>
                <span className="text-sm font-medium text-white/70">Tap to hear</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: .4, ease: [.16, 1, .3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-3 pb-6 text-lg md:grid-cols-3">
                      <p><span className="text-sm text-white/60 block">Eligibility</span>{a}</p>
                      <p><span className="text-sm text-white/60 block">Class Schedule</span>{s}</p>
                      <p className="font-bold text-sun"><span className="text-sm text-white/60 block font-normal">Fee</span>{f}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </section>

      <Wave />

      {/* Try Free Class / Booking on WhatsApp */}
      <section id="book" className="mx-3 rounded-[32px] bg-navy px-5 py-16 shadow-2xl md:mx-12 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-sun/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sun">
              Zero Commitment
            </span>
            <h2 className="mt-4 font-display text-5xl font-bold tracking-tight md:text-8xl">Try a free class</h2>
            <p className="mt-3 max-w-md text-white/70">
              Pick your instrument and age group. We will confirm your mentor slot directly on WhatsApp.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3 rounded-2xl bg-white/5 p-4 border border-white/10">
            <div className="h-10 w-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg">
              <WhatsAppIcon className="h-6 w-6 fill-current" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">Instant Booking</p>
              <p className="text-sm font-bold text-white">Direct chat with mentor team</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {INSTR.map(([n], i) => (
            <button
              key={n}
              onClick={() => setWho(i)}
              className={`rounded-full px-5 py-3 font-bold ring-2 ring-white transition active:scale-95 ${
                who === i ? 'bg-sun text-navy ring-sun shadow-lg' : 'hover:bg-white/10'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {['Child, 5 to 12', 'Teen', 'Adult'].map((n, i) => (
            <button
              key={n}
              onClick={() => setAge(i)}
              className={`rounded-full px-5 py-3 font-bold ring-2 ring-white/50 transition active:scale-95 ${
                age === i ? 'bg-white text-navy ring-white shadow-lg' : 'hover:bg-white/10'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* WhatsApp Official Button */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={wa(`Hi Swara, I'd like a free trial class.\nInstrument: ${INSTR[who][0]}\nStudent: ${['Child, 5 to 12', 'Teen', 'Adult'][age]}`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3.5 rounded-full bg-[#25D366] px-8 py-4 text-base font-bold text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-all hover:bg-[#20bd5a] hover:scale-105 active:scale-95"
          >
            <WhatsAppIcon className="h-6 w-6 fill-current" />
            <span>Book on WhatsApp</span>
          </a>

          <span className="text-xs text-white/60">
            Typically replies within 15 minutes • Mon to Sat
          </span>
        </div>
      </section>

      {/* Instagram Integration Section */}
      <section id="instagram" className="px-5 py-28 md:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-white/20 pb-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E4405F] animate-ping" />
              <p className="font-display text-sm font-semibold tracking-wider uppercase text-sun">
                Studio Life & Updates
              </p>
            </div>
            <h2 className="mt-3 font-display text-5xl font-bold tracking-tight md:text-8xl">
              Follow our rhythm.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/80">
              Recital snapshots, masterclass drills, student breakthroughs, and behind-the-scenes moments from our academy in Kochi.
            </p>
          </div>

          {/* Profile Card Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-3xl bg-navy/80 p-5 backdrop-blur border border-white/15 shadow-xl">
            <div className="relative">
              {/* Instagram Gradient Ring */}
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-md">
                <div className="h-14 w-14 rounded-full bg-navy flex items-center justify-center p-1">
                  <span className="font-display font-black text-xl text-sun">S</span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white ring-2 ring-navy text-[10px] font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <a
                  href={insta()}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-white hover:text-sun transition"
                >
                  @{CO.instagram}
                </a>
                <svg className="h-4 w-4 text-[#3897f0]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7l-4.1-4.1 1.4-1.4 2.7 2.7 6.7-6.7 1.4 1.4-8.1 8.1z"/>
                </svg>
              </div>
              <p className="text-xs text-white/70 mt-0.5">350+ Students • 14.2K Followers • Kochi</p>
            </div>

            <a
              href={insta()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:opacity-95 hover:scale-105 active:scale-95"
            >
              <InstagramIcon className="h-4 w-4" />
              <span>Follow on Instagram</span>
            </a>
          </div>
        </div>

        {/* Instagram Post Feed Grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {INSTA_POSTS.map((p) => (
            <motion.a
              key={p.id}
              href={insta()}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl bg-navy border border-white/10 shadow-lg"
            >
              {/* Background Image */}
              <img
                src={p.img}
                alt={p.category}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                loading="lazy"
              />

              {/* Top Gradient & Badge */}
              <div className="relative z-10 flex items-center justify-between p-3 bg-gradient-to-b from-navy/80 via-navy/20 to-transparent">
                <span className="rounded-full bg-navy/80 backdrop-blur px-2.5 py-0.5 text-[11px] font-bold text-sun">
                  {p.category}
                </span>
                <span className="rounded-full bg-white/20 p-1 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <InstagramIcon className="h-3.5 w-3.5" />
                </span>
              </div>

              {/* Bottom Overlay & Hover State */}
              <div className="relative z-10 p-3 bg-gradient-to-t from-navy/95 via-navy/80 to-transparent transition-opacity">
                <p className="line-clamp-2 text-xs font-medium text-white/90 group-hover:text-white">
                  {p.caption}
                </p>
                <div className="mt-2 flex items-center gap-3 text-[11px] font-bold text-white/80">
                  <span className="flex items-center gap-1">
                    <svg className="h-3 w-3 fill-[#ff3040]" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {p.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-3 w-3 fill-white/80" viewBox="0 0 24 24">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    {p.comments}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 pb-32 pt-16 md:px-12 border-t border-white/20">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div>
            <p className="font-display text-4xl font-bold tracking-tight">Swara Music Academy</p>
            <p className="mt-4 text-lg text-white/90">{CO.address}</p>
            <p className="text-lg text-white/80">{CO.hours}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Swara+Music+Academy+Kochi"
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-6 py-3 font-bold ring-2 ring-white/50 transition hover:bg-white/10"
              >
                Open in Maps
              </a>

              {/* Footer WhatsApp Button */}
              <a
                href={wa("Hi Swara Music Academy, I'd like to get more information.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 font-bold text-white shadow-lg transition hover:bg-[#20bd5a] hover:scale-105 active:scale-95"
              >
                <WhatsAppIcon className="h-5 w-5 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Footer Instagram Button */}
              <a
                href={insta()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] px-6 py-3 font-bold text-white shadow-lg transition hover:opacity-95 hover:scale-105 active:scale-95"
              >
                <InstagramIcon className="h-5 w-5" />
                <span>@{CO.instagram}</span>
              </a>
            </div>
          </div>

          <div className="text-sm text-white/60">
            <p className="font-bold text-white/90">Curriculum Offered:</p>
            <p className="mt-1">Trinity College London & Indian Carnatic Syllabus</p>
            <p className="mt-4">© {new Date().getFullYear()} Swara Music Academy. Kochi, Kerala.</p>
          </div>
        </div>
      </footer>

      {/* Persistent Floating Official WhatsApp Action Button */}
      <motion.aside
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
        className="fixed z-50 right-5 bottom-6 md:right-8 md:bottom-8"
        aria-label="Direct WhatsApp Contact"
      >
        <a
          href={wa("Hello Swara Music Academy! I'm interested in music classes.")}
          target="_blank"
          rel="noreferrer"
          className="group relative flex items-center gap-3 rounded-full bg-[#25D366] p-3.5 md:px-5 md:py-3.5 text-white shadow-[0_8px_30px_rgba(37,211,102,0.45)] ring-4 ring-white/20 transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] active:scale-95"
          aria-label="Chat with Swara Music Academy on WhatsApp"
        >
          {/* Subtle pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping -z-10" />

          <WhatsAppIcon className="h-7 w-7 md:h-6 md:w-6 fill-current" />
          <span className="hidden font-bold tracking-wide md:inline text-sm">
            Chat on WhatsApp
          </span>
        </a>
      </motion.aside>

      {/* Mobile Sticky Book Class CTA Bar */}
      <AnimatePresence>
        {cta && (
          <motion.a
            href="#book"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            style={{ bottom: 'max(16px, env(safe-area-inset-bottom))' }}
            className="fixed left-6 z-40 rounded-full bg-sun px-6 py-3.5 font-bold text-navy shadow-2xl md:hidden flex items-center gap-2"
          >
            <span>Book a free class</span>
            <span className="text-xs">→</span>
          </motion.a>
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}
