/* ============================================
   PROFIL.JSX — Persönliche Einstellungen
   
   Sammelstelle für alles, was DICH betrifft,
   nicht eine Aktivität ist. Aktuell: Körpergewicht.
   Später kommen z.B. Trainingsplan-Verwaltung dazu.
   
   Gleiches Prinzip wie Sport.jsx: ein Rahmen,
   der thematisch passende Logger einbindet.
   ============================================ */

import GewichtLogger from './GewichtLogger'
import './Profil.css'

function Profil() {
  return (
    <div className="profil">
      <GewichtLogger />
    </div>
  )
}

export default Profil