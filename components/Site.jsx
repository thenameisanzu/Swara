'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform } from 'framer-motion'

// ---- Edit content here ----
const CO = { whatsapp: '910000000000', address: 'First floor, Building name, Kochi, Kerala', hours: 'Mon to Sat, 10 am to 8 pm' }
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
const wa = (t) => `https://wa.me/${CO.whatsapp}?text=${encodeURIComponent(t)}`

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
  useEffect(() => { const f = () => setCta(scrollY > 500); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  const pick = (i) => { setOpen(open === i ? -1 : i); const [, , , , ch, ty] = INSTR[i]; ch.forEach((f, k) => setTimeout(() => tone(f, ty, ty === 'sine' ? 1.8 : 1.1), k * 90)) }

  return (
    <MotionConfig reducedMotion="user">
      <section className="flex min-h-[100dvh] flex-col px-5 pb-8 pt-[max(20px,env(safe-area-inset-top))] md:px-12">
        <header className="flex items-center justify-between"><span className="font-display text-2xl font-bold">Swara</span><a href="#book" className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-navy">Book a trial</a></header>
        <div className="flex flex-1 flex-col justify-center">
          <motion.h1 initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: [.16, 1, .3, 1] }} className="font-display text-[30vw] font-bold leading-[.85] tracking-tighter md:text-[17rem]">Play.</motion.h1>
          <p className="mt-4 max-w-md text-xl">Swara Music Academy, Kochi. These keys are real. Tap them, or slide a finger across.</p>
        </div>
        <Piano />
        <p className="mt-5 text-sm text-white/70">On a keyboard, press A to K. Turn the volume up.</p>
      </section>

      <section className="px-5 py-24 md:px-12">
        <h2 className="font-display text-5xl font-bold tracking-tight md:text-8xl">Learn</h2>
        <ul className="mt-8 border-b border-white/30">
          {INSTR.map(([n, a, s, f], i) => (
            <li key={n} className="border-t border-white/30">
              <button onClick={() => pick(i)} className="flex w-full items-center justify-between py-5 text-left" aria-expanded={open === i}><span className="font-display text-4xl font-bold md:text-7xl">{n}</span><span className="text-sm text-white/70">Tap to hear</span></button>
              <AnimatePresence initial={false}>{open === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: .4, ease: [.16, 1, .3, 1] }} className="overflow-hidden">
                  <div className="grid gap-3 pb-6 text-lg md:grid-cols-3"><p>{a}</p><p>{s}</p><p className="font-bold text-sun">{f}</p></div>
                </motion.div>)}</AnimatePresence>
            </li>))}
        </ul>
      </section>

      <Wave />

      <section id="book" className="mx-3 rounded-[32px] bg-navy px-5 py-16 md:mx-12 md:px-12">
        <h2 className="font-display text-5xl font-bold tracking-tight md:text-8xl">Try a free class</h2>
        <div className="mt-8 flex flex-wrap gap-2">{INSTR.map(([n], i) => <button key={n} onClick={() => setWho(i)} className={`rounded-full px-5 py-3 font-bold ring-2 ring-white ${who === i ? 'bg-sun text-navy ring-sun' : ''}`}>{n}</button>)}</div>
        <div className="mt-3 flex flex-wrap gap-2">{['Child, 5 to 12', 'Teen', 'Adult'].map((n, i) => <button key={n} onClick={() => setAge(i)} className={`rounded-full px-5 py-3 font-bold ring-2 ring-white/50 ${age === i ? 'bg-white text-navy' : ''}`}>{n}</button>)}</div>
        <a href={wa(`Hi Swara, I'd like a free trial class.\nInstrument: ${INSTR[who][0]}\nStudent: ${['Child, 5 to 12', 'Teen', 'Adult'][age]}`)} className="mt-8 inline-block rounded-full bg-sun px-8 py-4 font-bold text-navy">Book on WhatsApp</a>
      </section>

      <footer className="px-5 pb-28 pt-16 md:px-12"><p className="font-display text-3xl font-bold">Swara Music Academy</p><p className="mt-3 text-lg">{CO.address}</p><p className="text-lg">{CO.hours}</p><a href="https://www.google.com/maps/search/?api=1&query=Swara+Music+Academy+Kochi" target="_blank" rel="noreferrer" className="mt-5 inline-block rounded-full px-6 py-3 font-bold ring-2 ring-white/50">Open in Maps</a></footer>

      <AnimatePresence>{cta && <motion.a href="#book" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} style={{ bottom: 'max(16px, env(safe-area-inset-bottom))' }} className="fixed left-1/2 z-40 -translate-x-1/2 rounded-full bg-sun px-8 py-4 font-bold text-navy shadow-2xl md:hidden">Book a free class</motion.a>}</AnimatePresence>
    </MotionConfig>
  )
}
