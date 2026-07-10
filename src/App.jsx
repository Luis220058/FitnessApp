/* ============================================
   APP.JSX — Der Rahmen mit Navigation
   
   NEUES KONZEPT: Seitenwechsel ohne Router.
   
   Ein State merkt sich, welche Seite aktiv ist.
   Klick auf einen Reiter ändert den State.
   React zeichnet neu, andere Seite erscheint.
   
   Kein Paket nötig — nur useState, das du
   vom SatzLogger schon kennst.
   ============================================ */

import { useState } from 'react'
import Home from './components/Home'
import SatzLogger from './components/SatzLogger'
import './App.css'

function App() {

  // Welche Seite ist aktiv? Startwert: 'home'
  const [seite, setSeite] = useState('home')

  // Datum schön formatiert
  const heute = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="app">

      {/* Header — bleibt auf beiden Seiten gleich */}
      <header className="app-header">
        <h1 className="claim">
          Do it anyway<span className="claim-dot">.</span>
        </h1>
        <p className="datum">{heute}</p>
      </header>

      {/* Der Inhalt wechselt je nach State.
          && heißt: wenn links wahr, zeige rechts. */}
      <main className="app-main">
        {seite === 'home' && <Home />}
        {seite === 'workout' && <SatzLogger />}
      </main>

      {/* Navigation unten */}
      <nav className="app-nav">
        <button
          className={`nav-btn ${seite === 'home' ? 'aktiv' : ''}`}
          onClick={() => setSeite('home')}
        >
          <span className="nav-icon">◉</span>
          <span className="nav-label">Start</span>
        </button>

        <button
          className={`nav-btn ${seite === 'workout' ? 'aktiv' : ''}`}
          onClick={() => setSeite('workout')}
        >
          <span className="nav-icon">▦</span>
          <span className="nav-label">Workout</span>
        </button>
      </nav>

    </div>
  )
}

export default App