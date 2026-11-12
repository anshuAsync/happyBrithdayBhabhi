import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, Cake, Gift, Heart, Music2, Pause, Play, Sparkles, Volume2, X } from 'lucide-react'

const GiftScene = lazy(() => import('./components/GiftScene.jsx'))

const memories = [
  { number: '01', title: 'The warmth you bring', note: 'You have a way of making every room feel a little more like home.', tone: 'peach' },
  { number: '02', title: 'A heart that gives', note: 'Your kindness is the kind that stays with people long after the moment passes.', tone: 'lilac' },
  { number: '03', title: 'Your lovely laughter', note: 'May there always be a reason to laugh, and someone wonderful to laugh with.', tone: 'butter' },
  { number: '04', title: 'All the little things', note: 'The thoughtful details you notice make ordinary days feel special.', tone: 'sage' },
]

const compliments = [
  'You make kindness look effortless.',
  'Your smile has a way of brightening the whole day.',
  'The people around you are lucky to have your warmth.',
  'You make the ordinary feel a little more beautiful.',
  'You deserve all the joy you so freely give to others.',
]

function Reveal({ children, className = '', delay = 0 }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  )
}

function useAmbientMusic() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const toggle = useCallback(async () => {
    if (playing) {
      audioRef.current?.context.close()
      audioRef.current = null
      setPlaying(false)
      return
    }
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      const context = new AudioContext()
      const master = context.createGain()
      master.gain.value = 0.018
      master.connect(context.destination)
      const notes = [174.61, 220, 261.63, 220]
      const oscillators = notes.map((frequency, index) => {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.type = index === 0 ? 'sine' : 'triangle'
        oscillator.frequency.value = frequency
        gain.gain.value = index === 0 ? 0.34 : 0.12
        oscillator.connect(gain)
        gain.connect(master)
        oscillator.start()
        return oscillator
      })
      audioRef.current = { context, oscillators }
      setPlaying(true)
    } catch (error) {
      console.warn('Ambient audio could not be started.', error)
    }
  }, [playing])
  useEffect(() => () => { audioRef.current?.context.close() }, [])
  return [playing, toggle]
}

function Confetti({ onDone }) {
  useEffect(() => {
    const timeout = window.setTimeout(onDone, 2500)
    return () => window.clearTimeout(timeout)
  }, [onDone])
  return <div className="confetti" aria-hidden="true">{Array.from({ length: 28 }, (_, index) => <i key={index} style={{ '--i': index }} />)}</div>
}

function GiftModal({ onClose }) {
  return (
    <AnimatePresence>
      <motion.div className="modal-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <motion.section className="gift-modal" role="dialog" aria-modal="true" aria-labelledby="gift-title" initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.3 }}>
          <button className="icon-button modal-close" onClick={onClose} aria-label="Close birthday message"><X size={19} /></button>
          <span className="eyebrow">A little note, just for you</span>
          <h2 id="gift-title">To our wonderful Bhabhi</h2>
          <p>May this new year of your life be filled with the same love, comfort, and happiness that you bring to everyone around you. You are cherished more than words can say.</p>
          <div className="modal-signoff">With all our love <Heart size={16} fill="currentColor" /></div>
          <button className="button button-dark modal-done" onClick={onClose}>Keep this close <Heart size={15} /></button>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  const [giftOpen, setGiftOpen] = useState(false)
  const [candlesLit, setCandlesLit] = useState(true)
  const [complimentIndex, setComplimentIndex] = useState(0)
  const [confetti, setConfetti] = useState(false)
  const [playing, toggleMusic] = useAmbientMusic()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', containScroll: 'trimSnaps' })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])
  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => { emblaApi.off('select', onSelect); emblaApi.off('reInit', onSelect) }
  }, [emblaApi, onSelect])

  const celebrate = useCallback(() => setConfetti(true), [])

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Back to the beginning"><span className="brand-mark"><Heart size={15} fill="currentColor" /></span><span>A day for you</span></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#letter">A little letter</a><a href="#memories">The lovely things</a><a href="#wish">Make a wish</a>
        </nav>
        <button className={`sound-button ${playing ? 'is-playing' : ''}`} onClick={toggleMusic} aria-pressed={playing} aria-label={playing ? 'Turn ambient music off' : 'Turn ambient music on'}>
          {playing ? <Volume2 size={16} /> : <Music2 size={16} />}<span>{playing ? 'Music on' : 'Music off'}</span><span className="sound-bars" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </header>

      <section className="hero" id="home">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-copy">
          <motion.div className="eyebrow hero-eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}><Sparkles size={14} /> A celebration of you</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.75 }}>
            Today is all<br />about <em>you,</em> Bhabhi.
          </motion.h1>
          <motion.p className="hero-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>For the warmth you bring, the love you share, and all the little ways you make life brighter.</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <button className="button button-dark" onClick={() => { setGiftOpen(true); celebrate() }}>Open your birthday surprise <Gift size={16} /></button>
            <a className="text-link" href="#letter">Take a little look <ArrowDown size={15} /></a>
          </motion.div>
          <div className="hero-caption"><span className="caption-line" /> MADE WITH LOVE, JUST FOR YOU</div>
        </div>
        <div className="hero-art" aria-label="A floating 3D birthday gift">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <Suspense fallback={<div className="gift-fallback"><div className="gift-box"><span /></div></div>}>
            <GiftScene onOpen={() => { setGiftOpen(true); celebrate() }} />
          </Suspense>
          <div className="art-note note-top"><Sparkles size={13} /> YOUR DAY, YOUR WAY</div>
          <div className="art-note note-bottom"><span className="note-heart"><Heart size={13} fill="currentColor" /></span> A LITTLE JOY, WRAPPED UP</div>
        </div>
        {confetti && <Confetti onDone={() => setConfetti(false)} />}
        <div className="hero-scroll" aria-hidden="true"><span /> SCROLL TO UNWRAP</div>
      </section>

      <section className="letter-section section-pad" id="letter">
        <Reveal className="letter-aside"><span className="eyebrow"><span className="tiny-dot" /> FROM THE HEART</span><p className="aside-script">A note for<br />your new year</p><span className="aside-rule" /></Reveal>
        <Reveal className="letter-copy" delay={0.1}>
          <span className="section-index">01 <span /> A LITTLE LETTER</span>
          <h2>Some people make<br />life feel <em>softer.</em></h2>
          <p>You're one of those people, Bhabhi. In the care you show, the laughter you share, and the way you make everyone feel welcome, there's a kind of magic that's entirely your own.</p>
          <p>Today, we hope you feel just a fraction of the happiness you give to everyone else. May the year ahead bring you beautiful surprises, peaceful moments, and every reason to smile.</p>
          <div className="signature">With love, always <Heart size={15} fill="currentColor" /></div>
        </Reveal>
        <div className="letter-stamp" aria-hidden="true"><span>for you</span><Heart size={22} fill="currentColor" /></div>
      </section>

      <section className="memories-section section-pad" id="memories">
        <Reveal className="section-heading">
          <div><span className="section-index">02 <span /> THE LOVELY THINGS</span><h2>Little things that<br /><em>make you, you.</em></h2></div>
          <p>There are a hundred reasons to celebrate you. Here are just a few that came to mind.</p>
        </Reveal>
        <Reveal className="carousel-shell" delay={0.1}>
          <div className="memories-viewport" ref={emblaRef}>
            <div className="memories-track">
              {memories.map((memory) => <article className={`memory-card ${memory.tone}`} key={memory.number}>
                <div className="memory-card-top"><span>THINGS WE LOVE ABOUT YOU</span><span>{memory.number} / 04</span></div>
                <div className="memory-art" aria-hidden="true"><span className="memory-sun" /><span className="memory-flower">✳</span><span className="memory-sparkle">✦</span><span className="memory-heart"><Heart size={28} fill="currentColor" /></span></div>
                <div className="memory-card-copy"><h3>{memory.title}</h3><p>{memory.note}</p></div>
              </article>)}
            </div>
          </div>
          <div className="carousel-controls">
            <div className="carousel-dots" aria-label="Choose a memory">{memories.map((memory, index) => <button key={memory.number} className={`carousel-dot ${selectedIndex === index ? 'active' : ''}`} onClick={() => emblaApi?.scrollTo(index)} aria-label={`Show memory ${index + 1}`} aria-current={selectedIndex === index ? 'true' : undefined} />)}</div>
            <div className="carousel-arrows"><button className="icon-button" onClick={() => emblaApi?.scrollPrev()} aria-label="Previous memory"><ArrowLeft size={17} /></button><button className="icon-button" onClick={() => emblaApi?.scrollNext()} aria-label="Next memory"><ArrowRight size={17} /></button></div>
          </div>
        </Reveal>
      </section>

      <section className="wish-section section-pad" id="wish">
        <Reveal className="wish-content">
          <span className="section-index"><span className="tiny-dot" /> A MOMENT JUST FOR YOU</span>
          <div className={`cake-wrap ${candlesLit ? 'candles-lit' : ''}`} aria-label={candlesLit ? 'Birthday cake with lit candles' : 'Birthday cake with candles blown out'}>
            <div className="candle-row"><span className="candle"><i /></span><span className="candle"><i /></span><span className="candle"><i /></span></div>
            <div className="cake-top" /><div className="cake-layer cake-layer-top" /><div className="cake-layer cake-layer-bottom" /><div className="cake-plate" />
          </div>
          <h2>Make a wish,<br /><em>beautiful.</em></h2>
          <p>{candlesLit ? 'Take a breath, close your eyes, and wish for something wonderful.' : 'May every little wish you made find its way to you.'}</p>
          <button className="button button-rose" onClick={() => { setCandlesLit((value) => !value); if (candlesLit) celebrate() }}><Cake size={16} /> {candlesLit ? 'Blow out the candles' : 'Light the candles again'}</button>
        </Reveal>
        <div className="wish-decoration deco-left" aria-hidden="true">✳</div><div className="wish-decoration deco-right" aria-hidden="true">✦</div>
      </section>

      <section className="compliment-section section-pad">
        <Reveal className="compliment-card">
          <span className="eyebrow"><Sparkles size={14} /> YOUR DAILY REMINDER</span>
          <AnimatePresence mode="wait"><motion.p className="compliment-text" key={complimentIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>{compliments[complimentIndex]}</motion.p></AnimatePresence>
          <button className="text-link compliment-button" onClick={() => setComplimentIndex((index) => (index + 1) % compliments.length)}>Tell me another <ArrowRight size={15} /></button>
        </Reveal>
      </section>

      <footer className="footer">
        <div className="footer-top"><span className="footer-heart"><Heart size={16} fill="currentColor" /></span><p>Here's to you, and all the joy still to come.</p><a href="#home" className="back-top">BACK TO THE TOP <ArrowRight size={13} /></a></div>
        <div className="footer-bottom"><span>A DAY FOR YOU</span><span>MADE WITH LOVE <Heart size={11} fill="currentColor" /></span></div>
      </footer>
      {giftOpen && <GiftModal onClose={() => setGiftOpen(false)} />}
      <button className="music-fab" onClick={toggleMusic} aria-label={playing ? 'Pause ambient sound' : 'Play ambient sound'} aria-pressed={playing}>{playing ? <Pause size={17} /> : <Play size={17} />}</button>
    </main>
  )
}

export default App
