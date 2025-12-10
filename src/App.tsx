import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaMoon,
  FaSun,
  FaMusic,
} from 'react-icons/fa'
import './App.css'

// Set the exact ceremony date/time (with timezone) for the countdown
// Dec 14, 2025 at 10:00 AM IST (+05:30)
const weddingDate = new Date('2025-12-14T10:00:00+05:30')

const storyMoments = [
  { year: '21.03.2022', title: '1st Pic View', detail: 'Just a picture, yet it felt like a spark — the beginning of a story neither of us expected.' },
  { year: '10.03.2022', title: 'Request in Insta', detail: 'A simple request sent with hope, not knowing it would one day lead to forever.' },
  { year: '12.04.2022', title: 'Request Accepted', detail: 'A notification that made the day brighter — one click, and the universe shifted a little.' },
  { year: '14.04.2022', title: 'First Message', detail: 'Words exchanged like soft steps into each other’s lives, shy but full of wonder.' },
  { year: '03.05.2022', title: 'First Voice-call', detail: 'Hearing the voice behind the texts — familiar, soothing, and unexpectedly special.' },
  { year: '17.05.2022', title: 'Propose', detail: 'A heartbeat moment — courage met feelings, and a question changed everything.' },
  { year: '21.05.2022', title: 'Proposal Accepted', detail: 'A yes that felt like sunrise — warm, beautiful, and full of promise.' },
  { year: '28.09.2022', title: '1st Date', detail: 'Face to face, smile to smile — a moment where time slowed and love grew quietly.' },
  { year: '23.08.2025', title: 'Our Engagement', detail: 'Years of connection, laughter, and growing closer — now sealed with a forever promise.' },
  { year: '14.12.2025', title: 'Our Wedding', detail: 'The day two souls became one — a celebration of love, destiny, and the journey that brought us here.' }

]


const galleryPhotos = [
  '/gallery/photo1.jpg',
  '/gallery/photo2.jpg',
  '/gallery/photo3.jpg',
  '/gallery/photo4.jpg',
]

const heroImage = '/couple.jpg' // Please place the provided photo at public/couple.jpg
// Music: You can replace this with your own music file in public/music.mp3
// Or use: '/music.mp3' if you place a file at public/music.mp3
const musicUrl =
  '/music.mp3' // Fallback romantic instrumental

function App() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light')
  const [musicOn, setMusicOn] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const diff = weddingDate.getTime() - now
      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
      const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24))
      const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60))
      const seconds = Math.max(0, Math.floor((diff / 1000) % 60))
      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!audioRef.current) return
    
    const audio = audioRef.current
    audio.volume = 0.35
    audio.loop = true
    
    // Handle audio loading errors
    const handleError = () => {
      console.error('Audio loading error')
      setMusicOn(false)
    }
    
    // Handle when audio can play
    const handleCanPlay = () => {
      if (musicOn) {
        audio.play().catch((err) => {
          console.error('Play error:', err)
        })
      }
    }
    
    audio.addEventListener('error', handleError)
    audio.addEventListener('canplaythrough', handleCanPlay)
    
    if (musicOn) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Playback failed:', error)
          // Browser may require user interaction - user will need to click again
        })
      }
    } else {
      audio.pause()
    }
    
    return () => {
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('canplaythrough', handleCanPlay)
    }
  }, [musicOn])

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
    viewport: { once: true, amount: 0.2 },
  }

  return (
    <div className="page">
      <header className="hero" style={{ backgroundImage: `linear-gradient(var(--overlay)), url(${heroImage})` }}>
        <div className="nav">
          <div className="brand">Nilaxshan ♥︎ Tharshika</div>
          <div className="nav-actions">
            <a className="ghost" href="#events">
              Event Details
            </a>
            <a className="ghost" href="#gallery">
              Gallery
            </a>
            <button className="ghost" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            <button
              className={`ghost ${musicOn ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                const newState = !musicOn
                setMusicOn(newState)
                // Force play on user click to bypass autoplay restrictions
                if (newState && audioRef.current) {
                  audioRef.current.play().catch((err) => {
                    console.error('Music play error:', err)
                    alert('Please click the music button again to play. Some browsers require user interaction.')
                  })
                }
              }}
              aria-label="Toggle music"
            >
              <FaMusic />
            </button>
          </div>
        </div>
        <motion.div className="hero-content" {...fadeUp}>
          <p className="eyebrow" style={{ color: `#000000`, fontSize: `1.2rem` }}>Together with their families</p>
          <h1>
          Nilaxshan  <span>&</span> Tharshika
          </h1>
          <p className="date">December 14, 2025 · 10:00 AM · Sri Mathura Hall, Vavuniya</p>
          <div className="countdown">
            {Object.entries(timeLeft).map(([label, value]) => (
              <div key={label} className="time-box">
                <span className="value">{value.toString().padStart(2, '0')}</span>
                <span className="label">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </header>

      <main>
        <section id="story" className="section">
          <motion.div className="section-header" {...fadeUp}>
            <p className="eyebrow" style={{ color: `#000000`, fontSize: `1.2rem` }}>Our Story</p> 
            <h2>From first glance to forever</h2>
            <p className="lead">A few chapters that led us to this beautiful day.</p>
          </motion.div>
          <div className="story-grid">
            {storyMoments.map((item) => (
              <motion.div className="story-card" key={item.year} {...fadeUp}>
                <p className="story-year">{item.year}</p>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="events" className="section soft-bg">
          <motion.div className="section-header" {...fadeUp}>
            <p className="eyebrow" style={{ color: `#000000`, fontSize: `1.2rem` }}>The Celebration</p>
            <h2>Event Details</h2>
            <p className="lead">Join us for a day of vows, laughter, and dancing.</p>
          </motion.div>
          <div className="event-grid">
            <motion.div className="event-card" {...fadeUp}>
              <h3>Ceremony</h3>
              <p className="detail">10:00 AM · Sri Mathura Hall</p>
              <p>Sri Mathura Hall, No.190 Station Road, Vairavapuliyankulam, Vavuniya.</p>
              <p className="tag">Followed by lunch · Dress code: Pastel elegance</p>
            </motion.div>
            <motion.div className="event-card" {...fadeUp}>
              <h3>Location</h3>
              <p className="detail">Sri Mathura Hall, Vavuniya</p>
              <p>Ample parking · Kids welcome.</p>
              <div className="map-wrapper">
                <iframe
                  title="Venue map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.732552894219!2d80.493!3d8.746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2sSri%20Mathura%20Hall%2C%20Station%20Road%2C%20Vairavapuliyankulam%2C%20Vavuniya!5e0!3m2!1sen!2slk!4v1700000000001"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="gallery" className="section">
          <motion.div className="section-header" {...fadeUp}>
            <p className="eyebrow" style={{ color: `#000000`, fontSize: `1.2rem` }}>Gallery</p>
            <h2>Moments in frames</h2>
            <p className="lead">A preview of the smiles and love we share.</p>
          </motion.div>
          <div className="gallery-grid">
            {galleryPhotos.map((photo, idx) => (
              <motion.div className="gallery-item" key={photo} {...fadeUp}>
                <div className="image-skeleton">Photo {idx + 1}</div>
                <img
                  src={photo}
                  alt={`Gallery ${idx + 1}`}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      <footer className="footer">
        <div>
          <p className="eyebrow" style={{ color: `#000000`, fontSize: `1.2rem` }}>Thank you</p>
          <h3>We are grateful to celebrate with you.</h3>
          <p className="lead">Your presence is the greatest gift.</p>
        </div>
        {/* <div className="socials">
          <a href="mailto:hello@ourwedding.com" aria-label="Email">
            <FaEnvelope />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
            <FaTwitter />
          </a>
        </div> */}
        <p className="lead">© 2025 Nilaxshan ♥︎ Tharshika. All rights reserved.</p>
      </footer>
      {/* Hidden audio element for better browser compatibility */}
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default App
