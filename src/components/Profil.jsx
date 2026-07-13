/* ============================================
   PROFIL.JSX — Persönliche Einstellungen
   
   Sammelstelle für alles, was DICH betrifft,
   nicht eine Aktivität ist. Aktuell: Körpergewicht.
   Später kommen z.B. Trainingsplan-Verwaltung dazu.
   
   Gleiches Prinzip wie Sport.jsx: ein Rahmen,
   der thematisch passende Logger einbindet.
   ============================================ */

import Gewichtlogger from './Gewichtlogger'
import './Profil.css'

function Profil() {
  return (
    <div className="profil">
      <Gewichtlogger />
    </div>
  )
}

export default Profil