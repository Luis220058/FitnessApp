/* ============================================
   APP.JSX — Rahmen mit Navigation
   
   Navigation: Start · Sport · Statistik · Profil
   ============================================ */

import { useState } from 'react'
import { House, Dumbbell, ChartColumn, User } from 'lucide-react'
import Home from './components/Home'
import Sport from './components/Sport'
import Statistik from './components/Statistik'
import Profil from './components/Profil'
import './App.css'

function App() {

  const [seite, setSeite] = useState('home')

  const heute = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="app">

      <header className="app-header">
        <h1 className="claim">
          Do it anyway<span className="claim-dot">.</span>
        </h1>
        <p className="datum">{heute}</p>
      </header>

      <main className="app-main">
        {seite === 'home' && <Home />}
        {seite === 'sport' && <Sport />}
        {seite === 'statistik' && <Statistik />}
        {seite === 'profil' && <Profil />}
      </main>

      <nav className="app-nav">
        <button
          className={`nav-btn ${seite === 'home' ? 'aktiv' : ''}`}
          onClick={() => setSeite('home')}
        >
          <span className="nav-icon"><House size={20} /></span>
          <span className="nav-label">Start</span>
        </button>

        <button
          className={`nav-btn ${seite === 'sport' ? 'aktiv' : ''}`}
          onClick={() => setSeite('sport')}
        >
          <span className="nav-icon"><Dumbbell size={20} /></span>
          <span className="nav-label">Sport</span>
        </button>

        <button
          className={`nav-btn ${seite === 'statistik' ? 'aktiv' : ''}`}
          onClick={() => setSeite('statistik')}
        >
          <span className="nav-icon"><ChartColumn size={20} /></span>
          <span className="nav-label">Statistik</span>
        </button>

        <button
          className={`nav-btn ${seite === 'profil' ? 'aktiv' : ''}`}
          onClick={() => setSeite('profil')}
        >
          <span className="nav-icon"><User size={20} /></span>
          <span className="nav-label">Profil</span>
        </button>
      </nav>

    </div>
  )
}

export default App