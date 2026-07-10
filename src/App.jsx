/* ============================================
   APP.JSX — Der Rahmen
   
   App.jsx setzt jetzt nur noch zusammen:
   Header (Claim) + das Tool.
   Die eigentliche Arbeit passiert in SatzLogger.
   
   Das ist eine wichtige Gewohnheit: App.jsx
   bleibt schlank, jedes Tool lebt in einer
   eigenen Datei unter components/.
   ============================================ */

import SatzLogger from './components/SatzLogger'
import './App.css'

function App() {
  // Datum schön formatiert, z.B. "Donnerstag, 9. Juli"
  const heute = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="app">

      {/* Header mit dem Claim */}
      <header className="app-header">
        <h1 className="claim">
          Do it anyway<span className="claim-dot">.</span>
        </h1>
        <p className="datum">{heute}</p>
      </header>

      {/* Das Tool */}
      <main>
        <SatzLogger />
      </main>

    </div>
  )
}

export default App