/* ============================================
   GEWICHTLOGGER.JSX — Körpergewicht eintragen

   Besonderheit im Vergleich zu Satz-/Lauf-Logger:
   Es gibt nur EINEN Eintrag pro Tag. Trägt man
   das Gewicht später am selben Tag nochmal ein,
   wird der bestehende Eintrag überschrieben statt
   ein neuer angelegt.
   ============================================ */

import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import './Gewichtlogger.css'

function Gewichtlogger() {

  /* ===== DATEN ===== */
  const [eintraege, setEintraege] = useLocalStorage('fitnessapp_gewicht', [])

  // Lokales Datum statt toISOString() (das ist UTC) — sonst bekommen
  // Einträge kurz nach Mitternacht das Datum des Vortags.
  function alsDatumString(date) {
    const jahr = date.getFullYear()
    const monat = (date.getMonth() + 1).toString().padStart(2, '0')
    const tag = date.getDate().toString().padStart(2, '0')
    return `${jahr}-${monat}-${tag}`
  }

  const heute = alsDatumString(new Date())
  const heutigerEintrag = eintraege.find(e => e.datum === heute)

  // Feld vorbelegen, falls für heute schon ein Gewicht existiert.
  // Nur beim ersten Rendern relevant (useState-Initialwert läuft einmal).
  const [gewicht, setGewicht] = useState(
    heutigerEintrag ? heutigerEintrag.gewicht.toString().replace('.', ',') : ''
  )


  /* ===== FUNKTIONEN ===== */

  function speichereGewicht() {
    const wert = parseFloat(gewicht.replace(',', '.'))
    if (!wert || wert <= 0) return

    const neuerEintrag = {
      datum: heute,
      gewicht: wert,
      zeitstempel: Date.now(),
    }

    const bestehenderIndex = eintraege.findIndex(e => e.datum === heute)

    if (bestehenderIndex !== -1) {
      // Heutigen Eintrag überschreiben statt einen zweiten anzulegen
      const kopie = [...eintraege]
      kopie[bestehenderIndex] = neuerEintrag
      setEintraege(kopie)
    } else {
      setEintraege([neuerEintrag, ...eintraege])
    }
  }

  function loescheEintrag(datum) {
    setEintraege(eintraege.filter(e => e.datum !== datum))
    if (datum === heute) setGewicht('')
  }

  // Verlauf immer chronologisch absteigend anzeigen, unabhängig
  // davon, an welcher Stelle im Array ein Eintrag liegt.
  const verlauf = [...eintraege].sort((a, b) => b.datum.localeCompare(a.datum))

  function formatiereDatum(datumString) {
    const [jahr, monat, tag] = datumString.split('-')
    const date = new Date(Number(jahr), Number(monat) - 1, Number(tag))
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })
  }


  /* ===== ANZEIGE ===== */

  return (
    <div className="gewicht-logger">

      {/* Eingabe-Karte */}
      <div className="gewicht-karte">
        <div className="gewicht-feld">
          <label>Gewicht (kg)</label>
          <input
            type="text"
            inputMode="decimal"
            value={gewicht}
            onChange={(e) => setGewicht(e.target.value)}
            placeholder="z.B. 78,4"
          />
        </div>

        <button className="speichern-btn" onClick={speichereGewicht}>
          {heutigerEintrag ? 'Gewicht aktualisieren' : 'Gewicht speichern'}
        </button>
      </div>


      {/* Verlauf */}
      {verlauf.length > 0 && (
        <div className="section">
          <div className="section-label">Verlauf</div>
          <div className="verlauf-liste">
            {verlauf.map(eintrag => (
              <div key={eintrag.datum} className="gewicht-zeile">
                <span className="gewicht-datum">
                  {eintrag.datum === heute ? 'Heute' : formatiereDatum(eintrag.datum)}
                </span>
                <span className="gewicht-wert">
                  {eintrag.gewicht.toString().replace('.', ',')} kg
                </span>
                <button
                  className="loeschen-btn"
                  onClick={() => loescheEintrag(eintrag.datum)}
                  aria-label="Eintrag löschen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default Gewichtlogger
